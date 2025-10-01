'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../../components/ui/card';
import SubjectCheckbox, { subjects } from '../../components/SubjectCheckbox';
import { ChevronRight } from 'lucide-react';
import { useLocalStorage } from 'react-use';
import Image from 'next/image';
import Link from 'next/link';

export default function StartPage() {
    // Store selected subjects in local storage
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<string[]>(
        'selectedSubjects',
        [],
    );

    function toggleSubject(subject: string) {
        if (selectedSubjects?.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        } else {
            setSelectedSubjects([...(selectedSubjects || []), subject]);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="relative w-2xl p-5">
                <CardHeader>
                    <CardTitle>
                        <Image
                            src="/wide-logo-light.svg" // TODO: dynamically switch between light and dark mode logos
                            alt="MathMate"
                            width={(313 * 2) / 3}
                            height={(110 * 2) / 3}
                            className="m-2"
                        />
                    </CardTitle>
                    <CardDescription className="relative">
                        This website is made to help students learn math in a
                        simple and supportive way. You can explore step-by-step
                        solutions to math problems, so you not only see the
                        answer but also understand how to get there.
                        <div className="bg-primary absolute top-0 -left-15 h-full w-8 rounded-sm"></div>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <p>
                        Choose which categories of math you want to work with:
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {subjects &&
                            Object.keys(subjects).map((subject) => (
                                <SubjectCheckbox
                                    key={subject}
                                    subject={subject as keyof typeof subjects}
                                    onToggle={toggleSubject}
                                />
                            ))}
                    </div>
                    Ready? Then press {'"Start Practicing"'} and get your first
                    math question.
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
    );
}
