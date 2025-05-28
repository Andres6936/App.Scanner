import {createFormHook, createFormHookContexts} from "@tanstack/react-form";
import {Input, Label, YStack, YStackProps} from "tamagui";
import React from "react";

export const {fieldContext, formContext, useFieldContext} =
    createFormHookContexts()

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        NumericField,
    },
    formComponents: {},
})

type TextFieldProps = {
    label: string,
    propsRoot?: YStackProps,
}

export function TextField(props: TextFieldProps) {
    const field = useFieldContext<string>()
    return (
        <YStack {...props.propsRoot}>
            <Label htmlFor={field.name} lineHeight="$2">
                {props.label}
            </Label>
            <Input
                width="100%"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChangeText={(value) => field.handleChange(value)}
            />
        </YStack>
    )
}

const getIntegerValueOf = (value: string) => {
    const parsed = value.replace(/[^0-9]/g, '');
    const numeric = parseInt(parsed, 10);
    return isNaN(numeric) ? 0 : numeric;
}

type NumericFieldProps = {
    label: string,
    propsRoot?: YStackProps,
}

export function NumericField(props: NumericFieldProps) {
    const field = useFieldContext<number>()
    return (
        <YStack {...props.propsRoot}>
            <Label htmlFor={field.name} lineHeight="$2">
                {props.label}
            </Label>
            <Input
                width="100%"
                id={field.name}
                inputMode='numeric'
                keyboardType='numeric'
                value={field.state.value.toString()}
                onBlur={field.handleBlur}
                onChangeText={(value) => field.handleChange(getIntegerValueOf(value))}
            />
        </YStack>
    )
}