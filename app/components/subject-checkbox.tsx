import { subjectIcons, Subject } from '../constants/subjects';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import React from 'react';

interface SubjectCheckboxProps {
    subject: Subject;
    checked: boolean;
    size: 'small' | 'large';
    onToggle: (subject: Subject) => void;
}

export default function SubjectCheckbox({
    subject,
    checked,
    size,
    onToggle,
}: SubjectCheckboxProps) {
    const Icon = subjectIcons[subject];

    return (
        <label
            htmlFor={subject}
            className={cn(
                'bg-foreground text-background flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-base hover:opacity-90',
                size === 'small' && 'px-2 py-1 text-sm',
            )}
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
