'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Root container for a dialog using Radix UI's DialogPrimitive.
 *
 * Wrap your dialog components with this to initialize the dialog context.
 *
 * Accepts all props from `DialogPrimitive.Root`.
 */
function Dialog({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/**
 * Trigger element for opening a dialog.
 *
 * Accepts all props from `DialogPrimitive.Trigger`.
 *
 * Typically a button or interactive element.
 */
function DialogTrigger({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

/**
 * Portal wrapper for rendering dialog content outside of normal DOM flow.
 *
 * Accepts all props from `DialogPrimitive.Portal`.
 */
function DialogPortal({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

/**
 * Close button or element for a dialog.
 *
 * Accepts all props from `DialogPrimitive.Close`.
 *
 * Used to dismiss the dialog.
 */
function DialogClose({
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
    return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/**
 * Overlay backdrop behind the dialog.
 *
 * Provides semi-transparent background and open/close animations.
 *
 * Accepts all props from `DialogPrimitive.Overlay`.
 *
 * @param className Optional Tailwind classes for customization.
 */
function DialogOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
    return (
        <DialogPrimitive.Overlay
            data-slot="dialog-overlay"
            className={cn(
                'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Main content container of the dialog.
 *
 * Handles centering, max width, padding, border, shadow, and animations.
 * Automatically includes an optional close button in the top-right.
 *
 * Accepts all props from `DialogPrimitive.Content`.
 *
 * @param className Optional Tailwind classes.
 * @param children Content to render inside the dialog.
 * @param showCloseButton Whether to display a close button (default: true).
 */
function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}) {
    return (
        <DialogPortal data-slot="dialog-portal">
            <DialogOverlay />
            <DialogPrimitive.Content
                data-slot="dialog-content"
                className={cn(
                    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
                    className,
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
                    >
                        <XIcon />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    );
}

/**
 * Header section of the dialog.
 *
 * Typically contains `DialogTitle` and optional description.
 *
 * Accepts all native `<div>` props.
 */
function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="dialog-header"
            className={cn(
                'flex flex-col gap-2 text-center sm:text-left',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Footer section of the dialog.
 *
 * Typically contains action buttons.
 *
 * Accepts all native `<div>` props.
 */
function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="dialog-footer"
            className={cn(
                'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
                className,
            )}
            {...props}
        />
    );
}

/**
 * Title text of the dialog.
 *
 * Accepts all props from `DialogPrimitive.Title`.
 *
 * @param className Optional Tailwind classes.
 */
function DialogTitle({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn('text-lg leading-none font-semibold', className)}
            {...props}
        />
    );
}

/**
 * Description or subtitle of the dialog.
 *
 * Accepts all props from `DialogPrimitive.Description`.
 *
 * @param className Optional Tailwind classes.
 */
function DialogDescription({
    className,
    ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
    return (
        <DialogPrimitive.Description
            data-slot="dialog-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

export {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
};
