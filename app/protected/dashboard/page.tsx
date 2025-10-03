'use client';

import Link from 'next/link';
import { logger } from '@/infrastructure/services/logging/logger';

export default function DashboardPage() {
    // Only for testing during implementation, should be removed
     const handleClick = () => {
    logger.info({
      action: 'navigate-to-login',
      timestamp: new Date().toISOString(),
      sessionId: 'mock-session-id', // hent fra context/auth ved behov
      userId: 1,
    }, '🔗 Bruker trykket på "Back to Login"');
  };
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6">
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <Link
                href="/login"
                // fjern når psuher
                onClick={handleClick}
                className="rounded-lg bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
            >
                Back to Login
            </Link>
        </div>
    );
}
