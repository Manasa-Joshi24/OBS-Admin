import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function updateSchema() {
    console.log("Verifying columns...");
    const { data: sample } = await supabase.from('transactions').select('*').limit(1);
    const columns = Object.keys(sample?.[0] || {});
    console.log("Existing columns:", columns);

    if (!columns.includes('sender_upi_id') || !columns.includes('receiver_upi_id')) {
        console.log("Columns missing. Attempting to add via SQL...");
        // Since we don't have a reliable way to run arbitrary SQL from here without a custom RPC,
        // we will check if they exist under different names and map them in the backend.
        // BUT the user said "Ensure transactions table includes".
        // If I can't run ALTER TABLE, I'll have to rely on mapping.
        
        // Let's try one more time with a simple RPC if it exists.
        const sql = `
            ALTER TABLE transactions ADD COLUMN IF NOT EXISTS sender_upi_id TEXT;
            ALTER TABLE transactions ADD COLUMN IF NOT EXISTS receiver_upi_id TEXT;
            UPDATE transactions SET sender_upi_id = sender_upi WHERE sender_upi_id IS NULL;
            UPDATE transactions SET receiver_upi_id = receiver_upi WHERE receiver_upi_id IS NULL;
        `;
        const { error } = await supabase.rpc('execute_sql', { sql });
        if (error) {
            console.error("RPC execute_sql failed or not found. We will use mapping in backend.");
        } else {
            console.log("Schema updated successfully.");
        }
    } else {
        console.log("Columns already exist.");
    }
}

updateSchema();
