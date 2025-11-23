'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

/**
 * Base wrapper around `cmdk`'s `Command` primitive.
 *
 * Provides a full-width, full-height container for command items with
 * custom styling for background, text, rounding, and overflow handling.
 *
 * Accepts all props from `CommandPrimitive`.
 *
 * @param className Optional Tailwind classes to extend/override styles.
 * @param props All other props forwarded to `CommandPrimitive`.
 */
function Command({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
    return (
        <CommandPrimitive
            data-slot="command"
            className={cn(
                'bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Dialog wrapper for a command palette.
 *
 * Features:
 * - Provides a title and description (defaulting to "Command Palette")
 * - Renders children inside a styled command container
 * - Supports optional close button
 *
 * Accepts all props from `Dialog`.
 *
 * @param title Optional title of the dialog.
 * @param description Optional description/help text.
 * @param children Command items or groups.
 * @param className Optional className for the dialog content.
 * @param showCloseButton Whether to display the close button (default: true).
 * @param props Other props forwarded to `Dialog`.
 */
function CommandDialog({
    title = 'Command Palette',
    description = 'Search for a command to run...',
    children,
    className,
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof Dialog> & {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
}) {
    return (
        <Dialog {...props}>
            <DialogHeader className="sr-only">
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <DialogContent
                className={cn('overflow-hidden p-0', className)}
                showCloseButton={showCloseButton}
            >
                <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                    {children}
                </Command>
            </DialogContent>
        </Dialog>
    );
}

/**
 * Input field for the command palette.
 *
 * Includes a search icon and styling for focus, disabled, and placeholder states.
 * Accepts all props from `CommandPrimitive.Input`.
 *
 * @param className Optional Tailwind classes for the input element.
 * @param props All other props forwarded to `CommandPrimitive.Input`.
 */
function CommandInput({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
    return (
        <div
            data-slot="command-input-wrapper"
            className="flex h-9 items-center gap-2 border-b px-3"
        >
            <SearchIcon className="size-4 shrink-0 opacity-50" />
            <CommandPrimitive.Input
                data-slot="command-input"
                className={cn(
                    'placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
                    className,
                )}
                {...props}
            />
        </div>
    );
}

/**
 * Scrollable list container for command items.
 *
 * Accepts all props from `CommandPrimitive.List`.
 *
 * @param className Optional Tailwind classes for the list.
 * @param props Other props forwarded to `CommandPrimitive.List`.
 */
function CommandList({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
    return (
        <CommandPrimitive.List
            data-slot="command-list"
            className={cn(
                'max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Displayed when no command matches the search query.
 *
 * Accepts all props from `CommandPrimitive.Empty`.
 *
 * @param props Props forwarded to `CommandPrimitive.Empty`.
 */
function CommandEmpty({
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
    return (
        <CommandPrimitive.Empty
            data-slot="command-empty"
            className="py-6 text-center text-sm"
            {...props}
        />
    );
}

/**
 * Group container for organizing command items.
 *
 * Applies padding and muted styling for group headings.
 * Accepts all props from `CommandPrimitive.Group`.
 *
 * @param className Optional Tailwind classes.
 * @param props Other props forwarded to `CommandPrimitive.Group`.
 */
function CommandGroup({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
    return (
        <CommandPrimitive.Group
            data-slot="command-group"
            className={cn(
                'text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Separator line between command groups or items.
 *
 * Accepts all props from `CommandPrimitive.Separator`.
 *
 * @param className Optional Tailwind classes.
 * @param props Other props forwarded to `CommandPrimitive.Separator`.
 */
function CommandSeparator({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
    return (
        <CommandPrimitive.Separator
            data-slot="command-separator"
            className={cn('bg-border -mx-1 h-px', className)}
            {...props}
        />
    );
}

/**
 * Individual selectable command item.
 *
 * Supports selected, disabled, and icon styling.
 * Accepts all props from `CommandPrimitive.Item`.
 *
 * @param className Optional Tailwind classes.
 * @param props Other props forwarded to `CommandPrimitive.Item`.
 */
function CommandItem({
    className,
    ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
    return (
        <CommandPrimitive.Item
            data-slot="command-item"
            className={cn(
                "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

/**
 * Displays a keyboard shortcut associated with a command item.
 *
 * Typically used as a child of `CommandItem`.
 *
 * @param className Optional Tailwind classes.
 * @param props Props forwarded to the underlying `<span>`.
 */
function CommandShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="command-shortcut"
            className={cn(
                'text-muted-foreground ml-auto text-xs tracking-widest',
                className,
            )}
            {...props}
        />
    );
}

export {
    Command,
    CommandDialog,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandShortcut,
    CommandSeparator,
};
