import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('--- Checking Database Tables ---');
  const { data: tables, error } = await supabase
    .from('information_schema.tables')
    .select('table_name')
    .eq('table_schema', 'public');

  if (error) {
    console.error('Error fetching tables:', error);
  } else {
    console.log('Tables in public schema:', tables.map(t => t.table_name));
  }

  console.log('\n--- Checking columns for "users" (if exists) ---');
  const { data: cols, error: colError } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', 'users');

  if (colError) {
    console.error('Error fetching columns:', colError);
  } else if (cols) {
    console.log('Columns in "users" table:', cols.map(c => c.column_name));
  }

  console.log('\n--- Checking columns for "profiles" (if exists) ---');
  const { data: pCols, error: pColError } = await supabase
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_name', 'profiles');

  if (pColError) {
    console.error('Error fetching columns:', pColError);
  } else if (pCols) {
    console.log('Columns in "profiles" table:', pCols.map(c => c.column_name));
  }
}

checkSchema();
