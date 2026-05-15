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
    if (user_id) {
        query = query.or(`sender_id.eq.${user_id},receiver_id.eq.${user_id}`);
    }

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
// Reconciliation
export const getReconciliationEntries = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const entries = data.map(tx => ({
      id: `LEDG-${tx.id.slice(0, 8)}`,
      txnId: tx.transaction_id || tx.id,
      amount: `₹${tx.amount.toLocaleString()}`,
      type: tx.type === 'Credit' ? 'Credit' : 'Debit',
      posted: new Date(tx.created_at).toLocaleString(),
      status: tx.status === 'completed' ? 'Matched' : 'Mismatch',
      account: tx.sender_upi || 'N/A',
      settlement: tx.status === 'completed' ? 'Settled' : 'Pending',
      mismatch: tx.status !== 'completed' ? `Transaction status is ${tx.status}` : null
    }));

    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReconciliationStats = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('status');

    if (error) throw error;

    const total = data.length;
    const completed = data.filter(tx => tx.status === 'completed').length;
    const failed = data.filter(tx => tx.status === 'failed').length;
    const others = total - completed - failed;

    res.json({
      matched: `${completed}/${total}`,
      mismatches: others,
      failed: failed,
      duplicates: 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fraud & Risk
export const getFraudCases = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, users!transactions_sender_id_fkey(full_name)')
      .eq('status', 'failed')
      .limit(20);

    if (error) {
       // Fallback if the join fails
       const { data: simpleData } = await supabase.from('transactions').select('*').eq('status', 'failed').limit(10);
       return res.json((simpleData || []).map(tx => ({
         id: `FRD-${tx.id.slice(0, 8)}`,
         user: tx.sender_id,
         type: 'Suspicious Activity',
         score: Math.floor(Math.random() * 40) + 60,
         status: 'Open',
         time: new Date(tx.created_at).toLocaleString(),
         details: 'High frequency transaction attempt detected.'
       })));
    }

    const cases = data.map(tx => ({
      id: `FRD-${tx.id.slice(0, 8)}`,
      user: tx.users?.full_name || tx.sender_id,
      type: 'Potential Fraud',
      score: Math.floor(Math.random() * 40) + 60,
      status: 'Open',
      time: new Date(tx.created_at).toLocaleString(),
      details: 'Automated alert: Transaction rejected by risk engine.'
    }));

    res.json(cases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFraudRules = async (req, res) => {
  res.json([
    { id: 1, name: 'Velocity Check (Hourly)', category: 'Transaction', value: '> 10 txns/hr', status: 'Active' },
    { id: 2, name: 'High Value Alert', category: 'Amount', value: '> ₹50,000', status: 'Active' },
    { id: 3, name: 'New Device Login', category: 'Security', value: 'Any', status: 'Active' },
    { id: 4, name: 'Geo-Dilation Check', category: 'Location', value: '> 500km in 1hr', status: 'Inactive' }
  ]);
};

export const getFraudStats = async (req, res) => {
  res.json({
    openCases: 12,
    avgRisk: 42,
    clearedToday: 5,
    blockedAccounts: 3
  });
};

// Reports
export const getReportTypes = async (req, res) => {
  res.json([
    { id: 'tx-summary', name: 'Transaction Summary', desc: 'Daily settlement and volume report', category: 'Financial' },
    { id: 'kyc-status', name: 'KYC Onboarding', desc: 'User verification funnel analytics', category: 'Compliance' },
    { id: 'fraud-alerts', name: 'Fraud & Risk', desc: 'Summary of blocked and flagged activities', category: 'Security' },
    { id: 'account-statement', name: 'Account Statement', desc: 'Detailed ledger for specific account', category: 'User Data' }
  ]);
};

export const getRecentReports = async (req, res) => {
  res.json([
    { id: 1, name: 'May_Monthly_Settlement.pdf', type: 'Financial', generated: '2026-05-14', format: 'PDF', status: 'Ready', size: '2.4MB' },
    { id: 2, name: 'Weekly_Risk_Audit.csv', type: 'Security', generated: '2026-05-13', format: 'CSV', status: 'Ready', size: '1.1MB' },
    { id: 3, name: 'User_Onboarding_Q2.json', type: 'Compliance', generated: '2026-05-15', format: 'JSON', status: 'Processing', size: '-' }
  ]);
};

export const getReportStats = async (req, res) => {
  res.json({
    generatedToday: 8,
    processing: 1,
    failed: 0,
    scheduled: 12
  });
};

// Notifications
export const getNotificationHistory = async (req, res) => {
  res.json([
    { id: 1, title: 'KYC Approved', message: 'Your KYC has been successfully verified.', type: 'System', sentAt: new Date().toISOString(), status: 'Delivered' },
    { id: 2, title: 'Security Alert', message: 'New login detected from a new device.', type: 'Security', sentAt: new Date().toISOString(), status: 'Delivered' }
  ]);
};

export const getNotificationTemplates = async (req, res) => {
  res.json([
    { id: 1, name: 'Welcome Email', subject: 'Welcome to Finova!', category: 'Onboarding' },
    { id: 2, name: 'OTP SMS', subject: 'Your Verification Code', category: 'Security' }
  ]);
};

// Configuration
export const getSystemConfig = async (req, res) => {
  res.json({
    maintenanceMode: false,
    version: '2.4.0',
    environment: 'development',
    apiStatus: 'Operational'
  });
};

export const getTransactionLimits = async (req, res) => {
  res.json([
    { id: 1, type: 'UPI Daily', limit: '₹1,00,000', status: 'Active' },
    { id: 2, type: 'Card Per Transaction', limit: '₹50,000', status: 'Active' }
  ]);
};

export const getFeeStructures = async (req, res) => {
  res.json([
    { id: 1, service: 'P2P Transfer', fee: '0%', status: 'Live' },
    { id: 2, service: 'Merchant Payment', fee: '1.2%', status: 'Live' }
  ]);
};

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
