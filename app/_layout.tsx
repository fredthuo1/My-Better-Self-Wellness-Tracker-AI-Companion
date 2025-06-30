import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import NotificationManager from '@/components/NotificationManager';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useFrameworkReady();

    const { loading } = useAuth();

    const [fontsLoaded, fontError] = useFonts({
        'Inter-Regular': Inter_400Regular,
        'Inter-Medium': Inter_500Medium,
        'Inter-SemiBold': Inter_600SemiBold,
        'Inter-Bold': Inter_700Bold,
    });

    useEffect(() => {
        if ((fontsLoaded || fontError) && !loading) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError, loading]);

    if ((!fontsLoaded && !fontError) || loading) {
        return null;
    }

    return (
        <NotificationManager>
            <View style={styles.container}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(tabs)" />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <StatusBar style="dark" />
            </View>
        </NotificationManager>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: '#f8fafc',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
    },
});
