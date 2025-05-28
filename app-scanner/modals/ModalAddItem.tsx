import React from "react";
import {SafeAreaView} from 'react-native-safe-area-context';
import {Alert, Modal, StyleSheet} from "react-native";
import NiceModal, {useModal} from "@ebay/nice-modal-react";
import {Button, Form, H6, Spinner, View, XStack, YStack} from "tamagui";
import {useAppForm} from "@/components/form/field/withField";


const defaultValues = {
    Name: "",
    Value: 0,
    Amount: 1,
}

export type Props = {
    onConfirm: (event: { values: typeof defaultValues }) => Promise<void> | void,
}

export default NiceModal.create((props: Props) => {
    // Use a hook to manage the modal state
    const modal = useModal();
    const form = useAppForm(({
        defaultValues: defaultValues,
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

    return (
        <SafeAreaView style={[styles.centeredView, StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.5)'}]}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modal.visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    modal.remove();
                }}>
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

                            <YStack minWidth="100%" padding="$2" gap="$2">
                                <form.AppField
                                    name="Name"
                                    children={(field) => <field.TextField label="Nombre"/>}
                                />

                                <XStack gap="$2">
                                    <form.AppField
                                        name="Value"
                                        children={(field) => <field.NumericField label="Valor"/>}
                                    />

                                    <form.AppField
                                        name="Amount"
                                        children={(field) => <field.NumericField label="Cantidad"/>}
                                    />
                                </XStack>
                            </YStack>

                            <form.Subscribe
                                selector={(state) => [state.canSubmit, state.isSubmitted]}
                                children={([canSubmit, isSubmitted]) => (
                                    <Form.Trigger asChild disabled={!canSubmit || isSubmitted}>
                                        <Button
                                            minWidth="100%"
                                            mt="$4"
                                            icon={isSubmitted ? () => <Spinner/> : undefined}>
                                            Confirmar
                                        </Button>
                                    </Form.Trigger>
                                )}
                            />

                            <Button
                                minWidth="100%"
                                onPress={() => {
                                    modal.reject();
                                    modal.remove();
                                }}>
                                Cancelar
                            </Button>
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