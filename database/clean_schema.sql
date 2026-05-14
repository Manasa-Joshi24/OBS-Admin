-- FINOVA ADMIN PORTAL MASTER SCHEMA CLEANUP
-- This script resets and standardizes the database schema for clean integration.

-- 0. POLICY CLEANUP (Prevent duplicate policy errors)
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all accounts" ON public.accounts;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

-- 1. CLEANUP (Careful: This drops existing data to ensure a clean start)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS loans CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;

-- 2. TABLES STRUCTURE

-- Users (Assuming table exists, ensure role column)
-- If users doesn't exist, this might fail, so we use a check
DO $$ 
BEGIN 
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
        ALTER TABLE public.users ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Accounts
CREATE TABLE public.accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    account_number TEXT UNIQUE NOT NULL,
    account_type TEXT DEFAULT 'savings',
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'INR',
    account_status TEXT DEFAULT 'active',
    upi_id TEXT UNIQUE,
    ifsc_code TEXT DEFAULT 'FINO0001234',
    branch_name TEXT DEFAULT 'Main Branch',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transactions
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender TEXT,
    receiver TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    payment_type TEXT DEFAULT 'UPI',
    status TEXT DEFAULT 'pending', 
    fraud_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards
CREATE TABLE public.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.accounts(id) ON DELETE CASCADE,
    card_type TEXT DEFAULT 'debit',
    card_brand TEXT DEFAULT 'Visa',
    masked_card_number TEXT NOT NULL,
    expiry_date TEXT NOT NULL,
    card_status TEXT DEFAULT 'active',
    freeze_status BOOLEAN DEFAULT FALSE,
    online_limit DECIMAL(15, 2) DEFAULT 50000,
    atm_limit DECIMAL(15, 2) DEFAULT 20000,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Loans
CREATE TABLE public.loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    loan_type TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    term_months INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    emi_amount DECIMAL(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.users(id),
    action TEXT NOT NULL,
    target_resource TEXT,
    target_user_id UUID,
    ip_address TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Support Tickets
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'general',
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEST DATA INSERTION
DO $$
DECLARE
    v_user_id UUID;
    v_account_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM public.users LIMIT 1;

    IF v_user_id IS NOT NULL THEN
        -- Standardize user
        UPDATE public.users SET role = 'super_admin', kyc_status = 'verified' WHERE id = v_user_id;

        -- Create Account
        INSERT INTO public.accounts (user_id, account_number, balance, upi_id)
        VALUES (v_user_id, '1234567890', 50000.00, 'testuser@finova')
        ON CONFLICT DO NOTHING
        RETURNING id INTO v_account_id;

        -- Create Transactions
        INSERT INTO public.transactions (user_id, sender, receiver, amount, status, created_at)
        VALUES 
        (v_user_id, 'Test User', 'Amazon India', 1299.00, 'completed', NOW() - INTERVAL '1 hour'),
        (v_user_id, 'Zomato', 'Test User', 450.00, 'completed', NOW() - INTERVAL '2 hours'),
        (v_user_id, 'Test User', 'Unknown Sender', 15000.00, 'flagged', NOW() - INTERVAL '5 hours');

        -- Create Support Ticket
        INSERT INTO public.support_tickets (user_id, subject, description, priority, status)
        VALUES (v_user_id, 'Unable to complete KYC', 'My document upload is failing consistently.', 'high', 'open');

        -- Create Audit Log
        INSERT INTO public.audit_logs (admin_id, action, target_user_id)
        VALUES (v_user_id, 'Viewed User Profile', v_user_id);

        -- Create Card
        INSERT INTO public.cards (user_id, account_id, masked_card_number, expiry_date, card_brand)
        VALUES (v_user_id, v_account_id, 'XXXX XXXX XXXX 4589', '12/28', 'MasterCard');
    END IF;
END $$;

-- 4. RLS POLICIES (Enforce Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('super_admin', 'admin', 'compliance_officer')
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Admins can view all users" ON public.users FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can update users" ON public.users FOR UPDATE TO authenticated USING (is_admin());
CREATE POLICY "Admins can view all accounts" ON public.accounts FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT TO authenticated USING (is_admin());
