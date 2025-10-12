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
                'flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 px-2 py-2 text-base text-white hover:opacity-90',
                size === 'small' && 'px-2 py-1 text-sm',
            )}
        >
            <Icon className="ml-2 size-4" />
            <span className="pr-2">{subject}</span>
            <Checkbox
                className="bg-card size-6 cursor-pointer rounded-full"
                id={subject}
                checked={checked}
                onCheckedChange={() => onToggle(subject)}
            />
        </label>
    );
}
