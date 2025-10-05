'use client';

import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <Link
                href="/login"
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
            >
                Back to Login
            </Link>
        </div>
    );
}
