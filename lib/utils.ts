import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Extrahiere Klartext-Version für Screenreader
export function extractPlainTextMath(text: string): string {
    return text
        .replace(/\$\$(.*?)\$\$/g, (_, math) => ` Formel: ${math} `)
        .replace(/\$(.*?)\$/g, (_, math) => ` ${math} `)
        .replace(/<[^>]+>/g, '') // HTML-Tags entfernen
        .replace(/\s+/g, ' ')
        .trim();
}
