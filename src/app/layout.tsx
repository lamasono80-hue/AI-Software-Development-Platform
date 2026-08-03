import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'DevPilot AI - Nền tảng AI Phân tích, Thiết kế & Phát triển Phần mềm',
  description: 'Nền tảng AI thế hệ mới tự động phân tích yêu cầu, sinh SRS, ERD Diagram, UML, API Specs, SQL & Code cho Sinh viên CNTT và Đội ngũ lập trình.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${inter.variable} ${mono.variable} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        {children}
        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
