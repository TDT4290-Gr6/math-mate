'use client';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-[var(--color-background)]">
            <h1 className="text-2xl font-bold">Login Page</h1>
            <Link
                //TODO: Change when auth is implemented
                href="/protected/dashboard"
                className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg shadow"
            >
                Go to Dashboard
            </Link>
        </div>
    );
}
