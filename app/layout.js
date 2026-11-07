import './globals.css';

export const metadata = {
  title: 'Ogly — Free OG Image Generator',
  description:
    'Make an on-brand OG image for your newsletter or blog post in seconds. Free, no sign-up.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
