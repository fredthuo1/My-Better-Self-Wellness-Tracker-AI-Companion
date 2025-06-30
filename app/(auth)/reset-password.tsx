import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export default function ResetPassword() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [tokenHandled, setTokenHandled] = useState(false);

    useEffect(() => {
        handleToken();
    }, []);

    const handleToken = async () => {
        try {
            const url = await getInitialURL();
            if (!url) return;

            const params = extractParams(url);
            const access_token = params['access_token'];
            const refresh_token = params['refresh_token'] || '';

            if (access_token) {
                await supabase.auth.setSession({ access_token, refresh_token });
                setTokenHandled(true);
            }
        } catch (err) {
            Alert.alert('Error', 'Failed to parse token.');
        }
    };

    const getInitialURL = async () => {
        if (Platform.OS === 'web') {
            return window.location.href;
        } else {
            return await Linking.getInitialURL();
        }
    };

    const extractParams = (url: string) => {
        const query = url.includes('#') ? url.split('#')[1] : url.split('?')[1];
        const params = new URLSearchParams(query);
        const result: Record<string, string> = {};
        for (const [key, value] of params.entries()) {
            result[key] = value;
        }
        return result;
    };

    const handleUpdatePassword = async () => {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            Alert.alert('Success', 'Password updated!');
            router.replace('/(auth)/login');
        }
    };

    if (!tokenHandled) {
        return (
            <View style={{ padding: 20, marginTop: 50 }}>
                <Text>Loading token...</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20, marginTop: 50 }}>
            <Text style={{ fontSize: 24, marginBottom: 10 }}>Reset Password</Text>
            <TextInput
                placeholder="Enter new password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                    borderColor: '#ccc',
                    borderWidth: 1,
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 6,
                }}
            />
            <Button title="Update Password" onPress={handleUpdatePassword} />
        </View>
    );
}
