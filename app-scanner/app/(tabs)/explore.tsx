import { StyleSheet, View } from 'react-native';
import { eq } from "drizzle-orm";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
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
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Productos</ThemedText>
            </ThemedView>

            <Table/>
            <Button mode="contained" onPress={onEditEvent} style={{marginTop: 16}}>
                Editar
            </Button>
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

    const onDelete = async () => {
        await db.delete(ProductsTable).where(eq(ProductsTable.SKU, props.model.SKU))
        queryClient.invalidateQueries({queryKey: ['/products']})
    }

    return (
        <Card style={{marginBottom: 8}}>
            <Card.Content>
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
            <Card.Actions>
                <Button onPress={onDelete}>Eliminar</Button>
                <Button>Editar</Button>
            </Card.Actions>
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
