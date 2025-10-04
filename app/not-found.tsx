'use client';
import { Button } from "./components/ui/button";
import Title from "./components/ui/title";
import { PanelsTopLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <div className="max-w-1/2 max-h-5xl bg-[var(--card)] rounded-[30px] shadow-sm flex flex-col items-center justify-center">
                
                {/* row for title and icons */}
                <div className="flex flex-row items-center">
                    {/* Title section */}
                    <div className="flex flex-row w-full p-12">
                        <div className="flex flex-col"> 
                            <Title title="404" size={120} />
                            <div className="flex flex-row py-4">
                                <div className="w-[32px] h-[16px] bg-[var(--accent)] rounded-[5px] mr-2 mt-2"></div>
                                <h1 className="text-[var(--fg)] text-xl text-center md:text-2xl">Page Not Found</h1>
                            </div>
                        </div>
                    </div>
                    {/* stack with search icon on top of panels icon */}
                    <div className="relative px-12 lg:block hidden">
                        <PanelsTopLeft className="h-36 w-36 text-[var(--primary)] opacity-20 mr-8" />
                        
                        {/* Search icon */}
                        <Search className="absolute top-[-40px] left-26 h-36 w-36 text-[var(--primary)] mr-8" />

                        {/* Lupe handle */}
                        <div
                            className="absolute bg-[var(--accent)] rounded-[5px] w-[50px] h-[16px]"
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
                    <p className="text-[var(--fg)] text-md text-center md:text-lg md:px-14 px-4">The page you are looking for might have been removed, had its name changed or is temporary unavailable.</p>
                </div>
                {/* Go back to menu button */}
                <Button 
                    variant="default" 
                    className="bg-[var(--accent)] w-54 m-8"
                    onClick={() => router.push('/protected/start')
                }>Go back to menu</Button>
            </div>
            
        </div>
    );
}