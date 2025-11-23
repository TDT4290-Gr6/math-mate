'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Root container for a popover using Radix UI's `PopoverPrimitive.Root`.
 *
 * Wraps popover trigger and content components to manage state and context.
 *
 * Accepts all props from `PopoverPrimitive.Root`.
 */
function Popover({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
    return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

/**
 * Trigger element that opens the popover when interacted with.
 *
 * Accepts all props from `PopoverPrimitive.Trigger`.
 *
 * Typically a button or interactive element.
 */
function PopoverTrigger({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
    return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/**
 * Content container for the popover.
 *
 * Features:
 * - Positioned relative to the trigger using Radix's positioning
 * - Default alignment: center; default offset: 4px
 * - Includes background, border, padding, shadow, rounded corners
 * - Handles open/close and slide/zoom/fade animations
 *
 * Accepts all props from `PopoverPrimitive.Content`.
 *
 * @param className Optional Tailwind classes to extend or override styles.
 * @param align Alignment of the popover content relative to the trigger (default: 'center').
 * @param sideOffset Offset distance from the trigger (default: 4).
 * @param props Other props forwarded to `PopoverPrimitive.Content`.
 */
function PopoverContent({
    className,
    align = 'center',
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                data-slot="popover-content"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden',
                    className,
                )}
                {...props}
            />
        </PopoverPrimitive.Portal>
    );
}

/**
 * Optional anchor element for fine-grained positioning of popover content.
 *
 * Accepts all props from `PopoverPrimitive.Anchor`.
 */
function PopoverAnchor({
    ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
    return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
