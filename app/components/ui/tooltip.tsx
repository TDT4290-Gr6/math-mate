'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Provides context for tooltips using Radix UI's `TooltipPrimitive.Provider`.
 *
 * Allows configuring default delay for showing tooltips.
 *
 * Accepts all props from `TooltipPrimitive.Provider`.
 *
 * @param delayDuration Time in milliseconds to delay showing the tooltip (default: 0).
 * @param props Other props forwarded to `TooltipPrimitive.Provider`.
 */
function TooltipProvider({
    delayDuration = 0,
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delayDuration={delayDuration}
            {...props}
        />
    );
}

/**
 * Root wrapper for a tooltip.
 *
 * Wraps the tooltip in a `TooltipProvider` to manage state and delays.
 *
 * Accepts all props from `TooltipPrimitive.Root`.
 *
 * @param props Props forwarded to `TooltipPrimitive.Root`.
 */
function Tooltip({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
    return (
        <TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props} />
        </TooltipProvider>
    );
}

/**
 * Trigger element that shows the tooltip when hovered or focused.
 *
 * Accepts all props from `TooltipPrimitive.Trigger`.
 *
 * Typically a button, icon, or other interactive element.
 *
 * @param props Props forwarded to `TooltipPrimitive.Trigger`.
 */
function TooltipTrigger({
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

/**
 * Content of the tooltip.
 *
 * Features:
 * - Positioned relative to the trigger
 * - Optional offset from the trigger (default: 0)
 * - Animations for open/close with fade, zoom, and slide effects
 * - Optional arrow with customizable color (default: foreground color)
 *
 * Accepts all props from `TooltipPrimitive.Content`.
 *
 * @param className Optional Tailwind classes for styling the tooltip content.
 * @param sideOffset Distance from the trigger (default: 0).
 * @param children Tooltip content.
 * @param arrowColor Optional CSS color for the tooltip arrow (default: 'var(--foreground)').
 * @param props Other props forwarded to `TooltipPrimitive.Content`.
 */
function TooltipContent({
    className,
    sideOffset = 0,
    children,
    // Optional arrow color (CSS color string). Defaults to the foreground color.
    arrowColor = 'var(--foreground)',
    ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
    arrowColor?: string;
}) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                data-slot="tooltip-content"
                sideOffset={sideOffset}
                className={cn(
                    'bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance',
                    className,
                )}
                {...props}
            >
                {children}
                <TooltipPrimitive.Arrow
                    className="z-50 size-2.5 rounded-[2px]"
                    style={{ fill: arrowColor }}
                />
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
    );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
