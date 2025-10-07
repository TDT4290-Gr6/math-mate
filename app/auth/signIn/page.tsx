'use client';
import { getProviders, ClientSafeProvider, signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function SignInPage() {
    const [providers, setProviders] = useState<Record<
        string,
        ClientSafeProvider
    > | null>(null);

    useEffect(() => {
        getProviders().then(setProviders);
    }, []);
    return (
        <main className="">
            <div className="container flex min-h-screen flex-col items-center justify-center">
                <div className="relative w-80">
                    <h1 className="border-accent absolute -top-15 -left-15 inline-block border-b-4 pb-1 text-2xl font-bold">
                        Login:
                    </h1>
                    <Card className="p-5">
                        <CardHeader>
                            <p className="mb-4 text-left">
                                Log in with one of these social accounts:
                            </p>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            {providers ? (
                                Object.values(providers).map((provider) => (
                                    <Button
                                        key={provider.name}
                                        className="rounded-full bg-blue-500 px-20 py-6 font-semibold text-white hover:bg-blue-600"
                                        onClick={() => {
                                            signIn(provider.id, {
                                                callbackUrl: '/protected/start',
                                            });
                                        }}
                                    >
                                        {provider.name}
                                    </Button>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
