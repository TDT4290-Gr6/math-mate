'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CountrySelectDropdown } from './country-select-dropdown';
import { getCountry, setCountry } from 'app/actions';
import { useEffect, useState } from 'react';
import Title from './ui/title';

export default function CountrySelect() {
    const [userId, setUserId] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(countryId: number) {
        if (userId === null) return;
        try {
            const result = await setCountry(userId, countryId);
            if (result) setOpen(false);
        } catch (error) {
            console.error('Failed to set country:', error);
            setError('Failed to set country. Please try again later.');
        }
    }

    useEffect(() => {
        if (userId === null) return;
        getCountry(userId)
            .then((countryId) => {
                if (!countryId) {
                    setOpen(true);
                }
            })
            .catch((error) => {
                console.error('Failed to get country for user:', userId, error);
                setError('Failed to get country. Please try again later.');
            });
    }, [userId]);

    useEffect(() => {
        const userId = 19; // TODO: getCurrentUserId();
        setUserId(userId);
    }, []);

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
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <CountrySelectDropdown
                        onSubmit={handleSubmit}
                        setError={setError}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
