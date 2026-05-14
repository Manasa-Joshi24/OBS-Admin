import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testTables() {
  const tables = ['users', 'profiles', 'transactions', 'audit_logs', 'support_tickets', 'notifications', 'accounts', 'kyc_documents'];
  
  console.log('--- Testing Table Availability ---');
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ ${table}: ${error.message} (${error.code})`);
    } else {
      console.log(`✅ ${table}: Found! (Data count: ${data.length})`);
      if (data.length > 0) {
        console.log(`   Sample data:`, Object.keys(data[0]));
      }
    }
  }
}

testTables();
