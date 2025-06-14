// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    // Pastikan variabel lingkungan ini sesuai dengan setup Anda
    'https://dmcvfgimtayxisldwmne.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtY3ZmZ2ltdGF5eGlzbGR3bW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MTg5MDcsImV4cCI6MjA2NTI5NDkwN30.8i2n7ZYWjIh2Yl1hcnLQdN0BLCeThpqnCv6vA2_GmwI',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Jika pengguna tidak login dan mencoba mengakses halaman admin
  if (!user && pathname.startsWith('/admin')) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  // Jika pengguna sudah login dan mencoba mengakses halaman login
  if (user && pathname.startsWith('/login')) {
    const url = new URL('/admin', request.url);
    return NextResponse.redirect(url);
  }

  return response;
}

// Konfigurasi path mana yang akan dijalankan oleh middleware
export const config = {
  matcher: [
    /*
     * Cocokkan semua path, kecuali untuk:
     * - file statis (_next/static)
     * - file gambar (_next/image)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
