import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
    console.log("Adding columns...");
    // We try to add them. If it fails, we assume they might exist or we can't add them.
    const sql = `
        ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS sender_upi_id TEXT;
        ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS receiver_upi_id TEXT;
    `;
    // We don't have execute_sql, so we might need to use another way if available.
    // Let's check if we can use a simple query to check if they exist.
    const { data, error } = await supabase.from('transactions').select('sender_upi_id').limit(1);
    if (error && error.code === 'PGRST204') {
        console.log("Columns definitely missing.");
        // Try to rename sender_upi to sender_upi_id? 
        // No, let's just use the existing columns and map them.
    } else {
        console.log("Columns exist or other error:", error?.message);
    }
}

run();
