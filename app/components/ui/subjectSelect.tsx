'use client';

import { Subject, SUBJECT_NAMES } from '../../constants/subjects';
import SubjectCheckbox from '../subject-checkbox';
import { useLocalStorage } from 'react-use';
import { useState, useEffect } from 'react';

interface SubjectSelectProps {
    size: 'small' | 'large';
}

/**
 * Renders a list of subject checkboxes allowing users to select multiple subjects.
 * Selected subjects are persisted in local storage and managed via state.
 * Handles hydration to prevent SSR mismatches.
 *
 * @param props - The props for the SubjectSelect component.
 * @param props.size - The size of the subject checkboxes.
 * @returns The rendered list of subject checkboxes.
 */
export default function SubjectSelect({ size }: SubjectSelectProps) {
    // Store selected subjects in local storage
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<Subject[]>(
        'selectedSubjects',
        [],
    );

    // Track hydration to prevent SSR mismatch
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => setIsHydrated(true), []);

    /**
     * Toggles the selection state of a given subject.
     * If the subject is already selected, it will be removed from the selection.
     * If the subject is not selected, it will be added to the selection.
     *
     * @param subject - The subject to toggle in the selection.
     */
    function toggleSubject(subject: Subject) {
        if (selectedSubjects?.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        } else {
            setSelectedSubjects([...(selectedSubjects ?? []), subject]);
        }
    }

    return (
        <>
            {SUBJECT_NAMES.map((subject) => (
                <SubjectCheckbox
                    key={subject}
                    subject={subject}
                    size={size}
                    // Set checked to false on initial render, then update based on local storage
                    checked={
                        isHydrated &&
                        (selectedSubjects?.includes(subject) ?? false)
                    }
                    onToggle={toggleSubject}
                />
            ))}
        </>
    );
}
