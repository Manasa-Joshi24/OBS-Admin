import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runDiagnostics() {
  console.log('--- Database Diagnostics ---');
  
  const tables = ['users', 'accounts', 'transactions', 'cards', 'loans', 'audit_logs', 'support_tickets', 'user_roles'];
  
  for (const table of tables) {
    console.log(`\nChecking table: ${table}`);
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      console.log(`❌ Table ${table} Error: ${error.message} (${error.code})`);
    } else {
      console.log(`✅ Table ${table} exists. Columns:`, data.length > 0 ? Object.keys(data[0]) : 'Empty table');
    }
  }
}

runDiagnostics();
