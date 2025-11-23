'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CountrySelectDropdown } from './country-select-dropdown';
import { useEffect, useState } from 'react';
import { getCountry } from '@/actions';
import Title from './ui/title';

/**
 * CountrySelect component
 *
 * Displays a modal dialog prompting the user to select their country of residence.
 * This component is typically shown once if the user's country has not yet been set.
 *
 * Features:
 * - Fetches the user's current country using `getCountry` on mount.
 * - Opens a modal dialog if no country is set.
 * - Prevents closing the dialog via outside clicks or the Escape key.
 * - Renders a `CountrySelectDropdown` to allow country selection.
 * - Displays an error message if fetching the country fails.
 *
 * Usage:
 * ```tsx
 * <CountrySelect />
 * ```
 */
export default function CountrySelect() {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getCountry()
            .then((countryId) => {
                if (!countryId) setOpen(true);
            })
            .catch(() =>
                setError('Failed to get country. Please try again later.'),
            );
    }, []);

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <Dialog open={open}>
            <DialogContent
                onInteractOutside={(event) => event.preventDefault()} // prevent click outside
                onEscapeKeyDown={(event) => event.preventDefault()} // prevent escape key
                showCloseButton={false}
                className="p-8"
            >
                <DialogHeader>
                    <DialogTitle>
                        <Title
                            title="Country of residence:"
                            titleComponent="span"
                        />
                    </DialogTitle>
                    <DialogDescription className="text-foreground">
                        As this is a research project, we would like to know
                        what is your country of residence:
                    </DialogDescription>
                </DialogHeader>
                <CountrySelectDropdown setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
