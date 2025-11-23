'use client';

import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from 'react-hook-form';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

/**
 * Wrapper around `react-hook-form`'s `FormProvider`.
 *
 * Provides context for nested form fields and controls.
 *
 * Usage:
 * ```tsx
 * <Form {...methods}>
 *   <FormItem>...</FormItem>
 * </Form>
 * ```
 */
const Form = FormProvider;

type FormFieldContextValue<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
    name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
    {} as FormFieldContextValue,
);

/**
 * Connects a form field to `react-hook-form` using `Controller`.
 *
 * Provides a `FormFieldContext` with the field name to child components.
 *
 * @template TFieldValues Form values object type.
 * @template TName Field name in the form values.
 * @param props All props forwarded to `Controller`.
 */
const FormField = <
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
    ...props
}: ControllerProps<TFieldValues, TName>) => {
    return (
        <FormFieldContext.Provider value={{ name: props.name }}>
            <Controller {...props} />
        </FormFieldContext.Provider>
    );
};

/**
 * Hook to access the current form field context and state.
 *
 * Returns:
 * - `id` — unique id for the form item
 * - `name` — field name
 * - `formItemId`, `formDescriptionId`, `formMessageId` — ids for accessibility
 * - Field state from `react-hook-form` (`value`, `error`, `isDirty`, etc.)
 *
 * Must be used within a `<FormField>` and `<FormItem>` context.
 *
 * @throws If used outside of `<FormField>`.
 */
const useFormField = () => {
    const fieldContext = React.useContext(FormFieldContext);
    const itemContext = React.useContext(FormItemContext);
    const { getFieldState } = useFormContext();
    const formState = useFormState({ name: fieldContext.name });
    const fieldState = getFieldState(fieldContext.name, formState);

    if (!fieldContext) {
        throw new Error('useFormField should be used within <FormField>');
    }

    const { id } = itemContext;

    return {
        id,
        name: fieldContext.name,
        formItemId: `${id}-form-item`,
        formDescriptionId: `${id}-form-item-description`,
        formMessageId: `${id}-form-item-message`,
        ...fieldState,
    };
};

/**
 * Context value for a form item container.
 *
 * Provides a unique id used for accessibility linking with labels and messages.
 */
type FormItemContextValue = {
    id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
    {} as FormItemContextValue,
);

/**
 * Container for a single form field and associated label, control, description, and message.
 *
 * Generates a unique id and provides it via `FormItemContext` to child components.
 *
 * @param className Optional Tailwind classes.
 * @param props Props forwarded to the `<div>` wrapper.
 */
function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
    const id = React.useId();

    return (
        <FormItemContext.Provider value={{ id }}>
            <div
                data-slot="form-item"
                className={cn('grid gap-2', className)}
                {...props}
            />
        </FormItemContext.Provider>
    );
}

/**
 * Label component linked to the form control.
 *
 * - Automatically sets `htmlFor` to the corresponding form control id.
 * - Adds error styling when the field has a validation error.
 *
 * Accepts all props from `LabelPrimitive.Root`.
 *
 * @param className Optional Tailwind classes.
 * @param props Props forwarded to the label element.
 */
function FormLabel({
    className,
    ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
    const { error, formItemId } = useFormField();

    return (
        <Label
            data-slot="form-label"
            data-error={!!error}
            className={cn('data-[error=true]:text-destructive', className)}
            htmlFor={formItemId}
            {...props}
        />
    );
}

/**
 * Form input wrapper that links accessibility attributes to the form field.
 *
 * - Sets `id` and `aria-describedby` automatically.
 * - Sets `aria-invalid` when the field has an error.
 *
 * Accepts all props forwarded to a `Slot` component.
 *
 * @param props Props forwarded to the Slot wrapper.
 */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
    const { error, formItemId, formDescriptionId, formMessageId } =
        useFormField();

    return (
        <Slot
            data-slot="form-control"
            id={formItemId}
            aria-describedby={
                !error
                    ? `${formDescriptionId}`
                    : `${formDescriptionId} ${formMessageId}`
            }
            aria-invalid={!!error}
            {...props}
        />
    );
}

/**
 * Description text for a form field.
 *
 * Automatically links to the input via `aria-describedby`.
 *
 * @param className Optional Tailwind classes.
 * @param props Props forwarded to the `<p>` element.
 */
function FormDescription({ className, ...props }: React.ComponentProps<'p'>) {
    const { formDescriptionId } = useFormField();

    return (
        <p
            data-slot="form-description"
            id={formDescriptionId}
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    );
}

/**
 * Displays a validation message for a form field.
 *
 * Automatically links to the input via `aria-describedby`.
 * Renders the error message if the field has an error, otherwise renders children.
 *
 * @param className Optional Tailwind classes.
 * @param props Props forwarded to the `<p>` element.
 */
function FormMessage({ className, ...props }: React.ComponentProps<'p'>) {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message ?? '') : props.children;

    if (!body) {
        return null;
    }

    return (
        <p
            data-slot="form-message"
            id={formMessageId}
            className={cn('text-destructive text-sm', className)}
            {...props}
        >
            {body}
        </p>
    );
}

export {
    useFormField,
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormField,
};
