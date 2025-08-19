import type { Metadata } from 'next';
import { Montserrat, Bangers } from 'next/font/google';
import './globals.css';

import { Providers } from ' @/redux/Providers';
import SocketProvider from ' @/containers/SocketProvider';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const bangers = Bangers({
  variable: '--font-bangers',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FlashMatch-multiplayer',
  description: 'Instantly set a match, play games online with friends',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider url="http://localhost:3001" key="socket">
        <Providers key="redux">
          <body className={`${montserrat.variable} ${bangers.variable} overflow-hidden antialiased`}>{children}</body>
        </Providers>
      </SocketProvider>
    </html>
  );
}
