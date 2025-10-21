'use client';
import { useTrackedLogger } from '../logger/LoggerProvider';
import { useCallback, useEffect, useState } from 'react';
import SidebarMenu from '../sidebar-menu';
import { Menu } from 'lucide-react';
import WideLogo from '../wide-logo';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * Header component with navigation and optional math problem display.
 *
 * Features:
 *   - Optionally displays the logo in the top left.
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
 * @param showLogo - boolean (optional, default: true)
 *    Controls whether the logo-link is displayed.
 *
 * Notes:
 *   - Sidebar overlay is rendered conditionally when `isOpen` is true.
 *   - Keyboard event listeners are attached to the window for global shortcut handling.
 */

interface HeaderProps {
    variant?: 'simple' | 'problem';
    mathProblem?: React.ReactNode;
    className?: string;
    showLogo?: boolean;
}
export default function Header({
    variant = 'simple',
    mathProblem,
    className,
    showLogo = true,
}: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const tracked = useTrackedLogger();

    const openSidebar = useCallback(() => {
        setIsOpen((prev) => {
        if (!prev) {
            void tracked.logEvent({
                actionName: 'open_sidebar',
                payload: {},
            });
        }
            return true;
        });
    }, [tracked]);

    const closeSidebar = useCallback(() => {
        // Only log a close event if the sidebar was open before this call.
        setIsOpen((prev) => {
            if (prev) {
                void tracked.logEvent({ actionName: 'close_sidebar', payload: {} });
            }
            return false;
        });
    }, [tracked]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            // Ignore key events when focus is inside form controls or dialogs
            if (
                target &&
                (target.closest(
                    'input, textarea, select, [contenteditable="true"], [role="textbox"]',
                ) || target.closest('[role="dialog"], dialog'))
            ) {
                return;
            }
            if (e.key === 'e') {
                openSidebar(); // open menu
            } else if (e.key === 'Escape') {
                closeSidebar(); // close menu
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeSidebar, openSidebar]);

    return (
        <div
            className={cn(
                'items-top flex w-full flex-row justify-between px-10 py-6',
                variant === 'problem' ? 'border-b' : '',
                className,
            )}
        >
            {/* Logo button */}
            <div className="flex w-1/6">
                <Link
                    aria-label="Go to start page"
                    aria-hidden={!showLogo}
                    tabIndex={showLogo ? 0 : -1}
                    className={cn(
                        'items-top justify-left flex cursor-pointer',
                        !showLogo && 'invisible',
                    )}
                    href="/protected/start"
                >
                    <WideLogo className="m-2 h-16 w-auto" variant="card" />
                </Link>
            </div>
            {/* Math problem display */}
            {variant === 'problem' && mathProblem}
            {/* Hamburger menu */}
            <div className="flex w-1/6 justify-end">
                <button
                    type="button"
                    className="flex size-10 cursor-pointer items-center justify-center"
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    onClick={openSidebar}
                >
                    <Menu size={36} />
                </button>
            </div>

            {/* Sidebar overlay */}
            {isOpen && <SidebarMenu onClose={closeSidebar} />}
        </div>
    );
}
