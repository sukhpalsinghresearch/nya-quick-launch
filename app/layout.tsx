import type { Metadata } from 'next';
import { Hanken_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Not Your Average',
  description: 'The NYA home, BIOS Hackathon and UCS503 Software Engineering resources.',
  metadataBase: new URL('https://notyouraverage.xyz'),
  openGraph: {
    title: 'Not Your Average',
    description: 'For everyone who believes we can do better.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Not Average Resource Node' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Not Your Average',
    description: 'For everyone who believes we can do better.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} ${playfair.variable}`}>
        {children}
      </body>
    </html>
  );
}
