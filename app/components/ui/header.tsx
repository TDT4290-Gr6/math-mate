'use client';
import { ChevronLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarMenu from './sidebarMenu';
import { cn } from '@/lib/utils';

/**
 * Header component with navigation and optional math problem display.
 *
 * Features:
 *   - Optionally displays a back button (ChevronLeft) that navigates to the previous page.
 *   - Displays a math problem when `variant` is 'problem'.
 *   - Hamburger menu button that opens a `SidebarMenu` overlay.
 *   - Global keyboard shortcuts:
 *       - Press "e" to open the sidebar menu
 *       - Press "Escape" to close the sidebar menu
 *   - Click outside the sidebar closes it.
 *
 * Props:
 * @param variant - 'simple' | 'problem' (optional, default: 'simple')
 *     Determines the layout of the header.
 *     - 'simple': basic header with back button and menu
 *     - 'problem': header includes a math problem display
 * @param mathProblem - ReactNode (optional)
 *     The math problem content to display when `variant` is 'problem'. Normally a problem component.
 * @param className - string (optional)
 *    Additional CSS classes to apply to the header container.
 * @param showBackButton - boolean (optional, default: true)
 *    Controls whether the back button is displayed.
 *
 * Notes:
 *   - Sidebar overlay is rendered conditionally when `isOpen` is true.
 *   - Keyboard event listeners are attached to the window for global shortcut handling.
 */

interface HeaderProps {
    variant?: 'simple' | 'problem';
    mathProblem?: React.ReactNode;
    className?: string;
    showBackButton?: boolean;
}
export default function Header({
    variant = 'simple',
    mathProblem,
    className,
    showBackButton = true,
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            if (
                target &&
                target.closest(
                    'input, textarea, select, [contenteditable="true"], [role="textbox"]',
                )
            ) {
                return;
            }
            if (e.key === 'e') {
                setIsOpen(true); // open menu
            } else if (e.key === 'Escape') {
                setIsOpen(false); // close menu
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div
            className={cn(
                'items-top flex w-full flex-row justify-between px-10 py-6',
                variant === 'problem' ? 'border-b' : '',
                className,
            )}
        >
            {/* Back button */}
            <button
                type="button"
                aria-label="Go back"
                aria-hidden={!showBackButton}
                tabIndex={showBackButton ? 0 : -1}
                className={cn(
                    'flex size-10 cursor-pointer items-center justify-center',
                    !showBackButton && 'invisible',
                )}
                onClick={() => router.back()}
            >
                <ChevronLeft size={36} />
            </button>
            {/* Math problem display */}
            {variant === 'problem' && mathProblem}
            {/* Hamburger menu */}
            <button
                type="button"
                className="flex size-10 cursor-pointer items-center justify-center"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(true)}
            >
                <Menu size={36} />
            </button>

            {/* Sidebar overlay */}
            {isOpen && <SidebarMenu onClose={() => setIsOpen(false)} />}
        </div>
    );
}
