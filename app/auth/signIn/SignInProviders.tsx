'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

type Provider = {
    id: string;
    name: string;
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
                    className="rounded-full bg-blue-500 px-20 py-6 font-semibold text-white hover:bg-blue-600"
                    onClick={() => {
                        signIn(provider.id, {
                            callbackUrl: '/protected/start',
                        });
                    }}
                >
                    {provider.name}
                </Button>
            ))}
        </>
    );
}
