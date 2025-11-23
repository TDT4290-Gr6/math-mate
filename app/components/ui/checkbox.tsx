'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Checkbox component built on top of Radix UI's CheckboxPrimitive.
 *
 * - Supports all props from `CheckboxPrimitive.Root`.
 * - Applies Tailwind-based styling for checked/unchecked, focus, disabled, and invalid states.
 * - Renders a checkmark icon when checked.
 *
 * @param className Optional Tailwind classes to extend or override the default styling.
 * @param props Additional props forwarded to `CheckboxPrimitive.Root`.
 */
function Checkbox({
    className,
    ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer border-input dark:bg-input/30 data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground dark:data-[state=checked]:bg-accent data-[state=checked]:border-accent focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current transition-none"
            >
                <CheckIcon className="size-3.5" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
