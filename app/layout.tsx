import type { Metadata } from 'next';
import { Libre_Franklin, Manufacturing_Consent, PT_Serif } from 'next/font/google';
import './globals.css';

import SiteShell from "@/app/components/site-shell"
import { ElectionDataProvider } from "@/app/components/data/election-data-provider";

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

const ptSerif = PT_Serif({
  subsets: ['latin'],
  weight: '400'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${franklin.className} ${manufact.className} ${ptSerif.className}`}>
      <head>
        <link rel="preconnect" href="https://github.io/" />
        <link
          rel="stylesheet"
          href="https://vetrivelcsamy.github.io/libre-cheltenham/librecheltenham.css"
        />
      </head>
      <body>
        <ElectionDataProvider>
          <SiteShell>
            {children}
          </SiteShell>
        </ElectionDataProvider>
      </body>
    </html>
  );
}
