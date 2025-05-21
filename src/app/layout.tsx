
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { GameProvider } from '@/contexts/GameContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Drunk Steps - The Ultimate Party Board Game',
  description: 'A fun multiplayer drinking board game with dares at every step. Built with Next.js and Firebase Studio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${geistSans.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}>
        <ThemeProvider>
          <GameProvider>
            <div className="flex-grow">
              {children}
            </div>
            <Toaster />
          </GameProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
