'use client';

import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';
import type { JSX } from 'react';

type Provider = {
    id: string;
    name: string;
};

const providerConfig: Record<string, { icon: JSX.Element; color: string }> = {
    google: {
        icon: <FcGoogle className="h-10 w-10" />,
        color: 'bg-blue-600 hover:bg-blue-700',
    },
    github: {
        icon: <FaGithub className="h-10 w-10" />,
        color: 'bg-gray-900 hover:bg-gray-800',
    },
};

/**
 * Renders a list of authentication provider sign-in buttons.
 *
 * This component receives a list of providers (id + name)
 * and displays a styled button for each one. Each button
 * includes the provider’s configured icon and colors, and
 * triggers `next-auth`'s `signIn` flow when clicked.
 *
 * Behavior:
 * - If no providers are supplied, a descriptive message is shown.
 * - Button appearance is determined by `providerConfig`, which maps
 *   provider IDs to icons and color classes.
 * - On click, users are redirected to the NextAuth sign-in flow with
 *   a fixed callback URL (`/protected/start`).
 *
 * Props:
 * @param providers — Array of available authentication providers, or null.
 *
 * @returns A list of provider buttons or a fallback message.
 */
export default function SignInProviders({
    providers,
}: {
    providers: Provider[] | null;
}) {
    if (!providers || providers.length === 0)
        return (
            <p className="text-destructive">
                No authentication providers available.
            </p>
        );

    return (
        <>
            {providers.map((provider) => (
                <Button
                    key={provider.id}
                    className={cn(
                        'flex w-60 items-center justify-center gap-4 font-semibold',
                        providerConfig[provider.id]?.color,
                    )}
                    onClick={() => {
                        signIn(provider.id, {
                            callbackUrl: '/protected/start',
                        });
                    }}
                >
                    {providerConfig[provider.id]?.icon}
                    {provider.name}
                </Button>
            ))}
        </>
    );
}
