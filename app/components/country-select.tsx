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

    async function handleSubmit(countryId: number) {
        if (userId === null) return;
        const result = await setCountry(userId, countryId);
        if (result) {
            setOpen(false);
            return;
        }
    }

    useEffect(() => {
        if (userId === null) return;
        getCountry(userId).then((countryId) => {
            if (!countryId) {
                setOpen(true);
            }
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
                <CountrySelectDropdown onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    );
}
