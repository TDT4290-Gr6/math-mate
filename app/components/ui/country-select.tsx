'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CountrySelectDropdown } from './country-select-dropdown';
import { useState } from 'react';
import Title from './title';

export default function CountrySelect() {
    const countryIsSelected = false; // TODO: Check with backend if country has been selected
    const [open, setOpen] = useState(!countryIsSelected);

    function handleSubmit(country: string) {
        // TODO: Tell backend what country the user selected
        console.log(country);
        setOpen(false);
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
