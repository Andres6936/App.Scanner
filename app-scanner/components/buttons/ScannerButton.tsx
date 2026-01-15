import { Button, ButtonProps } from "react-native-paper";

type Props = Pick<ButtonProps, 'mode' | 'style' | 'onPress'> & {
    isScanning: boolean
};

export function ScannerButton(props: Props) {
    return (
        <Button mode="contained" style={{flex: 1}} {...props}>
            {props.isScanning ? 'Escanenado ...' : 'Escanear'}
        </Button>
    )
}