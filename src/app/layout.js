import { Inter } from 'next/font/google';
import './globals.css';
import StoreProvider from '@/store/StoreProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'Pangandaran.ai — Teman Pintar Jelajah Pangandaran',
  description:
    'Chatbot wisata berbasis AI untuk membantu Anda menjelajahi Pangandaran. Temukan pantai, penginapan, kuliner, dan informasi wisata lainnya.',
  keywords: ['Pangandaran', 'wisata', 'chatbot', 'AI', 'travel', 'pantai'],
  // OpenGraph — controls how the link appears when shared on WhatsApp, Facebook, etc.
  openGraph: {
    title: 'Pangandaran.ai — Teman Pintar Jelajah Pangandaran',
    description: 'Chatbot wisata berbasis AI untuk menjelajahi Pangandaran.',
    siteName: 'Pangandaran.ai',
    type: 'website',
    locale: 'id_ID',
    // TODO: Replace with your actual deployed URL and OG image
    // url: 'https://pangandaran.ai',
    // images: [{ url: 'https://pangandaran.ai/og-image.png', width: 1200, height: 630 }],
  },
  // Twitter Card — controls how the link appears when shared on Twitter/X
  twitter: {
    card: 'summary_large_image',
    title: 'Pangandaran.ai — Teman Pintar Jelajah Pangandaran',
    description: 'Chatbot wisata berbasis AI untuk menjelajahi Pangandaran.',
    // TODO: Replace with actual image URL
    // images: ['https://pangandaran.ai/og-image.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.variable}>
        <StoreProvider>
          <div className="appWrapper">
            <div className="mobileContainer">
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
