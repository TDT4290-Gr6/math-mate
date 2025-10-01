import {
    Binary,
    Calculator,
    Dice5,
    Divide,
    TrendingUp,
    Triangle,
    Variable,
} from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import React from 'react';

export const subjects = {
    Algebra: Divide,
    'Counting & Probability': Dice5,
    Geometry: Triangle,
    'Intermediate Algebra': Variable,
    'Number Theory': Binary,
    Prealgebra: Calculator,
    Precalculus: TrendingUp,
};

interface SubjectCheckboxProps {
    subject: keyof typeof subjects;
    checked: boolean;
    onToggle: (subject: keyof typeof subjects) => void;
}

export default function SubjectCheckbox({
    subject,
    checked,
    onToggle,
}: SubjectCheckboxProps) {
    const Icon = subjects[subject];

    return (
        <label
            htmlFor={subject}
            className="bg-foreground text-background flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 hover:opacity-90"
        >
            <Icon className="size-4" />
            {subject}
            <Checkbox
                className="size-4 rounded-full"
                id={subject}
                checked={checked}
                onCheckedChange={() => onToggle(subject)}
            />
        </label>
    );
}
