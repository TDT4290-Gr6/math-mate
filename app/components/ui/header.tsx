'use client';
import Link from 'next/link';
import {ChevronLeft, Menu } from 'lucide-react';

/**
 * Header component with navigation links.
 */

export default function Header() {
    return (
        <div className="flex w-full flex-row items-center justify-between px-10 py-6">
        {/* Back button */}

            <ChevronLeft className="h-8 w-8" />
        {/* Hamburger menu */}
            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center"
            >
                <Menu className="h-9 w-9" />
            </button>
        </div>
    );
}