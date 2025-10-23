'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { JSX } from 'react';

type Provider = {
    id: string;
    name: string;
};

const providerConfig: Record<string, { icon: JSX.Element; color: string }> = {
  google: { icon: <FcGoogle className="w-10 h-10" />, color: 'bg-blue-600 hover:bg-blue-700' },
  github: { icon: <FaGithub className="w-10 h-10" />, color: 'bg-gray-900 hover:bg-gray-800' },
};

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
                    className={`font-semibold flex items-center justify-center gap-4 w-60 ${providerConfig[provider.id].color}`}
                    onClick={() => {
                        signIn(provider.id, {
                            callbackUrl: '/protected/start',
                        });
                    }}
                >
                    {providerConfig[provider.id].icon}
                    {provider.name}
                </Button>
            ))}
        </>
    );
}
