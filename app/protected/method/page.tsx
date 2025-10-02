"use client";

import Link from "next/link";

export default function MethodPage() {
  return (
    <div className="flex flex-col items-center justify-top min-h-screen gap-6">
    <div className="flex flex-row justify-between w-full py-6 px-10">
    {/* TODO: Replace with backbutton */}
        <div className="h-10 w-10 bg-[var(--accent)]"></div>

    {/* TODO: Replace with hamburger :) */}
        <div className="h-10 w-10 bg-[var(--accent)]"></div>
    </div>

      <h1 className="text-2xl font-bold">Method Page</h1>
      <Link
        href="/protected/dashboard"
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}

