import React, {useMemo} from "react";
import {SafeAreaView} from 'react-native-safe-area-context';
import {Modal, StyleSheet} from "react-native";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {Button, Form, H6, Paragraph, Spinner, View, XStack, YStack} from "tamagui";
import * as v from 'valibot';

import {getFirstErrorMessageOf, useAppForm} from "@/components/form/field/withField";


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
                    <View bg="$background" style={styles.modalView}>
                        <Form
                            alignItems="center"
                            gap="$2"
                            onSubmit={() => void form.handleSubmit()}
                            padding="$4"
                            minWidth="90%"
                        >
                            <H6>Añadir nuevo item</H6>

                            {!isManualRegister && (
                                <Paragraph size="$1">
                                    SKU: {form.state.values.SKU} -
                                    Tipo: {form.state.values.TypeBarCode}
                                </Paragraph>
                            )}

                            <YStack minWidth="100%" padding="$2" gap="$2">
                                {isManualRegister && (
                                    <XStack gap="$2">
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
                                    </XStack>
                                )}

                                <form.AppField
                                    name="Name"
                                    children={(field) => <field.TextField label="Nombre"/>}
                                />

                                <XStack gap="$2">
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
                                </XStack>
                            </YStack>

                            <form.Subscribe
                                selector={(state) => [state.fieldMeta]}
                                children={([fieldMeta]) => {
                                    const message = getFirstErrorMessageOf(fieldMeta);
                                    return message ? <Paragraph>{message}</Paragraph> : null;
                                }}
                            />

                            <XStack mt="$4">
                                <Button
                                    flex={1}
                                    onPress={() => {
                                        modal.reject();
                                        modal.remove();
                                    }}>
                                    Cancelar
                                </Button>

                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitted]}
                                    children={([canSubmit, isSubmitted]) => (
                                        <Form.Trigger asChild disabled={!canSubmit || isSubmitted}>
                                            <Button
                                                flex={1}
                                                icon={isSubmitted ? () => <Spinner/> : undefined}>
                                                Confirmar
                                            </Button>
                                        </Form.Trigger>
                                    )}
                                />
                            </XStack>
                        </Form>
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