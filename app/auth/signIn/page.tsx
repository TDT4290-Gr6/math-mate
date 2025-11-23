import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Provider } from 'next-auth/providers/index';
import SignInProviders from './SignInProviders';
import Title from '@/components/ui/title';
import { authOptions } from '@/lib/auth';

/**
 * Renders the Sign-In page for the application.
 *
 * This page loads the authentication providers defined in `authOptions`,
 * serializes them to avoid passing non-serializable functions or objects,
 * and displays them inside a styled card. The user can then choose a
 * provider to authenticate with via the `SignInProviders` component.
 *
 * Layout:
 * - Centers content vertically and horizontally within the viewport.
 * - Displays a header with a title and helper text.
 * - Shows a list of available social login providers.
 *
 * @returns A JSX element rendering the sign-in UI.
 */
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
                <div className="relative w-92">
                    <Card className="">
                        <CardHeader>
                            <Title title="Sign in:" />
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
