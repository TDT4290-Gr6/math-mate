'use client';
import { PanelsTopLeft, Search } from 'lucide-react';
import { Button } from './components/ui/button';
import { useRouter } from 'next/navigation';
import Title from './components/ui/title';

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <div className="max-h-5xl flex max-w-1/2 flex-col items-center justify-center rounded-[30px] bg-[var(--card)] shadow-sm">
                {/* row for title and icons */}
                <div className="flex flex-row items-center">
                    {/* Title section */}
                    <div className="flex w-full flex-row p-12">
                        <div className="flex flex-col">
                            <Title title="404" size={120} />
                            <div className="flex flex-row py-4">
                                <div className="mt-2 mr-2 h-[16px] w-[32px] rounded-[5px] bg-[var(--accent)]"></div>
                                <h1 className="text-center text-xl text-[var(--fg)] md:text-2xl">
                                    Page Not Found
                                </h1>
                            </div>
                        </div>
                    </div>
                    {/* stack with search icon on top of panels icon */}
                    <div className="relative hidden px-12 lg:block">
                        <PanelsTopLeft className="mr-8 h-36 w-36 text-[var(--primary)] opacity-20" />

                        {/* Search icon */}
                        <Search className="absolute top-[-40px] left-26 mr-8 h-36 w-36 text-[var(--primary)]" />

                        {/* Lupe handle */}
                        <div
                            className="absolute h-[16px] w-[50px] rounded-[5px] bg-[var(--accent)]"
                            style={{
                                transform: 'rotate(45deg)',
                                top: '80px',
                                left: '207px',
                            }}
                        />
                    </div>
                </div>
                {/* Description */}
                <div className="">
                    <p className="text-md px-4 text-center text-[var(--fg)] md:px-14 md:text-lg">
                        The page you are looking for might have been removed,
                        had its name changed or is temporary unavailable.
                    </p>
                </div>
                {/* Go back to menu button */}
                <Button
                    variant="default"
                    className="m-8 w-54 bg-[var(--accent)]"
                    onClick={() => router.push('/protected/start')}
                >
                    Go back to menu
                </Button>
            </div>
        </div>
    );
}
