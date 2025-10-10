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
import { getCountry } from 'app/actions';
import Title from './ui/title';

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
                        <Title title="Country of residence:" />
                    </DialogTitle>
                    <DialogDescription>
                        As this is a research project, we would like to know
                        what is your country of residence:
                    </DialogDescription>
                </DialogHeader>
                <CountrySelectDropdown setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    );
}
