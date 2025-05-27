import {Button, ButtonProps} from "tamagui";

type Props = ButtonProps & {
    isScanning: boolean,
};

export function ScannerButton(props: Props) {
    return (
        <Button flex={1} theme='accent' {...props}>
            {props.isScanning ? 'Escanenado ...' : 'Escanear'}
        </Button>
    )
}