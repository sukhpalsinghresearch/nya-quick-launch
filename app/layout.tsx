import type { Metadata } from 'next';
import { Hanken_Grotesk, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AnonymousSessionTracker } from '@/components/analytics/anonymous-session-tracker';

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
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-KNJTX6YEV3" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-KNJTX6YEV3');
            `,
          }}
        />
      </head>
      <body className={`${hanken.variable} ${playfair.variable}`}>
        <AnonymousSessionTracker />
        {children}
      </body>
    </html>
  );
}
