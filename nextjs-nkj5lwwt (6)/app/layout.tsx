import type { Metadata } from 'next';
import './globals.css';
import PageWrapper from '@/components/PageWrapper';
import { createClient } from '@/utils/supabase/server';
// Hapus import AOSInit dari sini

export const metadata: Metadata = {
  title: 'Portofolio Abdillah Fajar',
  description: 'Portofolio pribadi dibuat dengan Next.js dan Supabase',
};

async function getSiteSettings() {
  const supabase = createClient();
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('intro_text')
      .single();
    return data;
  } catch (error) {
    console.error('Could not fetch site settings, using default.', error);
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const introText =
    settings?.intro_text || 'Selamat Datang\ndi Portofolio Saya';

  return (
    <html lang="id" className="!scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-custom-dark overflow-x-hidden">
        {/* Hapus pemanggilan AOSInit dari sini */}
        <PageWrapper introText={introText}>{children}</PageWrapper>
      </body>
    </html>
  );
}