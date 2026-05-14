import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function syncExistingAdmin() {
  const email = 'admin@finova.com';
  
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list.users.find(u => u.email === email);
  
  if (existing) {
    console.log(`Syncing user: ${existing.email} (ID: ${existing.id})`);
    
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: existing.id,
        email: email,
        full_name: 'System Administrator',
        role: 'super_admin',
        kyc_status: 'verified',
        phone_number: '+910000000000',
        password_hash: 'ADMIN_BYPASS_HASH' // Satisfy NOT NULL constraint
      });

    if (userError) console.error('❌ Sync error:', userError.message);
    else {
        console.log('✅ User synced to public.users.');
        
        const { error: accError } = await supabase
          .from('accounts')
          .upsert({
            user_id: existing.id,
            account_number: '888899990000',
            balance: 1000000,
            account_status: 'active'
          });
          
        if (accError) console.error('❌ Account error:', accError.message);
        else console.log('✅ Admin account synced.');
    }
  } else {
    console.log('User not found in Auth.');
  }
}

syncExistingAdmin();
