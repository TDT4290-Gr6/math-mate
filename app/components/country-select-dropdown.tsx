'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FormSchema = z.object({
    country: z
        .string({ error: 'You are required to select a country.' })
        .min(1, 'You are required to select a country.'),
});

interface CountrySelectDropdownProps {
    onSubmit: (country: string) => void;
}

export function CountrySelectDropdown({
    onSubmit,
}: CountrySelectDropdownProps) {
    // TODO: Get countries from backend
    const countries = [
        { label: 'Norway', value: '1' },
        { label: 'India', value: '2' },
    ] as const;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

    // Watch the country field so we can enable/disable the submit button
    const selectedCountry = form.watch('country');

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((data) => onSubmit(data.country))}
                className="flex w-full flex-col items-center justify-center gap-4"
            >
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                        <FormItem className="w-60">
                            <Popover>
                                {/* Dropdown button */}
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                        >
                                            {/* Default (invalid) country */}
                                            {field.value
                                                ? countries.find(
                                                      (country) =>
                                                          country.value ===
                                                          field.value,
                                                  )?.label
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
                                                        value={country.label}
                                                        key={country.value}
                                                        onSelect={() => {
                                                            form.setValue(
                                                                'country',
                                                                country.value,
                                                            );
                                                        }}
                                                    >
                                                        {country.label}
                                                        {/* Show checkmark for selected item */}
                                                        <Check
                                                            className={cn(
                                                                'ml-auto',
                                                                country.value ===
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
                    variant="default"
                    // Have button appear as disabled if no country is selected
                    className={cn(
                        'bg-accent w-60 cursor-pointer',
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
