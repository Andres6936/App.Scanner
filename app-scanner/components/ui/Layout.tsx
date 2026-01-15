import React from "react";
import { View } from "react-native";

const Row = ({style, ...props}: React.ComponentPropsWithRef<typeof View>) =>
    <View style={[{flexDirection: 'row', justifyContent: 'center'}, style]} {...props}/>

const Col = ({style, ...props}: React.ComponentPropsWithRef<typeof View>) => {
    return <View style={[{flexDirection: 'column'}, style]} {...props}/>
}

export { Row, Col }