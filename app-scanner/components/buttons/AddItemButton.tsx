import { Button, ButtonProps } from "tamagui";
import { Plus } from "lucide-react-native";

type Props = ButtonProps;

export function AddItemButton(props: Props) {
    return (
        <Button theme='accent' {...props}>
            <Plus/>
        </Button>
    )
}