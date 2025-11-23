'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { useTrackedLogger } from '@/components/logger/LoggerProvider';
import SubjectSelect from '@/components/ui/subject-select';
import CountrySelect from '@/components/country-select';
import { Button } from '@/components/ui/button';
import WideLogo from '@/components/wide-logo';
import { useSession } from 'next-auth/react';
import Header from '@/components/ui/header';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

/**
 * StartPage component
 *
 * This is the landing page for authenticated users, guiding them to
 * start practicing math problems. It integrates country selection,
 * subject selection, and provides an introduction to the platform.
 *
 * Features:
 * - Displays `CountrySelect` for the user to choose their country.
 * - Displays `SubjectSelect` allowing users to select math categories
 *   they want to practice.
 * - Shows a `WideLogo` and description card introducing the platform.
 * - Logs a "sign_in" event the first time a user signs in during the session.
 * - Provides a "Start Practicing" button that:
 *   - Logs the "start_practicing" event.
 *   - Navigates the user to the `/protected/problem` page to begin practicing.
 *
 * State Management:
 * - Uses `useSession` to determine authentication status.
 * - Uses `useTrackedLogger` to track user actions for analytics.
 *
 * Layout:
 * - Fixed header at the top.
 * - Central card containing the logo, description, subject selection,
 *   and start button.
 */
export default function StartPage() {
    const tracked = useTrackedLogger();
    const router = useRouter();

    const { data: session, status } = useSession();

    useEffect(() => {
        if (
            status === 'authenticated' &&
            session?.user?.id &&
            !sessionStorage.getItem('signInLogged')
        ) {
            void tracked.logEvent({
                actionName: 'sign_in',
                payload: {},
            });
            sessionStorage.setItem('signInLogged', 'true'); // mark as logged
        }
    }, [status, session, tracked]);

    const handleGetStarted = () => {
        void tracked.logEvent({
            actionName: 'start_practicing',
            payload: {},
        });
        router.push('/protected/problem');
    };
    return (
        <>
            <Header
                variant="simple"
                className="fixed top-0 right-0 left-0 z-10"
                showLogo={false}
            />
            <div className="flex min-h-screen flex-col items-center justify-center">
                <CountrySelect />
                <Card className="relative w-3xl p-5">
                    <CardHeader>
                        <WideLogo
                            className="m-2 h-18 w-auto"
                            variant="background"
                        />
                        <CardDescription className="text-foreground relative text-base">
                            This website is made to help students learn math in
                            a simple and supportive way. You can explore
                            step-by-step solutions to math problems, so you not
                            only see the answer but also understand how to get
                            there.
                            <div className="bg-accent absolute top-0 -left-15 h-full w-8 rounded-sm"></div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p>
                            Choose which categories of math you want to work
                            with:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            <SubjectSelect size="large" />
                        </div>
                        Ready? Then press {'"Start Practicing"'} and get your
                        first math problem.
                    </CardContent>
                    <CardFooter>
                        <Button
                            variant="secondary"
                            className="absolute right-20 -bottom-6 gap-2"
                            onClick={handleGetStarted}
                        >
                            Start Practicing <ChevronRight className="-mr-1" />
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
