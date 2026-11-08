import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  metadataBase: new URL('https://ogly-mouhib2.vercel.app'),
  title: 'Free OG Image Generator — Ogly',
  description:
    'Make a free 1200×630 OG image for your newsletter or blog in seconds. Type, pick a style, download the PNG. No sign-up, no watermark.',
  openGraph: {
    title: 'Free OG Image Generator — Ogly',
    description:
      'Make a free 1200×630 OG image for your newsletter or blog in seconds. Type, pick a style, download the PNG. No sign-up, no watermark.',
    url: 'https://ogly-mouhib2.vercel.app',
    siteName: 'Ogly',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
