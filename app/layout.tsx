import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Mu Online Season 6 - Web Portal & Engine',
  description: 'Portal completo para servidor de Mu Online Season 6 com rankings em tempo real, downloads, painel do jogador e checkout Pix automático via Mercado Pago.',
  openGraph: {
    title: 'Mu Online Season 6 - Web Portal & Engine',
    description: 'Portal completo para servidor de Mu Online Season 6 com rankings em tempo real, downloads, painel do jogador e checkout Pix automático via Mercado Pago.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mu Online Season 6 - Web Portal & Engine',
    description: 'Portal completo para servidor de Mu Online Season 6 com rankings em tempo real, downloads, painel do jogador e checkout Pix automático via Mercado Pago.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#09090b] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-black" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <div className="flex-1 w-full">
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

