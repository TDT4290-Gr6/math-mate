'use client';

import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Label component built on top of Radix UI's `LabelPrimitive.Root`.
 *
 * Features:
 * - Flex layout with gap for child elements
 * - Small font size, medium weight, and no extra line height
 * - Disabled state styling and pointer-events handling
 * - Works seamlessly with `peer` or `group` elements for accessibility
 *
 * Accepts all props from `LabelPrimitive.Root`.
 *
 * @param className Optional Tailwind classes to extend or override styling.
 * @param props Other props forwarded to the underlying `LabelPrimitive.Root`.
 */
function Label({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    return (
        <LabelPrimitive.Root
            data-slot="label"
            className={cn(
                'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
                className,
            )}
            {...props}
        />
    );
}

export { Label };
