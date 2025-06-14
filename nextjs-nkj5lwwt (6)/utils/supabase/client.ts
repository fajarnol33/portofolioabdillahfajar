import { createBrowserClient } from '@supabase/ssr';

// V V V PASTE URL ANDA DI SINI V V V
const supabaseUrl = 'https://dmcvfgimtayxisldwmne.supabase.co';
// V V V PASTE KUNCI ANON ANDA DI SINI V V V
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtY3ZmZ2ltdGF5eGlzbGR3bW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTg5MDcsImV4cCI6MjA2NTI5NDkwN30.8i2n7ZYWjIh2Yl1hcnLQdN0BLCeThpqnCv6vA2_GmwI';

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
