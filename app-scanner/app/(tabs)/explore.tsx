import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { eq } from "drizzle-orm";
import { ActivityIndicator, Appbar, Card, Divider, Icon, Menu, Text } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { db } from "@/services/sqlite/createClient";
import { ProductsTable } from "@/services/sqlite/schema";

export default function TabTwoScreen() {
    const onEditEvent = async () => {

    }

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#353636'}}
            headerImage={
                <IconSymbol
                    size={310}
                    color="#808080"
                    name="chevron.left.forwardslash.chevron.right"
                    style={styles.headerImage}
                />
            }>
            <Appbar.Header mode='small' statusBarHeight={0} style={{backgroundColor: 'transparent'}}>
                <Appbar.Content title="Productos"/>
                <Appbar.Action icon="magnify" onPress={() => {
                }}/>
                <Appbar.Action icon="plus" onPress={() => {
                }}/>
            </Appbar.Header>
            <Table/>
        </ParallaxScrollView>
    );
}

const Table = () => {
    const {data, isLoading} = useQuery({
        queryKey: ['/products'],
        queryFn: async () => db.select().from(ProductsTable)
    })

    if (isLoading) {
        return (
            <ActivityIndicator animating={true}/>
        )
    }

    if (!data) {
        return (
            <Text>No hay datos</Text>
        )
    }

    return (
        <View style={{gap: 8}}>
            {data.map(it => (
                <Item key={it.SKU} model={it}/>
            ))}
        </View>
    )
}

type ItemProps = {
    model: typeof ProductsTable.$inferSelect
}

const Item = (props: ItemProps) => {
    const queryClient = useQueryClient()

    const [showMenu, setShowMenu] = React.useState(false);

    const onDelete = async () => {
        await db.delete(ProductsTable).where(eq(ProductsTable.SKU, props.model.SKU))
        queryClient.invalidateQueries({queryKey: ['/products']})
    }

    const MenuButtonAction = useMemo(() => (
        <TouchableOpacity onPress={() => setShowMenu(true)}>
            <Icon source="dots-vertical" size={15}/>
        </TouchableOpacity>
    ), [])

    return (
        <Card style={{marginBottom: 8}}>
            <Card.Content style={{gap: 4}}>
                <View style={{justifyContent: "space-between", flexDirection: 'row', opacity: 0.5, marginBottom: 2}}>
                    <View style={{gap: 8, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text variant="labelSmall">SKU:</Text>
                        <Text variant="labelSmall">{props.model.SKU}</Text>
                    </View>
                    <View style={{gap: 8, justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text variant="labelSmall">Tipo:</Text>
                        <Text variant="labelSmall">{props.model.TypeBarCode}</Text>
                        <Menu
                            key={String(showMenu)}
                            visible={showMenu}
                            onDismiss={() => setShowMenu(false)}
                            anchor={MenuButtonAction}
                        >
                            <Menu.Item onPress={() => {
                            }} title="Editar"/>
                            <Divider/>
                            <Menu.Item onPress={onDelete} title="Eliminar"/>
                        </Menu>

                    </View>
                </View>
                <Divider/>
                <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 3}}>
                        <Text variant="labelMedium">Nombre</Text>
                        <Text variant="bodyLarge">{props.model.Name}</Text>
                    </View>
                    <View style={{flex: 2, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <View style={{flex: 1}}>
                            <Text variant="labelMedium">Valor</Text>
                            <Text variant="bodyMedium" style={{textAlign: 'center'}}>{props.model.Value} COP</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text variant="labelMedium">Cantidad</Text>
                            <Text variant="bodyMedium" style={{textAlign: 'center'}}>{props.model.Amount}</Text>
                        </View>
                    </View>
                </View>
            </Card.Content>
        </Card>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});
