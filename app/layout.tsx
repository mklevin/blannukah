import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Matt's Hanukkah List 2026 Election',
  description: 'The most important election of the year.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
