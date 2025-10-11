'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { getCountries, setCountry } from '@/actions';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { z } from 'zod';

const FormSchema = z.object({
    countryId: z.int({ error: 'You are required to select a country.' }),
});

interface CountrySelectDropdownProps {
    setOpen: (open: boolean) => void;
}

export function CountrySelectDropdown({ setOpen }: CountrySelectDropdownProps) {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [countries, setCountries] = useState<
        Awaited<ReturnType<typeof getCountries>>
    >([]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    // Watch the country field so we can enable/disable the submit button
    const selectedCountry = form.watch('countryId');

    useEffect(() => {
        if (selectedCountry) form.clearErrors('countryId');
    }, [selectedCountry, form]);

    useEffect(() => {
        getCountries()
            .then((countries) => setCountries(countries))
            .catch(() => {
                form.setError('countryId', {
                    type: 'manual',
                    message:
                        'Failed to load countries. Please try again later.',
                });
            });
    }, [form]);

    function handleSubmit(countryId: number) {
        setCountry(countryId)
            .then((result) => {
                if (result.success) setOpen(false);
            })
            .catch(() => {
                form.setError('countryId', {
                    type: 'manual',
                    message: 'Failed to set country. Please try again later.',
                });
            });
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) =>
                    handleSubmit(data.countryId),
                )}
                className="flex w-full flex-col items-center justify-center gap-4"
            >
                <FormField
                    control={form.control}
                    name="countryId"
                    render={({ field }) => (
                        <FormItem className="w-60">
                            <Popover
                                open={popoverOpen}
                                onOpenChange={setPopoverOpen}
                            >
                                {/* Dropdown button */}
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant="ghost" role="combobox">
                                            {/* Default (invalid) country */}
                                            {field.value
                                                ? countries.find(
                                                      (country) =>
                                                          country.id ===
                                                          field.value,
                                                  )?.name
                                                : 'Select country'}
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                {/* Dropdown list */}
                                <PopoverContent className="p-0">
                                    <Command>
                                        <CommandList>
                                            <CommandGroup>
                                                {countries.map((country) => (
                                                    <CommandItem
                                                        value={country.name}
                                                        key={country.id}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                'countryId',
                                                                country.id,
                                                            );
                                                            setPopoverOpen(
                                                                false,
                                                            );
                                                        }}
                                                    >
                                                        {country.name}
                                                        {/* Show checkmark for selected item */}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                country.id ===
                                                                    field.value
                                                                    ? 'opacity-100'
                                                                    : 'opacity-0',
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {/* Error message (if any) */}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    variant="secondary"
                    aria-disabled={!selectedCountry}
                    // Have button appear as disabled if no country is selected
                    className={cn(
                        'w-60',
                        !selectedCountry &&
                            'bg-border hover:bg-border cursor-auto',
                    )}
                >
                    Submit
                </Button>
            </form>
        </Form>
    );
}
