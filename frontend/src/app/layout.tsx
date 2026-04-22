import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

import '@/styles/globals.css';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Audit Trail',
  description: 'Centralized audit event ingestion and querying.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers>
          <header className="border-b border-border">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-6">
              <Link href="/" className="font-semibold tracking-tight">
                Audit Trail
              </Link>
              <nav className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link className="hover:text-foreground" href="/audit-events">
                  Events
                </Link>
                <Link className="hover:text-foreground" href="/audit-events/new">
                  Record
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
