'use client';

import Header from '@/components/ui/header';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header variant="question" mathQuestion={<div className='h-52 w-[60%] justify-center items-center bg-[var(--card)] flex'> <h1>TODO: add math question component here</h1></div>} />
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <Link
                href="/login"
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Back to Login
            </Link>
        </div>
    );
}
