'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Subject, subjectIcons } from '../../constants/subjects';
import SubjectCheckbox from '@/components/subject-checkbox';
import Header from '@/components/ui/header';
import { ChevronRight } from 'lucide-react';
import { useLocalStorage } from 'react-use';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

export default function StartPage() {
    // Store selected subjects in local storage
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<Subject[]>(
        'selectedSubjects',
        [],
    );
    const { theme } = useTheme();

    // Track hydration to prevent SSR mismatch
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    function toggleSubject(subject: Subject) {
        if (selectedSubjects?.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        } else {
            setSelectedSubjects([...(selectedSubjects ?? []), subject]);
        }
    }

    return (
        <>
            <Header variant="simple" className="fixed" />
            <div className="flex min-h-screen flex-col items-center justify-center">
                <Card className="relative w-2xl p-5">
                    <CardHeader>
                        <CardTitle>
                            <Image
                                src={
                                    isHydrated && theme === 'dark'
                                        ? '/wide-logo-dark.svg'
                                        : '/wide-logo-light.svg'
                                }
                                alt="MathMate"
                                width={(313 * 2) / 3}
                                height={(110 * 2) / 3}
                                className="m-2"
                            />
                        </CardTitle>
                        <CardDescription className="relative">
                            This website is made to help students learn math in
                            a simple and supportive way. You can explore
                            step-by-step solutions to math problems, so you not
                            only see the answer but also understand how to get
                            there.
                            <div className="bg-primary absolute top-0 -left-15 h-full w-8 rounded-sm"></div>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <p>
                            Choose which categories of math you want to work
                            with:
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {Object.keys(subjectIcons).map((subject) => (
                                <SubjectCheckbox
                                    key={subject}
                                    subject={subject as Subject}
                                    // Set checked to false on initial render, then update based on local storage
                                    checked={
                                        isHydrated &&
                                        (selectedSubjects?.includes(
                                            subject as Subject,
                                        ) ??
                                            false)
                                    }
                                    onToggle={toggleSubject}
                                />
                            ))}
                        </div>
                        Ready? Then press {'"Start Practicing"'} and get your
                        first math question.
                    </CardContent>
                    <CardFooter>
                        <Link
                            href="/protected/dashboard" // TODO: Link to correct page when it is created
                            className="bg-primary hover:bg-primary/90 text-background absolute right-24 -bottom-5 flex gap-2 rounded-full px-6 py-2"
                        >
                            Start Practicing <ChevronRight className="-mr-2" />
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}
