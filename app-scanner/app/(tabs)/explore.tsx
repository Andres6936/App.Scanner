import { StyleSheet } from 'react-native';
import { eq } from "drizzle-orm";
import { Button, Paragraph, XStack, YStack } from "tamagui";
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
            <Button onPress={onEditEvent}>
                <Paragraph>Editar</Paragraph>
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
            <Paragraph>Cargando ...</Paragraph>
        )
    }

    if (!data) {
        return (
            <Paragraph>No hay datos</Paragraph>
        )
    }

    return (
        <YStack gap="$2">
            {data.map(it => (
                <Item key={it.SKU} model={it}/>
            ))}
        </YStack>
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
        <YStack px="$2" rounded="$2" borderWidth={1} borderColor="$borderColor">
            <XStack>
                <YStack flex={3}>
                    <Paragraph>Nombre</Paragraph>
                    <Paragraph>{props.model.Name}</Paragraph>
                </YStack>
                <XStack flex={2} justify="flex-end">
                    <YStack flex={1}>
                        <Paragraph>Valor</Paragraph>
                        <Paragraph textAlign="center" textWrap="nowrap">{props.model.Value} COP</Paragraph>
                    </YStack>
                    <YStack flex={1}>
                        <Paragraph>Cantidad</Paragraph>
                        <Paragraph textAlign="center">{props.model.Amount}</Paragraph>
                    </YStack>
                </XStack>
            </XStack>
            <XStack>
                <Button onPress={onDelete}>
                    Eliminar
                </Button>
                <Button>
                    Editar
                </Button>
            </XStack>
        </YStack>
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
