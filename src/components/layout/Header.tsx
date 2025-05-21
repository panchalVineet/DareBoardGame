
// src/components/layout/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle'; // Added

export function AppHeader() {
  return (
    <header className="py-4 px-6 bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity">
          Drunk Steps
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle /> {/* Added */}
          <Button variant="ghost" size="icon" asChild className="h-9 w-9">
            <Link href="/">
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
