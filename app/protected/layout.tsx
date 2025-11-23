/**
 * ProtectedLayout
 *
 * Layout component for pages that require user authentication.
 * Wraps the page content in a full-height flex container and can
 * include shared UI elements like a navbar or sidebar for protected pages.
 *
 * @param children - The React nodes to render inside the protected layout.
 * @returns A div container wrapping the protected page content.
 */
export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* optional shared navbar or sidebar for protected pages */}
            {children}
        </div>
    );
}
