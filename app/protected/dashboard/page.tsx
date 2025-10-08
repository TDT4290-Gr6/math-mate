'use client';

import SubjectSelectPopup from '@/components/subject-select-popup';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <div className="flex min-h-screen flex-col items-center gap-6">
            <Header
                variant="question"
                mathQuestion={
                    <div className="flex h-52 w-[60%] items-center justify-center bg-[var(--card)]">
                        {' '}
                        <h1>TODO: add math question component here</h1>
                    </div>
                }
            />
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <Link
                href="/login"
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Back to Login
            </Link>
            <Link
                href="/protected/method"
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Go to Method Page
            </Link>

            <Button onClick={openPopup}>Show subject selection popup</Button>
            {isPopupOpen && <SubjectSelectPopup onClose={closePopup} />}
        </div>
    );
}
