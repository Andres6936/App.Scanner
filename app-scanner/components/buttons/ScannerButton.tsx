import { Button, ButtonProps } from "react-native-paper";

type Props = ButtonProps & {
    isScanning: boolean,
};

export function ScannerButton(props: Props) {
    return (
        <Button style={{flex: 1}} {...props}>
            {props.isScanning ? 'Escanenado ...' : 'Escanear'}
        </Button>
    )
}