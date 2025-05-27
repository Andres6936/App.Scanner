import {XStack} from "tamagui";

import {ScannerButton} from "@/components/buttons/ScannerButton";
import {AddItemButton} from "@/components/buttons/AddItemButton";

type Props = {
    isScanning: boolean,
    onScan: () => Promise<void> | void,
    onCancelScan: () => Promise<void> | void,
    onAdd: () => Promise<void> | void,
}

export function ScannerActions(props: Props) {
    return (
        <XStack position="absolute" bottom={10} left={10} right={10} gap="$2">
            <ScannerButton
                isScanning={props.isScanning}
                onPress={() => {
                    if (props.isScanning) {
                        props.onCancelScan();
                    } else {
                        props.onScan();
                    }
                }}/>
            <AddItemButton onPress={props.onAdd}/>
        </XStack>
    )
}