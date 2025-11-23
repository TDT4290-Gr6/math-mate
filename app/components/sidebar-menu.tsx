'use client';

import { UserRound, Moon, X, LoaderCircle } from 'lucide-react';
import { LaTeXFormattedText } from './latex-formatted-text';
import React, { useEffect, useMemo, useState } from 'react';
import { useTrackedLogger } from './logger/LoggerProvider';
import { getLatestSolves, getUserId } from '@/actions';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

interface SidebarMenuProps {
    onClose: () => void;
}

/**
 * SidebarMenu component.
 *
 * This component renders a sidebar on the right side of the screen containing:
 *   - User ID
 *   - Settings section with a dark mode toggle
 *   - Logout button
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
 */

export default function SidebarMenu({ onClose }: SidebarMenuProps) {
    // Theme handling
    const { theme, setTheme } = useTheme();

    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [solves, setSolves] = useState<
        Awaited<ReturnType<typeof getLatestSolves>>
    >([]);
    const [solvesLoading, setSolvesLoading] = useState(true);

    const tracked = useTrackedLogger();
    const router = useRouter();

    function debounce<Args extends unknown[]>(
        fn: (...args: Args) => void,
        delay = 300,
    ): (...args: Args) => void {
        let timeoutId: ReturnType<typeof setTimeout>;
        return (...args: Args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    }

    const logEvent = tracked.logEvent;
    // Debounced logging function (to prevent event log spamming)
    // (and memoized to avoid recreation)
    const debouncedLogTheme = useMemo(
        () =>
            debounce((newTheme: string) => {
                void logEvent({
                    actionName: 'toggle_theme',
                    payload: { theme: newTheme },
                });
            }, 400),
        [logEvent],
    );

    const handleThemeSwitch = (checked: boolean) => {
        const newTheme = checked ? 'dark' : 'light';
        setTheme(newTheme);
        debouncedLogTheme(newTheme);
    };

    const handleNavigateToSolve = (problemId: number) => {
        void tracked.logEvent({
            actionName: 'navigate_previous_solve',
            problemId,
            payload: {},
        });
        router.push(`/protected/methods/${problemId}`);
    };

    const handleLogOut = () => {
        void tracked.logEvent({
            actionName: 'sign_out',
            payload: {},
        });
        sessionStorage.removeItem('signInLogged');
        onClose();
        void signOut();
    };

    useEffect(() => {
        let cancelled = false;
        getUserId()
            .then((id) => {
                if (!cancelled) setUserId(id.toString());
            })
            .catch(() => {
                if (!cancelled) setUserId('Failed to load');
            });

        getLatestSolves()
            .then((latestSolves) => {
                if (!cancelled) setSolves(latestSolves);
            })
            .catch(() => {
                if (!cancelled) setSolves([]);
            })
            .finally(() => {
                if (!cancelled) setSolvesLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="bg-sidebar fixed top-0 right-0 z-50 flex h-full w-72 flex-col p-6 shadow-[-2px_0_8px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-6">
                {/* Header with close button */}
                <div className="flex items-center justify-between border-b">
                    {/* User ID display */}
                    <p>
                        <span className="font-semibold">User ID:</span>{' '}
                        <span
                            className={
                                userId === 'Failed to load'
                                    ? 'text-destructive'
                                    : ''
                            }
                        >
                            {userId ? (
                                <span
                                    role="status"
                                    aria-live="polite"
                                    aria-label={
                                        userId === 'Failed to load'
                                            ? `Error loading user ID: ${userId}`
                                            : `User ID`
                                    }
                                >
                                    {userId}
                                </span>
                            ) : (
                                <span
                                    role="status"
                                    aria-live="polite"
                                    aria-label="Loading user ID"
                                >
                                    <LoaderCircle
                                        className="inline animate-spin"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    <span className="sr-only">Loading</span>
                                </span>
                            )}
                        </span>
                    </p>

                    {/* Close button */}
                    <Button
                        size="icon"
                        variant="transparent"
                        aria-label="Close sidebar"
                        onClick={onClose}
                    >
                        <X />
                    </Button>
                </div>

                {/* Menu content */}

                {/* Settings */}
                <div className="flex flex-col gap-4">
                    <p className="border-b pb-1 font-semibold">Settings:</p>
                    {/* Darkmode toggle */}
                    <div className="bg-sidebar-primary flex items-center justify-around gap-2 rounded-4xl px-4 py-2 text-[var(--sidebar-primary-foreground)]">
                        <Moon size={20} aria-hidden="true" />
                        <label
                            htmlFor="dark-mode-switch"
                            className="cursor-pointer font-semibold text-[var(--sidebar-primary-foreground)]"
                        >
                            Dark mode
                        </label>
                        <Switch
                            id="dark-mode-switch"
                            className="ml-auto h-6 w-10 cursor-pointer p-1"
                            checked={theme === 'dark'}
                            onCheckedChange={handleThemeSwitch}
                            aria-label="Toggle dark mode"
                            aria-checked={theme === 'dark'}
                        />
                    </div>
                    {/* Logout button */}
                    <button
                        type="button"
                        className="bg-sidebar-primary hover:bg-accent flex cursor-pointer items-center gap-2 rounded-4xl px-4 py-2"
                        onClick={handleLogOut}
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
            </div>
            <div className="mt-4 flex flex-col gap-4 overflow-y-auto">
                {/* Previously solved problems */}
                <h2 className="border-b pb-1 font-semibold">
                    Previously solved problems:
                </h2>

                <div
                    role="region"
                    aria-label="Previously solved problems list"
                    aria-live="polite"
                    aria-busy={solvesLoading}
                >
                    {solvesLoading ? (
                        <>
                            <span className="sr-only">
                                Loading previously solved problems
                            </span>
                            {/* Display 10 skeleton loaders while loading */}
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-sidebar-primary hover:bg-accent h-12 w-full animate-pulse rounded-xl"
                                    aria-hidden="true"
                                />
                            ))}
                        </>
                    ) : solves.length === 0 ? (
                        <p
                            className="text-sidebar-primary-foreground bg-sidebar-primary hover:bg-accent rounded-xl p-2 text-pretty"
                            role="status"
                        >
                            No previously solved problems.
                        </p>
                    ) : (
                        <nav aria-label="Previously solved problems navigation">
                            <ul className="flex flex-col gap-4">
                                {solves.map((solve) => (
                                    <li key={solve.id}>
                                        <Button
                                            className="text-sidebar-primary-foreground bg-sidebar-primary hover:bg-accent w-full rounded-xl p-2 text-left text-pretty"
                                            onClick={() =>
                                                handleNavigateToSolve(
                                                    solve.problemId,
                                                )
                                            }
                                            aria-label={`View previously solved problem: ${solve.problemTitle}`}
                                        >
                                            <LaTeXFormattedText
                                                text={solve.problemTitle}
                                            />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
}
