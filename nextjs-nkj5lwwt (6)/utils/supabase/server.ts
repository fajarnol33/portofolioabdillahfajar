// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// V V V PASTE URL ANDA DI SINI V V V
const supabaseUrl = 'https://dmcvfgimtayxisldwmne.supabase.co';
// V V V PASTE KUNCI ANON ANDA DI SINI V V V
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtY3ZmZ2ltdGF5eGlzbGR3bW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTg5MDcsImV4cCI6MjA2NTI5NDkwN30.8i2n7ZYWjIh2Yl1hcnLQdN0BLCeThpqnCv6vA2_GmwI';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}
