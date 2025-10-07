'use client';

import SubjectSelect from '@/components/ui/subject-select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { Card } from '@/components/ui/card';
import Title from '@/components/ui/title';
import { useState } from 'react';
import Link from 'next/link';

export default function QuestionPage() {
    // TODO: api call for fetcing questions
    const [description, setDescription] = useState(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in nunc diam. Fusce accumsan tempor justo ac pellentesque. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .',
    );

    return (
        <div className="flex min-h-screen flex-col items-center bg-[var(--background)] text-[var(--foreground)]">
            <Header />
            {/* Subject selection */}
            <div className="mt-5 flex max-w-[60vw] flex-wrap justify-center gap-5">
                <SubjectSelect size="small" />
            </div>

            {/* Question card */}
            <Card className="mt-15 w-full max-w-[50vw] p-6">
                <Title title="Question:" />
                <p className="mb-6 line-clamp-7 text-[var(--foreground)]">
                    {description}
                </p>

                {/* Navigation buttons */}
                <div className="flex justify-center gap-12">
                    <Button>
                        <ChevronLeft className="h-4 w-4" />
                        Previous question
                    </Button>

                    <Button variant="secondary">
                        Another question
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </Card>
            {/* Call-to-action button */}
            <div className="mt-10 flex justify-center">
                <Button variant="secondary">
                    <Link href="/protected/method">Get started solving</Link>
                </Button>
            </div>
        </div>
    );
}
