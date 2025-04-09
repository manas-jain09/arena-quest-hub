
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nohnpvajrckxgvbotyex.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vaG5wdmFqcmNreGd2Ym90eWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3Njk2MTIsImV4cCI6MjA1NzM0NTYxMn0.WFs88RPgY3F_k54EIksz_ih9VoKPGuSNUXtBEwpOFqY';

export const supabase = createClient(supabaseUrl, supabaseKey);
