'use client';
import { ChevronLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SidebarMenu from './sidebarMenu';

/**
 * Header component with navigation and optional math question display.
 *
 * Features:
 *   - Displays a back button (ChevronLeft) that navigates to the previous page.
 *   - Displays a math question when `variant` is 'question'.
 *   - Hamburger menu button that opens a `SidebarMenu` overlay.
 *   - Global keyboard shortcuts:
 *       - Press "e" to open the sidebar menu
 *       - Press "Escape" to close the sidebar menu
 *   - Click outside the sidebar closes it.
 *
 * Props:
 * @param variant - 'simple' | 'question' (optional, default: 'simple')
 *     Determines the layout of the header.
 *     - 'simple': basic header with back button and menu
 *     - 'question': header includes a math question display
 * @param mathQuestion - ReactNode (optional)
 *     The math question content to display when `variant` is 'question'. Normally a question component.
 *
 * Notes:
 *   - Sidebar overlay is rendered conditionally when `isOpen` is true.
 *   - Keyboard event listeners are attached to the window for global shortcut handling.
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
            className={`items-top flex w-full flex-row justify-between px-10 py-6 ${variant === 'question' ? 'border-b' : ''}`}
        >
            {/* Back button */}
            <button
                type="button"
                aria-label="Go back"
                className="flex size-10 cursor-pointer items-center justify-center"
                onClick={() => router.back()}
            >
                <ChevronLeft size={36} />
            </button>
            {/* Math question display */}
            {variant === 'question' && mathQuestion}
            {/* Hamburger menu */}
            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <Menu className="h-9 w-9 text-[var(--foreground)]" />
            </button>

            {/* Sidebar overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 flex">
                    <button
                        type="button"
                        className="fixed inset-0"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close sidebar menu"
                    />
                    <SidebarMenu onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}
