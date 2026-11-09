import type { Metadata } from 'next';
import { Libre_Franklin, Manufacturing_Consent } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: 'Matt\'s Hanukkah List 2026 Election',
  description: 'The most important election of the year.',
};

const franklin = Libre_Franklin({
  subsets: ['latin'],
  weight: ['400', '600']
});

const manufact = Manufacturing_Consent({
  subsets: ['latin'],
  weight: '400'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${franklin.className} ${manufact.className}`}>
      <head>
        <link rel="preconnect" href="https://github.io/" />
        <link
          rel="stylesheet"
          href="https://vetrivelcsamy.github.io/cheltenham-classic/cheltenhamclassic.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
