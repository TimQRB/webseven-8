import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lakes Admin',
  description: 'Admin panel for lakes-backend',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
