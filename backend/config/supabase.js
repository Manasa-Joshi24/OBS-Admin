import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL: Supabase credentials missing! Check .env file.');
} else {
  console.log('Supabase client initialized with URL:', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
