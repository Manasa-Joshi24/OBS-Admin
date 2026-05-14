import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTransactions() {
  const { data: cols, error } = await supabase
    .from('transactions')
    .select('*')
    .limit(0); // This might not return columns if empty in some clients, but let's try another way

  // Correct way to get columns for any table in Postgres via SQL
  const { data: colInfo, error: sqlError } = await supabase.rpc('get_table_columns', { table_name: 'transactions' });
  
  // If RPC doesn't exist, try a simple query and check the keys of an empty object if possible, 
  // or just use a raw SQL query if we had execute_sql.
  
  // Let's try to insert a dummy row and rollback? No, too risky.
  
  // Let's just try to select 1 and hope it works or use the error hint.
  const { error: hintError } = await supabase.from('transactions').select('non_existent_column');
  console.log('Hint from transactions error:', hintError?.message);
}

checkTransactions();
