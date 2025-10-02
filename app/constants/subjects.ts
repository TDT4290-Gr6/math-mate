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
