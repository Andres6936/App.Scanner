import {useEffect, useState} from "react";
import NiceModal from "@ebay/nice-modal-react";
import {Button, StyleSheet, Text, View} from 'react-native';
import {BarcodeScanningResult, CameraView, useCameraPermissions} from 'expo-camera';
import {useThrottler} from '@/own-pacer/throttler/useThrottler'

import ModalAddItem, {Props as ModalAddItemProps} from "@/modals/ModalAddItem";
import {db} from "@/services/sqlite/createClient";
import {ProductsTable} from "@/services/sqlite/schema";
import {TypeCurrency} from "@/constants/Types";
import {ScannerActions} from "@/components/scanner/ScannerActions";

export default function HomeScreen() {
    const [permission, requestPermission] = useCameraPermissions();

    const [enabledScanner, setEnabledScanner] = useState(false);
    const [scanningResult, setScanningResult] = useState<BarcodeScanningResult | null>(null);

    const throttlerSetScanningResult = useThrottler(setScanningResult, {
        wait: 200,
        enabled: enabledScanner,
    })

    useEffect(() => {
        (async () => {
            if (!scanningResult || !enabledScanner) return;
            if (scanningResult.data.startsWith("http://")) return;
            if (scanningResult.data.startsWith("https://")) return;
            try {
                setEnabledScanner(false);
                await NiceModal.show(ModalAddItem, {
                    onConfirm: async ({values}) => {
                        await db.insert(ProductsTable).values({
                            SKU: scanningResult.data,
                            TypeBarCode: scanningResult.type,
                            Name: values.Name,
                            Amount: values.Amount,
                            Value: values.Value,
                            Currency: TypeCurrency.COP,
                        })
                    },
                } satisfies ModalAddItemProps)
            } catch (e) {

            } finally {
                setEnabledScanner(false);
                setScanningResult(null);
            }
        })()
    }, [scanningResult, enabledScanner]);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing='back'
                onBarcodeScanned={(scanningResult) => {
                    // throttled state update
                    throttlerSetScanningResult.maybeExecute(scanningResult)
                }}
            />
            <ScannerActions
                isScanning={enabledScanner}
                onScan={() => setEnabledScanner(true)}
                onCancelScan={() => setEnabledScanner(false)}
                onAdd={() => {

                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
});
