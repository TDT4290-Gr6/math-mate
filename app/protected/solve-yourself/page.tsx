'use client';

import MethodCard from '@/components/ui/methodcard';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SolveYourself() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header />

            <div className="flex w-full justify-start pt-10 pl-[15%]">
                <h1 className="text-2xl text-[var(--foreground)]">
                    TODO: add title component
                </h1>
            </div>
            {/* TODO: Replace with question component :) */}
            <div className="flex h-40 w-5xl flex-row items-center gap-4 bg-[var(--card)]"></div>

            {/* TODO: add backend titles and descriptions */}
            <div className="flex flex-row items-center">
                {/* TODO: change link to "method" page */}
                <Button
                    className="m-6 mb-20 w-40 bg-[var(--primary)] hover:bg-[var(--primary)] hover:shadow-md"
                    onClick={() => router.push('/protected/dashboard')}
                >
                    Use step-by-step
                </Button>
                {/* TODO: change link to "solution" popup */}
                <Button
                    className="m-6 mb-20 w-40 bg-[var(--accent)] hover:bg-[var(--accent)] hover:shadow-md"
                    onClick={() => router.push('/protected/dashboard')}
                >
                    Go to answer
                </Button>
            </div>
        </div>
    );
}
