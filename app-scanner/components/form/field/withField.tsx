import {createFormHook, createFormHookContexts} from "@tanstack/react-form";
import {Input, Label, YStack} from "tamagui";
import React from "react";

export const {fieldContext, formContext, useFieldContext} =
    createFormHookContexts()

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
    },
    formComponents: {},
})

type TextFieldProps = {
    label: string,
}

export function TextField(props: TextFieldProps) {
    const field = useFieldContext<string>()
    return (
        <YStack>
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