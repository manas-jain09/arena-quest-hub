
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nohnpvajrckxgvbotyex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vaG5wdmFqcmNreGd2Ym90eWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Njk2MTIsImV4cCI6MjA1NzM0NTYxMn0.WFs88RPgY3F_k54EIksz_ih9VoKPGuSNUXtBEwpOFqY';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'astra-app'
    }
  }
});

// Note: The Supabase JS client doesn't provide direct methods to configure 
// retry parameters on the storage client. If you need retry functionality,
// you would need to implement it manually in your upload functions.
// 
// Example of manual retry implementation for file uploads:
// 
// export async function uploadWithRetry(bucket: string, path: string, file: File, options = {}) {
//   const maxRetries = 3;
//   let attempt = 0;
//   
//   while (attempt < maxRetries) {
//     try {
//       const { data, error } = await supabase.storage.from(bucket).upload(path, file, options);
//       if (error) throw error;
//       return { data, error: null };
//     } catch (error) {
//       attempt++;
//       if (attempt >= maxRetries) return { data: null, error };
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
//     }
//   }
// }

