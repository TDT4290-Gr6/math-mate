'use client';

import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <h1 className="text-2xl font-bold">Login Page</h1>
            <Link
                //TODO: Change when auth is implemented
                href="/protected/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
                Go to Dashboard
            </Link>
        </div>
    );
}
