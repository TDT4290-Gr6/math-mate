'use client';
import { ChevronLeft, Menu } from 'lucide-react';
import SidebarMenu from './sidebarMenu';
import { useState } from 'react';

/**
 * Header component with navigation links.
 * Props:
 * - variant: 'simple' | 'question' - determines the layout of the header
 * - mathQuestion: ReactNode - the math question to display when variant is 'question'
 * Default variant is 'simple'.
 */
interface HeaderProps {
    variant?: 'simple' | 'question';
    mathQuestion?: React.ReactNode;
}
export default function Header({
    variant = 'simple',
    mathQuestion,
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);

    //TODO: Implement back button functionality

    return (
        <div
            className={`items-top flex w-full flex-row justify-between px-10 py-6 ${variant === 'question' ? 'border-b' : ''}`}
        >
            {/* Back button */}
            <ChevronLeft className="h-8 w-8 text-[var(--foreground)]" />

            {/* Math question display */}
            {variant === 'question' && mathQuestion}
            {/* Hamburger menu */}
            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <Menu className="h-9 w-9 text-[var(--foreground)]" />
            </button>

            {/* Sidebar overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* Clickable background */}
                    <div
                        className="fixed inset-0"
                        onClick={() => setIsOpen(false)}
                    />
                    <SidebarMenu onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}
