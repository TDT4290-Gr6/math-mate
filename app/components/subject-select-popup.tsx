import { Card, CardContent, CardHeader } from './ui/card';
import { Subject } from 'app/constants/subjects';
import SubjectSelect from './ui/subject-select';
import { useLocalStorage } from 'react-use';
import { Button } from './ui/button';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import Title from './ui/title';

interface SubjectSelectPopupProps {
    onClose: () => void; // Accept onClose prop
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
 * - **Cancel / X**: Restore the original selection from `"initialSubjects"` and close the popup.
 * - **Click outside the card**: Close the popup without saving changes.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {() => void} props.onClose - Callback triggered when the popup is closed.
 *
 * @example
 * <SubjectSelectPopup onClose={() => setIsPopupOpen(false)} />
 */

export default function SubjectSelectPopup({
    onClose,
}: SubjectSelectPopupProps) {
    const [selectedSubjects, setSelectedSubjects] = useLocalStorage<Subject[]>(
        'selectedSubjects',
        [],
    );

    const [initialSubjects, setInitialSubjects] = useLocalStorage<Subject[]>(
        'initialSubjects',
        [],
    );

    useEffect(() => {
        if (selectedSubjects) {
            setInitialSubjects(selectedSubjects);
        }
    }, []);

    const handleSave = () => {
        onClose();
    };

    const handleCancel = () => {
        setSelectedSubjects(initialSubjects);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={handleCancel} // Close when clicking outside the card
        >
            <Card
                className="relative w-2xl p-5 py-10"
                onClick={(e) => e.stopPropagation()}
            >
                <CardHeader>
                    <div className="flex flex-col">
                        <Title title="Select Subjects" />
                        <Button
                            size="icon"
                            variant="ghost"
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
        </div>
    );
}
