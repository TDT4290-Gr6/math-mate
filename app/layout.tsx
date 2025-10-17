import { LoggerProvider } from './components/logger/LoggerProvider';
import { Geist, Geist_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'MathMate',
    applicationName: 'MathMate',
    description: 'MathMate — Generative AI and solving math word problems',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                    enableColorScheme
                >
                    <Providers>{children}</Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
