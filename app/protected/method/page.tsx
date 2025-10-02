'use client';

import MethodCard from '@/components/ui/methodcard';
import Link from 'next/link';

export default function MethodPage() {
    return (
        <div className="justify-top flex min-h-screen flex-col items-center gap-6">
            <div className="flex w-full flex-row justify-between px-10 py-6">
                {/* TODO: Replace with backbutton */}
                <div className="h-10 w-10 bg-[var(--accent)]"></div>

                {/* TODO: Replace with hamburger :) */}
                <div className="h-10 w-10 bg-[var(--accent)]"></div>
            </div>

            <h1 className="text-2xl font-bold">Method Page</h1>
            <Link
                href="/protected/dashboard"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700"
            >
                Go to Dashboard
            </Link>
            <MethodCard
                title="Welcome!"
                description="This is a reusable square card component."
                buttonText="Get Started"
                onButtonClick={() => alert('Button clicked!')}
            />
        </div>
    );
}
