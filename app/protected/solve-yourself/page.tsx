'use client';

import MethodCard from '@/components/ui/methodcard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/header';


export default function SolveYourself() {

    const router = useRouter();


    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
                <Header />

            <div className="justify-start flex w-full pl-[15%] pt-10">
                 <h1 className="text-2xl text-[var(--foreground)]">TODO: add title component</h1>
            </div>
            {/* TODO: Replace with question component :) */}
            <div className="flex h-40 w-5xl flex-row items-center gap-4 bg-[var(--card)]"></div>
            

            {/* TODO: add backend titles and descriptions */}
            <div className="flex flex-row items-center">
                {/* TODO: change link to "method" page */}
                <Button
                    className="mb-20 w-40 bg-[var(--primary)] hover:bg-[var(--primary)] hover:shadow-md m-6"
                    onClick={() => router.push('/protected/dashboard')}
                >
                    Use step-by-step
                </Button>
                {/* TODO: change link to "solution" popup */}
                <Button
                    className="mb-20 w-40 bg-[var(--accent)] hover:bg-[var(--accent)] hover:shadow-md m-6"
                    onClick={() => router.push('/protected/dashboard')}
                >
                    Go to answer
                </Button>
            </div>
        </div>
    );
}