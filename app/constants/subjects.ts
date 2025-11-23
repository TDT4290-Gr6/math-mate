/**
 * Subjects module
 *
 * Defines the available subjects for the application and associates
 * each subject with an icon from the `lucide-react` library.
 *
 * Constants:
 * @constant SUBJECT_NAMES - Array of subject names as strings.
 *   Used to enforce type safety for subject selection.
 *
 * Types:
 * @type Subject - Union type of all valid subject names, derived from SUBJECT_NAMES.
 *
 * Icons:
 * @constant subjectIcons - Maps each Subject to a corresponding LucideIcon.
 *   Used to visually represent each subject in the UI.
 *
 * Example usage:
 * ```ts
 * import { subjectIcons, Subject } from './subjects';
 * import { Subject } from './constants/subjects';
 *
 * const icon = subjectIcons['Algebra'];
 * ```
 */

import {
    Binary,
    Calculator,
    Dice5,
    Divide,
    LucideIcon,
    TrendingUp,
    Triangle,
    Variable,
} from 'lucide-react';

export const SUBJECT_NAMES = [
    'Algebra',
    'Counting & Probability',
    'Geometry',
    'Intermediate Algebra',
    'Number Theory',
    'Prealgebra',
    'Precalculus',
] as const;

export type Subject = (typeof SUBJECT_NAMES)[number];

export const subjectIcons: Record<Subject, LucideIcon> = {
    Algebra: Divide,
    'Counting & Probability': Dice5,
    Geometry: Triangle,
    'Intermediate Algebra': Variable,
    'Number Theory': Binary,
    Prealgebra: Calculator,
    Precalculus: TrendingUp,
};
