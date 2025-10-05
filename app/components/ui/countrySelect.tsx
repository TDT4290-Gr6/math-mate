'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Title from './title';

export default function CountrySelect() {
    const countryIsSelected = false; // TODO: Check with backend if country has been selected
    const [open, setOpen] = useState(!countryIsSelected);

    function handleAction() {
        // TODO: Tell backend what country the user selected
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
                {/* TODO: Country select component */}
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleAction}
                        variant="default"
                        className="bg-accent cursor-pointer px-4"
                    >
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
