'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CountrySelectDropdown } from './country-select-dropdown';
import { setCountry } from 'app/actions';
import { useState } from 'react';
import Title from './ui/title';

export default function CountrySelect() {
    const countryIsSelected = false; // TODO: Check with backend if country has been selected
    const [open, setOpen] = useState(!countryIsSelected);

    async function handleSubmit(countryId: number) {
        const userId = 14; // TODO: getCurrentUserId();
        const result = await setCountry(userId, countryId);
        if (result) {
            setOpen(false);
            return;
        }
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
                <CountrySelectDropdown onSubmit={handleSubmit} />
            </DialogContent>
        </Dialog>
    );
}
