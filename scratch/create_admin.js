import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function createAdminUser() {
  const email = 'admin@finova.com';
  const password = 'AdminPassword123!'; // User can change this later

  console.log(`--- Creating Admin User: ${email} ---`);

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (authError) {
    if (authError.message.includes('already exists')) {
      console.log('✅ User already exists in Auth.');
    } else {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }
  } else {
    console.log('✅ User created in Auth successfully.');
  }

  const userId = authData.user?.id;
  if (!userId) {
     // Fetch user id if already exists
     const { data: list } = await supabase.auth.admin.listUsers();
     const existing = list.users.find(u => u.email === email);
     if (existing) {
         await syncUser(existing.id, email);
     }
  } else {
      await syncUser(userId, email);
  }
}

async function syncUser(userId, email) {
    // 2. Ensure user exists in public.users with admin role
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        full_name: 'System Administrator',
        role: 'super_admin',
        kyc_status: 'verified',
        phone_number: '+910000000000' // Added to satisfy NOT NULL constraint
      });

    if (userError) {
      console.error('❌ Error syncing to public.users:', userError.message);
    } else {
      console.log('✅ User synced to public.users as super_admin.');
    }

    // 3. Create a test account for this admin
    const { error: accError } = await supabase
      .from('accounts')
      .upsert({
        user_id: userId,
        account_number: '888899990000',
        balance: 1000000,
        account_status: 'active'
      });
      
    if (accError) console.error('❌ Error creating account:', accError.message);
    else console.log('✅ Admin bank account created.');
}

createAdminUser();
