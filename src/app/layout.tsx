import type { Metadata } from 'next';
import { Montserrat, Bangers } from 'next/font/google';
import './globals.css';
import NavigationContext from ' @/components/NavigationContext';
import Link from ' @/components/Link';
import AnimatePage from ' @/components/AnimatePage';

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
      <body className={`${montserrat.variable} ${bangers.variable} h-[100vh] antialiased`}>
        <NavigationContext>
          <nav className="flex-center h-12 w-100 justify-around">
            <Link className="bg-slate-900 px-2 py-1 text-white" href="/">
              Home
            </Link>
            <Link className="bg-slate-900 px-2 py-1 text-white" href="/chess">
              Chess
            </Link>
            <Link className="bg-slate-900 px-2 py-1 text-white" href="/colorwars">
              Color Wars
            </Link>
          </nav>
          <AnimatePage>{children}</AnimatePage>
        </NavigationContext>
      </body>
    </html>
  );
}
