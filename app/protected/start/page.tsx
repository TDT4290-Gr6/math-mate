'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import SubjectSelect from '@/components/ui/subject-select';
import CountrySelect from '@/components/country-select';
import { Button } from '@/components/ui/button';
import WideLogo from '@/components/wide-logo';
import Header from '@/components/ui/header';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function StartPage() {
    return (
        <>
            <Header
                variant="simple"
                className="fixed top-0 right-0 left-0 z-10"
                showBackButton={false}
            />
            <div className="flex min-h-screen flex-col items-center justify-center">
                <CountrySelect />
                <Card className="relative w-2xl p-5">
                    <CardHeader>
                        <WideLogo className="m-2 h-18 w-auto" />
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
                            asChild
                            variant="secondary"
                            className="absolute right-24 -bottom-4 gap-2"
                        >
                            <Link href="/protected/problem">
                                Start Practicing{' '}
                                <ChevronRight className="-mr-1" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
