import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Provider } from 'next-auth/providers/index';
import SignInProviders from './SignInProviders';
import { authOptions } from '@/lib/auth';

export default async function SignInPage() {
    const providers: Provider[] = authOptions.providers;

    // serialize providers to a minimal array so we don't pass functions or complex objects
    const serializedProviders = providers.map((p) => ({
        id: p.id,
        name: p.name,
    }));

    return (
        <main className="flex justify-center">
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
                            <SignInProviders providers={serializedProviders} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
