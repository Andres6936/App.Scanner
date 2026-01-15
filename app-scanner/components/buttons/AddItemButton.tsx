import { Button, ButtonProps } from "react-native-paper";
import { Plus } from "lucide-react-native";

type Props = ButtonProps;

export function AddItemButton(props: Props) {
    return (
        <Button {...props}>
            <Plus/>
        </Button>
    )
}