'use client';

import MethodCard from '@/components/ui/methodcard';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

/**
 * The page component that displays a set of method cards to help solve
 * a math problem. Users can also choose to solve the problem on their own.
 */
export default function MethodPage() {
    //TODO: backend functionality for method and methodcount
    const [methodCount, setMethodCount] = useState(3);
    const router = useRouter();
    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            {/* TODO: Replace with question component :) */}
            <Header
                variant="question"
                mathQuestion={
                    <div className="flex h-40 w-5xl flex-row items-center justify-center gap-4">
                        {' '}
                        <p>TODO fix question component</p>
                    </div>
                }
            />

            <div className="px-[15%] pt-4">
                <p className="text-[var(--foreground)]">
                    To help you with the math problem you will be provided a set
                    of methods you can use to solve the problem. You don&#39;t
                    have to use any of these provided methods, but they are
                    meant to provide guidance in solving the problem. It&#39;s
                    up to you which method to use.
                </p>
            </div>

            {/* TODO: add backend titles and descriptions */}
            <div
                className={`flex w-full flex-col lg:flex-row ${methodCount === 3 ? 'max-w-6xl' : 'max-w-5xl'} px-10`}
            >
                {Array.from({ length: methodCount }).map((_, i) => (
                    <MethodCard
                        key={i}
                        title={`Method ${i + 1}`}
                        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
                        buttonText="Get Started"
                        onButtonClick={() =>
                            alert(`Button clicked for method ${i + 1}!`)
                        }
                    />
                ))}
            </div>
            <div className="flex flex-col items-center">
                <p className="pb-4 text-[var(--foreground)]">or</p>
                {/* TODO: change link to "solve on your own" page */}
                <Button
                    className="mb-20 w-46 bg-[var(--accent)]"
                    onClick={() => router.push('/protected/dashboard')}
                >
                    Solve on your own
                </Button>
            </div>
        </div>
    );
}
