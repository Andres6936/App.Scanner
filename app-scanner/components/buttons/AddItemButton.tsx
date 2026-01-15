import { Button, ButtonProps } from "react-native-paper";

type Props = Pick<ButtonProps, 'mode' | 'style' | 'onPress'>;

export function AddItemButton(props: Props) {
    return (
        <Button mode='contained' icon='plus' {...props}>
            Añadir
        </Button>
    )
}