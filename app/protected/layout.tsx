// app/layout.tsx (server component)
import { redirect } from 'next/navigation';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // block all pages except login if not authenticated
    //TODO: Replace with real auth check
    if (false) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen flex-col">
            {/* optional shared navbar or sidebar for protected pages */}
            {children}
        </div>
    );
}
