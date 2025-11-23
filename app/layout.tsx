import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';
import type { Metadata } from 'next';
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

/**
 * RootLayout
 *
 * The top-level layout for the application. Sets up global styles, fonts,
 * and theme handling. Wraps all pages with the ThemeProvider and other
 * context providers via the `Providers` component.
 *
 * @param children - The React nodes representing the page content.
 * @returns The HTML structure including <html> and <body> tags, with theme and font setup.
 */
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
