import React, { useMemo } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, StyleSheet, View } from "react-native";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button, Text, useTheme } from "react-native-paper";
import * as v from 'valibot';

import { useAppForm } from "@/components/form/field/withField";


const ProductSchema = v.object({
    SKU: v.pipe(v.string(), v.minLength(6), v.maxLength(100)),
    TypeBarCode: v.string(),
    Name: v.pipe(v.string(), v.minLength(3), v.maxLength(100)),
    Value: v.pipe(v.number(), v.minValue(0)),
    Amount: v.pipe(v.number(), v.minValue(1)),
})

const defaultValues = {
    SKU: "",
    TypeBarCode: "",
    Name: "",
    Value: 0,
    Amount: 1,
}

export type Props = {
    defaultValues: {
        SKU: string,
        TypeBarCode: string,
    },
    onConfirm: (event: { values: typeof defaultValues }) => Promise<void> | void,
}

export default NiceModal.create((props: Props) => {
    // Use a hook to manage the modal state
    const modal = useModal();
    const theme = useTheme();
    const form = useAppForm(({
        defaultValues: {
            ...defaultValues,
            SKU: props.defaultValues.SKU,
            TypeBarCode: props.defaultValues.TypeBarCode,
        },
        validators: {
            onChange: ProductSchema,
        },
        onSubmit: async ({value}) => {
            const cleanUp = async () => {
                modal.resolve();
                modal.remove();
            }
            return await Promise.all([
                cleanUp(),
                props.onConfirm({values: value}),
            ])
        }
    }))

    const isManualRegister = useMemo(() => {
        return props.defaultValues.SKU.length === 0 && props.defaultValues.TypeBarCode.length === 0;
    }, [props.defaultValues])

    return (
        <SafeAreaView style={[styles.centeredView, StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.5)'}]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal.visible}
            >
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, {backgroundColor: theme.colors.surface}]}>
                        <View style={{alignItems: 'center', gap: 8, padding: 16, minWidth: '90%'}}>
                            <Text variant="headlineSmall">Añadir nuevo item</Text>

                            {!isManualRegister && (
                                <Text variant="bodySmall">
                                    SKU: {form.state.values.SKU} -
                                    Tipo: {form.state.values.TypeBarCode}
                                </Text>
                            )}

                            <View style={{minWidth: "100%", padding: 8, gap: 8}}>
                                {isManualRegister && (
                                    <View style={{flexDirection: 'row', gap: 8}}>
                                        <form.AppField
                                            name="SKU"
                                            children={(field) => (
                                                <field.TextField propsRoot={{flex: 1}} label="SKU"/>
                                            )}
                                        />

                                        <form.AppField
                                            name="TypeBarCode"
                                            children={(field) => (
                                                <field.TextField propsRoot={{flex: 1}} label="Tipo"/>
                                            )}
                                        />
                                    </View>
                                )}

                                <form.AppField
                                    name="Name"
                                    children={(field) => <field.TextField label="Nombre"/>}
                                />

                                <View style={{flexDirection: 'row', gap: 8}}>
                                    <form.AppField
                                        name="Value"
                                        children={(field) => (
                                            <field.NumericField propsRoot={{flex: 1}} label="Valor"/>
                                        )}
                                    />

                                    <form.AppField
                                        name="Amount"
                                        children={(field) => (
                                            <field.NumericField propsRoot={{flex: 1}} label="Cantidad"/>
                                        )}
                                    />
                                </View>
                            </View>

                            <form.AppForm>
                                <form.FirstErrorMessage/>
                            </form.AppForm>

                            <View style={{flexDirection: 'row', marginTop: 16, gap: 8}}>
                                <Button
                                    mode="outlined"
                                    style={{flex: 1}}
                                    onPress={() => {
                                        modal.reject();
                                        modal.remove();
                                    }}>
                                    Cancelar
                                </Button>

                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <Button
                                            mode="contained"
                                            style={{flex: 1}}
                                            disabled={!canSubmit || isSubmitting}
                                            loading={isSubmitting}
                                            onPress={() => void form.handleSubmit()}>
                                            Confirmar
                                        </Button>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
})

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 18,
        borderRadius: 8,
        padding: 18,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});