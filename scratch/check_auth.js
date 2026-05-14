import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkAuthUsers() {
  console.log('--- Checking Supabase Auth Users ---');
  const { data: { users }, error } = await supabase.auth.admin.listUsers();
  
  if (error) {
    console.error('Error listing auth users:', error.message);
  } else {
    console.log(`Found ${users.length} users in Auth.`);
    users.forEach(u => {
      console.log(`- Email: ${u.email}, ID: ${u.id}, Last Login: ${u.last_sign_in_at}`);
    });
  }
}

checkAuthUsers();
