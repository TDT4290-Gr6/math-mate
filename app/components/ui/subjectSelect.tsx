'use client';

import { Subject, subjectIcons } from '../../constants/subjects';
import SubjectCheckbox from '../subject-checkbox';
import { useLocalStorage } from 'react-use';
import { useState, useEffect } from 'react';

export default function SubjectSelect() {
    // Store selected subjects in local storage
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<Subject[]>(
        'selectedSubjects',
        [],
    );

    // Track hydration to prevent SSR mismatch
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => setIsHydrated(true), []);

    function toggleSubject(subject: Subject) {
        if (selectedSubjects?.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
        } else {
            setSelectedSubjects([...(selectedSubjects ?? []), subject]);
        }
    }

    return (
        <>
            {(Object.keys(subjectIcons) as (keyof typeof subjectIcons)[]).map(
                (subject) => (
                    <SubjectCheckbox
                        key={subject}
                        subject={subject}
                        // Set checked to false on initial render, then update based on local storage
                        checked={
                            isHydrated &&
                            (selectedSubjects?.includes(subject) ?? false)
                        }
                        onToggle={toggleSubject}
                    />
                ),
            )}
        </>
    );
}
