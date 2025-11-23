import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Root container component for a card UI element.
 *
 * Provides:
 * - Rounded corners
 * - Padding
 * - Vertical spacing
 * - Themed background and text colors
 * - Light shadow
 *
 * Accepts all native `<div>` props and merges custom class names.
 *
 * @returns A styled card wrapper element.
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card"
            className={cn(
                'bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Header section of a card, typically containing the title, subtitle,
 * or actions. Uses a responsive grid layout to position content and
 * optional actions (via `CardAction`).
 *
 * Accepts all native `<div>` props and merges custom class names.
 *
 * @returns A styled card header container.
 */
function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-header"
            className={cn(
                '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Card title text wrapper.
 * Applies bold styling and minimal leading to emphasize headings.
 *
 * Accepts all native `<div>` props.
 *
 * @returns A styled card title element.
 */
function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-title"
            className={cn('leading-none font-semibold', className)}
            {...props}
        />
    );
}

/**
 * Card descriptive text block.
 *
 * Designed for secondary text with muted color and smaller font size.
 *
 * Accepts all native `<div>` props.
 *
 * @returns A styled description container.
 */
function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

/**
 * Optional action area placed in the top-right of the card header.
 *
 * Uses grid positioning to align actions (e.g., buttons, icons)
 * next to title/description in `CardHeader`.
 *
 * Accepts all native `<div>` props.
 *
 * @returns A styled action container.
 */
function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-action"
            className={cn(
                'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Main content area of the card.
 *
 * Provides consistent horizontal padding and accepts any card body content.
 *
 * Accepts all native `<div>` props.
 *
 * @returns A styled card content wrapper.
 */
function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-content"
            className={cn('px-6', className)}
            {...props}
        />
    );
}

/**
 * Footer section of a card, typically containing actions or secondary
 * information. Automatically adds padding and proper spacing when
 * placed below a border.
 *
 * Accepts all native `<div>` props.
 *
 * @returns A styled card footer container.
 */
function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="card-footer"
            className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
            {...props}
        />
    );
}

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardAction,
    CardDescription,
    CardContent,
};
