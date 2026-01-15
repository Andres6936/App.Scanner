import { AnyFieldMeta, createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { HelperText, TextInput } from "react-native-paper";
import { View, ViewProps } from "react-native";
import React from "react";

export const {fieldContext, formContext, useFieldContext, useFormContext} =
    createFormHookContexts()

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        NumericField,
    },
    formComponents: {
        FirstErrorMessage,
    },
})

type TextFieldProps = {
    label: string,
    propsRoot?: ViewProps,
}

export function TextField(props: TextFieldProps) {
    const field = useFieldContext<string>()
    const error = field.getMeta().errors.length >= 1;
    return (
        <TextInput
            label={props.label}
            error={error}
            mode="outlined"
            value={field.state.value}
            onBlur={field.handleBlur}
            onChangeText={(value) => field.handleChange(value)}
        />
    )
}

const getIntegerValueOf = (value: string) => {
    const parsed = value.replace(/[^0-9]/g, '');
    const numeric = parseInt(parsed, 10);
    return isNaN(numeric) ? 0 : numeric;
}

type NumericFieldProps = {
    label: string,
    propsRoot?: ViewProps,
}

export function NumericField(props: NumericFieldProps) {
    const field = useFieldContext<number>()
    return (
        <View {...props.propsRoot}>
            <TextInput
                label={props.label}
                mode="outlined"
                inputMode='numeric'
                keyboardType='numeric'
                value={field.state.value.toString()}
                onBlur={field.handleBlur}
                onChangeText={(value) => field.handleChange(getIntegerValueOf(value))}
            />
        </View>
    )
}

const getFirstErrorMessageOf = <T, >(fieldMeta: T) => {
    for (let propertyName in fieldMeta) {
        const property = fieldMeta[propertyName as keyof T] as AnyFieldMeta;
        if (property.errors.length >= 1) {
            return property.errors.at(0).message;
        }
    }
    return '';
}

export function FirstErrorMessage() {
    const form = useFormContext()
    return (
        <form.Subscribe
            selector={(state) => [state.fieldMeta]}
            children={([fieldMeta]) => {
                const message = getFirstErrorMessageOf(fieldMeta);
                return message ? <HelperText type="error" visible={true}>{message}</HelperText> : null;
            }}
        />
    )
}