import { supabase } from '../config/supabase.js';

// User Management
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, kyc_status } = req.query;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // We join with accounts to get the status
    let query = supabase
      .from('users')
      .select('*, accounts(account_status, balance)', { count: 'exact' });

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    if (kyc_status) query = query.eq('kyc_status', kyc_status);
    
    const { data, count, error } = await query.range(from, to).order('created_at', { ascending: false });

    // Debug logging
    console.log('GetUsers Debug:', { usersCount: data?.length, count, error });

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    console.log(`Fetched ${data.length} users from Supabase.`);

    // Flatten the accounts data for the frontend
    const users = data.map(u => ({
      ...u,
      user_id: u.id, 
      account_status: u.accounts?.[0]?.account_status || 'active',
      balance: u.accounts?.[0]?.balance || 0
    }));

    console.log('Transformed users data ready for frontend:', users.length);
    res.json({ users, total: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('accounts')
      .update({ account_status: status })
      .eq('user_id', userId);

    if (error) throw error;
    res.json({ message: `Account status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Transaction Management
export const getTransactions = async (req, res) => {
  try {
    const { status, type, user_id } = req.query;
    console.log("Fetching transactions with filters:", { status, type, user_id });
    
    let query = supabase.from('transactions').select('*');

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    if (user_id) query = query.eq('sender_id', user_id); // Using sender_id as the primary user filter

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching transactions:", error);
        if (error.code === 'PGRST205') return res.json([]);
        throw error;
    }
    
    console.log("Transactions API fetched data count:", data?.length || 0);
    console.log("Transactions API sample data:", data?.[0]);

    // Map fields for frontend:
    const mappedData = data.map(tx => ({
        ...tx,
        transaction_id: tx.id,
        reference_number: tx.id,
        transaction_type: tx.type,
        transaction_status: tx.status,
        timestamp: tx.created_at,
        sender: tx.sender_upi || tx.sender_id,
        receiver: tx.receiver_upi || tx.receiver_id,
        sender_upi_id: tx.sender_upi_id || tx.sender_upi || "N/A",
        receiver_upi_id: tx.receiver_upi_id || tx.receiver_upi || "N/A"
    }));

    res.json(mappedData);
  } catch (error) {
    console.error("getTransactions Catch Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { 
      user_id, amount, transaction_type, reference_number, 
      transaction_status, sender_upi_id, receiver_upi_id 
    } = req.body;
    
    console.log("Received transaction creation request:", req.body);

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          sender_id: user_id,
          amount,
          type: transaction_type,
          status: transaction_status || 'pending',
          sender_upi: sender_upi_id || reference_number,
          receiver_upi: receiver_upi_id
        }
      ])
      .select();

    console.log("Inserted transaction result:", data, error);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ success: true, data: data[0] });
  } catch (error) {
    console.error("createTransaction Catch Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const processTransaction = async (req, res) => {
  const { transactionId } = req.params;
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId);

    if (error) throw error;
    res.json({ message: `Transaction ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// KYC Verification
export const verifyKYC = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  try {
    const { error } = await supabase
      .from('users')
      .update({ kyc_status: status })
      .eq('id', userId);

    if (error) throw error;
    res.json({ message: `KYC status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Account Oversight
export const getAccounts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*, users(full_name, email, kyc_status)')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return res.json([]);
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Card Management
export const getCards = async (req, res) => {
  try {
    const { user_id } = req.query;
    let query = supabase
      .from('cards')
      .select('*, users(full_name), accounts(account_number)');
      
    if (user_id) query = query.eq('user_id', user_id);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return res.json([]);
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Loan Operations
export const getLoans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select('*, users(full_name)')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === 'PGRST205') return res.json([]);
      throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// System Analytics
export const getAnalytics = async (req, res) => {
  try {
    const today = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Last 24 hours
    const [
      { count: totalUsers, error: err1 },
      { count: activeAccountsCount, error: err2 },
      { data: todayTransactions, error: err3 },
      { count: pendingKycUsers, error: err4 },
      { count: securityFlags, error: err5 },
      { count: failedTransactions, error: err6 }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('account_status', 'active'),
      supabase.from('transactions').select('amount').gte('created_at', today),
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('kyc_status', 'pending'),
      supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('fraud_flag', true),
      supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'failed').gte('created_at', today)
    ]);

    if (err1) console.error('Analytics Error (totalUsers):', err1.message);
    if (err2) console.error('Analytics Error (activeAccounts):', err2.message);
    if (err3) console.error('Analytics Error (todayTransactions):', err3.message);
    if (err4) console.error('Analytics Error (pendingKycUsers):', err4.message);
    if (err5) console.error('Analytics Error (securityFlags):', err5.message);
    if (err6) console.error('Analytics Error (failedTransactions):', err6.message);

    console.log('Analytics Debug (Counts):', { totalUsers, activeAccountsCount, pendingKycUsers, securityFlags });
    
    const totalTransactionVolume = todayTransactions?.reduce((sum, tx) => sum + Number(tx.amount || 0), 0) || 0;
    console.log('Volume Debug:', { transactionsCount: todayTransactions?.length, totalTransactionVolume });

    // Additional Account Metrics
    const { count: totalAccounts } = await supabase.from('accounts').select('*', { count: 'exact', head: true });
    const { count: restrictedAccounts } = await supabase.from('accounts').select('*', { count: 'exact', head: true }).neq('account_status', 'active');

    // Additional Card Metrics
    const { count: totalCards } = await supabase.from('cards').select('*', { count: 'exact', head: true });
    const { count: activeCards } = await supabase.from('cards').select('*', { count: 'exact', head: true }).eq('status', 'active');

    // Additional Loan Metrics
    const { count: totalLoans } = await supabase.from('loans').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { count: pendingLoans } = await supabase.from('loans').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    res.json({
      totalUsers: totalUsers || 0,
      activeUsers: activeAccountsCount || 0,
      totalAccounts: totalAccounts || 0,
      activeAccounts: activeAccountsCount || 0,
      restrictedAccounts: restrictedAccounts || 0,
      totalCards: totalCards || 0,
      activeCards: activeCards || 0,
      totalLoans: totalLoans || 0,
      pendingLoans: pendingLoans || 0,
      todayTransactionVolume: totalTransactionVolume,
      todayTransactionCount: todayTransactions?.length || 0,
      pendingKyc: pendingKycUsers || 0,
      securityFlags: securityFlags || 0,
      failedTransactions: failedTransactions || 0
    });
  } catch (error) {
    console.error('Analytics Catch Error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const days = 7;
    const chartData = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setHours(0,0,0,0);
      start.setDate(start.getDate() - i);
      
      const end = new Date(start);
      end.setHours(23,59,59,999);
      
      const dayName = start.toLocaleDateString('en-US', { weekday: 'short' });
      
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, status')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());
        
      if (error) throw error;
      
      const success = data.filter(tx => tx.status === 'completed').reduce((sum, tx) => sum + tx.amount, 0);
      const failed = data.filter(tx => tx.status === 'failed').reduce((sum, tx) => sum + tx.amount, 0);
      
      chartData.push({ day: dayName, success, failed });
    }
    
    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Audit Logs
export const getAuditLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
        if (error.code === 'PGRST205') return res.json([]);
        throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Support Tickets
export const getSupportTickets = async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('support_tickets').select('*');
    if (status) query = query.eq('status', status);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
        if (error.code === 'PGRST205') return res.json([]);
        throw error;
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.log('Supabase Login Error:', error.message);
      throw error;
    }

    // Check role
    let role = 'user';
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
    if (userData) role = userData.role;

    const adminRoles = ['super_admin', 'admin', 'compliance_officer', 'support_agent', 'fraud_analyst'];
    if (!adminRoles.includes(role)) {
      return res.status(403).json({ error: 'Access denied: Not an administrator' });
    }

    res.json({
      user: data.user,
      session: data.session,
      role: role
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
