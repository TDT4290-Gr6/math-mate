'use client';

import { UserRound, Moon, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Button } from './button';
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
        <div className="bg-sidebar fixed top-0 right-0 z-50 flex h-full w-72 flex-col p-6 shadow-[-2px_0_8px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-6">
                {/* Header with close button */}
                <div className="flex items-center justify-between border-b">
                    {/* User ID display */}
                    <p>
                        <span className="font-semibold">User ID:</span> TODO
                    </p>

                    {/* Close button */}
                    <Button
                        size="icon"
                        variant="ghost"
                        className="cursor-pointer"
                        aria-label="Close sidebar"
                        onClick={onClose}
                    >
                        <X />
                    </Button>
                </div>

                {/* Menu content */}

                {/* Settings */}
                {/* Settings */}
                <div className="flex flex-col gap-4">
                    <p className="border-b pb-1 font-semibold">Settings:</p>
                    {/* Darkmode toggle */}
                    <div className="bg-sidebar-primary flex items-center justify-around gap-2 rounded-4xl px-4 py-2 text-[var(--sidebar-primary-foreground)]">
                        <Moon size={20} />
                        <p className="font-semibold text-[var(--sidebar-primary-foreground)]">
                            Dark mode
                        </p>
                        <Switch
                            className="ml-auto h-6 w-10 cursor-pointer p-1"
                            checked={theme === 'dark'}
                            onCheckedChange={(checked) =>
                                setTheme(checked ? 'dark' : 'light')
                            }
                        />
                    </div>
                    {/* Logout button */}
                    <button
                        type="button"
                        className="bg-sidebar-primary hover:bg-sidebar-accent flex cursor-pointer items-center gap-2 rounded-4xl px-4 py-2"
                        onClick={() => {
                            handleLogout();
                            onClose();
                        }}
                    >
                        <UserRound
                            size={20}
                            className="text-[var(--sidebar-primary-foreground)]"
                        />
                        <p className="font-semibold text-[var(--sidebar-primary-foreground)]">
                            Log out
                        </p>
                    </button>
                </div>

                {/* Previously solved questions */}
                <p className="border-b pb-1 font-semibold">
                    Previously solved questions:
                </p>
            </div>
            <div className="mt-4 flex flex-col gap-4 overflow-y-auto">
                {dummyProblems.map((problem, index) => (
                    // TODO: Link to the problem
                    <p
                        key={index}
                        className="text-foreground hover:bg-sidebar-accent h-11 rounded-xl p-2"
                    >
                        {problem}
                    </p>
                ))}
            </div>
        </div>
    );
}
