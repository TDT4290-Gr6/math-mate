import { useCallback, useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Subject } from 'app/constants/subjects';
import SubjectSelect from './ui/subject-select';
import { useLocalStorage } from 'react-use';
import FocusLock from 'react-focus-lock';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import Title from './ui/title';

interface SubjectSelectPopupProps {
    onClose: () => void;
    onSave: (subjectsChanged: boolean) => void;
}

/**
 * A popup modal that allows users to select and manage subjects.
 *
 * The component displays a list of subject checkboxes via the `SubjectSelect` component,
 * enabling users to modify their selected subjects. The current selection is persisted
 * in local storage using the key `"selectedSubjects"`.
 *
 * When the popup opens, it saves the current selection as `"initialSubjects"` to allow
 * restoration if the user cancels changes. The user can:
 *
 * - **Save**: Close the popup and keep the modified subject selection.
 * - **Cancel / X / Click outside the card**: Restore the original selection from `"initialSubjects"` and close the popup.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.onClose - Callback triggered when the popup is closed.
 * @param {(subjectsChanged: boolean) => void} props.onSave - Callback triggered when the user saves changes.
 *
 * @example
 * <SubjectSelectPopup onClose={() => setIsPopupOpen(false)} />
 */

export default function SubjectSelectPopup({
    onClose,
    onSave,
}: SubjectSelectPopupProps) {
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<Subject[]>(
        'selectedSubjects',
        [],
    );

    const [initialSubjects, setInitialSubjects] = useState<Subject[]>([]);

    const modalRef = useRef<HTMLDivElement>(null);
    const previouslyFocused = useRef<HTMLElement | null>(null);

    // Handle save action: close popup and notify parent of changes
    const handleSave = () => {
        const subjectsChanged =
            selectedSubjects?.length !== initialSubjects?.length ||
            selectedSubjects?.some((s) => !initialSubjects?.includes(s));
        onSave(subjectsChanged);
        onClose();
    };

    // Handle cancel action: restore initial subjects and close popup
    const handleCancel = useCallback(() => {
        setSelectedSubjects(initialSubjects ?? []);
        onClose();
    }, [initialSubjects, setSelectedSubjects, onClose]);

    // Save initial subjects when popup opens
    useEffect(() => {
        if (selectedSubjects) {
            setInitialSubjects(selectedSubjects);
        }
    }, []);

    useEffect(() => {
        if (selectedSubjects) {
            setInitialSubjects(selectedSubjects);
        }

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCancel();
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [selectedSubjects, handleCancel]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={handleCancel}
            role="dialog"
            aria-modal="true"
        >
            <FocusLock returnFocus>
                <Card
                    className="relative w-2xl p-5 py-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    <CardHeader>
                        <div className="flex flex-col">
                            <Title title="Select Subjects" />
                            <Button
                                size="icon"
                                variant="transparent"
                                className="absolute top-3 right-3"
                                aria-label="Close popup"
                                onClick={handleCancel}
                            >
                                <X className="size-6" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-2">
                            <SubjectSelect size="large" />
                        </div>
                        <div className="mt-4 flex flex-row gap-4">
                            <Button
                                variant="default"
                                onClick={handleCancel}
                                className="w-32"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleSave}
                                className="w-32"
                            >
                                Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </FocusLock>
        </div>
    );
}
