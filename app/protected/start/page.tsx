'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import SubjectSelect from '@/components/ui/subject-select';
import WideLogo from '@/components/ui/wide-logo';
import Header from '@/components/ui/header';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function StartPage() {
    return (
        <>
            <Header
                variant="simple"
                className="fixed top-0 right-0 left-0 z-10"
            />
            <div className="flex min-h-screen flex-col items-center justify-center">
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
                        first math question.
                    </CardContent>
                    <CardFooter>
                        <Link
                            href="/protected/dashboard" // TODO: Link to correct page when it is created
                            className="bg-accent absolute right-24 -bottom-5 flex gap-2 rounded-full px-6 py-2 text-white hover:opacity-90"
                        >
                            Start Practicing <ChevronRight className="-mr-2" />
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
