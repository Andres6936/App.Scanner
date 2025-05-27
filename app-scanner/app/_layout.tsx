import {Text, View} from "react-native";
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {PortalProvider, TamaguiProvider} from 'tamagui';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {StatusBar} from 'expo-status-bar';
import {useEffect} from 'react';
import 'react-native-reanimated';
import {useDrizzleStudio} from "expo-drizzle-studio-plugin";
import {useMigrations} from 'drizzle-orm/expo-sqlite/migrator';
import NiceModal from "@ebay/nice-modal-react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {useColorScheme} from '@/hooks/useColorScheme';
import {config} from "@/tamagui.config";
import migrations from '@/drizzle/migrations';
import {db, scannerConnection} from "@/services/sqlite/createClient";

// Create a client
const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useDrizzleStudio(scannerConnection);

    const {success, error} = useMigrations(db, migrations);
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    if (error) {
        return (
            <View>
                <Text>Migration error: {error.message}</Text>
            </View>
        );
    }
    if (!success) {
        return (
            <View>
                <Text>Migration is in progress...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <TamaguiProvider config={config} defaultTheme={colorScheme || 'light' as const}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <PortalProvider shouldAddRootHost>
                        <NiceModal.Provider>
                            <QueryClientProvider client={queryClient}>
                                <Stack>
                                    <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                                    <Stack.Screen name="+not-found"/>
                                </Stack>
                                <StatusBar style="auto"/>
                            </QueryClientProvider>
                        </NiceModal.Provider>
                    </PortalProvider>
                </ThemeProvider>
            </TamaguiProvider>
        </SafeAreaProvider>
    );
}
