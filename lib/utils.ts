import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and merges multiple class name inputs into a single string.
 *
 * - Uses `clsx` to handle conditional and array-based classNames.
 * - Uses `tailwind-merge` (`twMerge`) to intelligently merge Tailwind CSS classes,
 *   avoiding duplicates and conflicting classes.
 *
 * @param inputs - An array of class values (strings, objects, arrays) to merge.
 * @returns A single string containing the merged class names.
 *
 * @example
 * ```ts
 * const buttonClass = cn('px-4 py-2', isPrimary && 'bg-blue-500', 'text-white');
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Extracts a plain-text version of a string containing LaTeX math and HTML,
 * suitable for screen readers or plain-text contexts.
 *
 * - Converts inline `$...$` and block `$$...$$` math expressions into a readable format.
 * - Removes all HTML tags.
 * - Collapses multiple spaces into a single space and trims the result.
 *
 * @param text - The input string containing LaTeX math and/or HTML.
 * @returns A plain-text version with math expressions readable and HTML removed.
 *
 * @example
 * ```ts
 * const plainText = extractPlainTextMath('Die Formel ist $$E=mc^2$$ und <b>bold</b>');
 * Returns: "Formel: E=mc^2 und bold"
 * ```
 */
export function extractPlainTextMath(text: string): string {
    return text
        .replace(/\$\$(.*?)\$\$/g, (_, math) => ` Formel: ${math} `)
        .replace(/\$(.*?)\$/g, (_, math) => ` ${math} `)
        .replace(/<[^>]+>/g, '') // HTML-Tags entfernen
        .replace(/\s+/g, ' ')
        .trim();
}
