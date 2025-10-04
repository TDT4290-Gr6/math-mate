'use client';

import { UserRound, Moon, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import React from 'react';

interface SidebarMenuProps {
    onClose: () => void;
}

/**
 * SidebarMenu component.
 *
 * This component renders a sidebar on the right side of the screen containing:
 *   - User information (currently a placeholder for User ID)
 *   - Settings section with a dark mode toggle
 *   - Logout button (currently logs to console)
 *   - List of previously solved math problems
 *
 * Features:
 *   - Controlled by `onClose` callback to close the sidebar
 *   - Dark mode toggle uses `next-themes` to switch between 'light' and 'dark'
 *   - Responsive hover and click interactions
 *
 * Props:
 * @param onClose - Function called to close the sidebar. Typically updates parent state.
 *
 * Notes:
 *   - The `dummyProblems` array is placeholder data and should be replaced with real user data.
 *   - The component uses a `mounted` state to ensure theme-dependent UI only renders on the client.
 *   - Logout functionality is not fully implemented and currently logs a message to the console.
 */

export default function SidebarMenu({ onClose }: SidebarMenuProps) {
    // Theme handling
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    // TODO: Implement logout functionality
    const handleLogout = () => {
        console.log('Logging out...');
    };

    // Dummy math problems
    const dummyProblems = [
        'Quadratic equation roots',
        'Area of a triangle formula',
        'Derivative of a polynomial',
        'Definite integral evaluation',
        'Simplify a rational expression',
        'Slope of a linear function',
        'Factor a quadratic trinomial',
        'Convert degrees to radians',
        'Sum of a geometric series',
        'Probability of dice roll',
    ];
    return (
        <div className="fixed top-0 right-0 flex h-full w-72 flex-col bg-[var(--sidebar)] shadow-[-2px_0_8px_rgba(0,0,0,0.3)]">
            <div className="p-6">
                {/* Header with close button */}
                <div className="mb-1 flex items-center justify-between">
                    {/* User ID display */}
                    <div className="mt-2 flex flex-row text-[var(--foreground)]">
                        <p className="font-semibold">User ID:</p>
                        <p className="ml-2 font-normal">TODO</p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-[var(--foreground)] hover:bg-[var(--accent-hover)]"
                        aria-label="Close sidebar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Menu content */}

                {/* Border under user ID */}
                <div className="flex flex-col border-b"></div>

                {/* Settings */}
                <div className="mt-10 font-semibold text-[var(--foreground)]">
                    Settings:
                </div>
                <div className="mt-1 flex flex-col border-b"></div>
                {/* Darkmode toggle */}
                <div className="mt-8 flex h-[44px] flex-row items-center gap-2 rounded-[30px] bg-[var(--sidebar-primary)] p-2 font-semibold text-[var(--sidebar-primary-foreground)]">
                    <Moon className="mx-2 h-5 w-5 text-[var(--sidebar-primary-foreground)]" />
                    <h1 className="text-[var(--sidebar-primary-foreground)]">
                        Dark mode
                    </h1>
                    <Switch
                        className="ml-auto h-6 w-10 p-1"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) =>
                            setTheme(checked ? 'dark' : 'light')
                        }
                    />
                </div>
                {/* Logout button */}
                <div
                    className="mt-4 flex h-[44px] flex-row items-center gap-2 rounded-[30px] bg-[var(--sidebar-primary)] p-2 font-semibold text-[var(--sidebar-primary-foreground)]"
                    onClick={() => {
                        handleLogout();
                        onClose();
                    }}
                >
                    <UserRound className="mx-2 h-5 w-5 text-[var(--sidebar-primary-foreground)]" />
                    <h1 className="text-[var(--sidebar-primary-foreground)]">
                        Log out
                    </h1>
                </div>

                {/* Previously solved questions */}
                <div className="mt-10 font-semibold text-[var(--foreground)]">
                    Previously solved questions:
                </div>
                <div className="mt-1 flex flex-col border-b"></div>
            </div>
            <div className="mt-1 flex-1 overflow-y-auto pr-2 pl-6">
                {dummyProblems.map((problem, index) => (
                    <div
                        key={index}
                        className="mt-4 flex h-[44px] flex-row items-center gap-2 rounded-[8px] p-2 font-normal text-[var(--foreground)] hover:bg-[var(--sidebar-accent)]"
                    >
                        <p className="text-[var(--foreground)]">{problem}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
