import { subjectIcons, Subject } from '../constants/subjects';
import { Checkbox } from '@/components/ui/checkbox';
import React from 'react';

interface SubjectCheckboxProps {
    subject: Subject;
    checked: boolean;
    onToggle: (subject: Subject) => void;
}

export default function SubjectCheckbox({
    subject,
    checked,
    onToggle,
}: SubjectCheckboxProps) {
    const Icon = subjectIcons[subject];

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
