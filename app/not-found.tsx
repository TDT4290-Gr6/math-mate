'use client';
import { PanelsTopLeft, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import Title from './components/ui/title';
import Link from 'next/link';

/**
 * NotFoundPage
 *
 * A client-side 404 page displayed when a user navigates to a route
 * that does not exist. Includes a styled error message, a decorative
 * icon stack, and a button linking back to the main menu.
 *
 * @returns A React component rendering the 404 error page.
 */
export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <div className="flex max-w-[80%] flex-col items-center justify-center rounded-3xl bg-[var(--card)] shadow-sm lg:max-w-[50%]">
                {/* row for title and icons */}
                <div className="flex flex-row items-center gap-20 py-4">
                    {/* Title section */}
                    <div className="flex flex-1 flex-col items-center justify-center">
                        <Title title="404" size={120} />
                        <div className="flex flex-row gap-2 py-4">
                            <div className="mt-3 h-2.5 w-6 rounded-[5px] bg-[var(--accent)]"></div>
                            <h1 className="text-center text-xl md:text-2xl">
                                Page Not Found
                            </h1>
                        </div>
                    </div>
                    {/* stack with search icon on top of panels icon */}
                    <div
                        className="relative hidden flex-1 items-center lg:block"
                        aria-hidden="true"
                    >
                        {/* Base panel icon */}
                        <PanelsTopLeft
                            className="mr-8 size-36 text-[var(--primary)] opacity-20"
                            aria-hidden="true"
                        />

                        {/* Magnifying glass group */}
                        <div className="absolute inset-0 flex translate-x-8 -translate-y-8 items-center justify-center">
                            {/* Circle (Search icon) */}
                            <Search
                                className="relative size-36 text-[var(--primary)]"
                                aria-hidden="true"
                            />

                            {/* Handle, anchored to bottom-right of the Search icon */}
                            <div className="absolute right-[10px] bottom-[10px] h-4 w-12 rotate-45 rounded-[5px] bg-[var(--accent)]" />
                        </div>
                    </div>
                </div>
                {/* Description */}
                <p className="px-4 text-center md:px-14 md:text-lg">
                    The page you are looking for might have been removed, had
                    its name changed or is temporary unavailable.
                </p>
                {/* Go back to menu button */}
                <Button
                    variant="default"
                    className="m-8 bg-[var(--accent)] px-10 py-3"
                    asChild
                >
                    <Link href="/protected/start">Go back to menu</Link>
                </Button>
            </div>
        </div>
    );
}
