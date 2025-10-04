'use client';
import { ChevronLeft, Menu } from 'lucide-react';
import SidebarMenu from './sidebarMenu';
import { useState } from 'react';

/**
 * Header component with navigation links.
 */

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex w-full flex-row items-center justify-between px-10 py-6">
            {/* Back button */}

            <ChevronLeft className="h-8 w-8" />
            {/* Hamburger menu */}
            <button
                type="button"
                className="flex h-10 w-10 items-center justify-center"
                onClick={() => {
                    setIsOpen(true);
                }}
            >
                <Menu className="h-9 w-9" />
            </button>

            {/* Sidebar overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* Clickable background */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setIsOpen(false)}
                    />
                    <SidebarMenu onClose={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    );
}
