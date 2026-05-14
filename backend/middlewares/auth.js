import { supabase } from '../config/supabase.js';

export const authenticateAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header received:', authHeader ? 'Present' : 'Missing');

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('401: No Bearer token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.log('401: Supabase auth.getUser failed. Token:', token.substring(0, 10) + '...', 'Error:', error?.message || 'No user');
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    console.log('Token verified for user:', user.email);

    // Check for role in user_roles table or users table
    let role = null;
    
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (roleData) {
      role = roleData.role;
    } else {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (userData) {
        role = userData.role;
      }
    }

    console.log('User role detected:', role);

    const adminRoles = ['super_admin', 'admin', 'compliance_officer', 'support_agent', 'fraud_analyst'];
    
    if (!role || !adminRoles.includes(role)) {
      console.log('403: Forbidden - Role not allowed:', role);
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    req.user = user;
    req.admin = { role };
    next();
  } catch (err) {
    console.error('Auth middleware catch error:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin || !allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
