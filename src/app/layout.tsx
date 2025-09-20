
'use client';
import { useEffect } from 'react';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

// export const metadata: Metadata = {
//   title: 'CC Expense',
//   description: 'Manage your credit card expenses with ease.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    document.title = 'CC Expense';
    const handleContextmenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.shiftKey && e.keyCode === 73)) {
        e.preventDefault();
      }
      // Ctrl+Shift+J
      if ((e.ctrlKey && e.shiftKey && e.key === 'J') || (e.ctrlKey && e.shiftKey && e.keyCode === 74)) {
        e.preventDefault();
      }
      // Ctrl+U
      if ((e.ctrlKey && e.key === 'U') || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextmenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextmenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-screen overflow-hidden">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
