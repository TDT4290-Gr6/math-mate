"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">Login Page</h1>
      <Link
        href="/protected/dashboard"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
