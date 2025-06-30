import { Tabs } from 'expo-router';
import { Platform, Text, View, StyleSheet } from 'react-native';
import {
    Chrome as Home,
    Heart,
    Activity,
    DollarSign,
    TrendingUp,
    MessageCircle,
    Settings,
    Target,
} from 'lucide-react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#14b8a6',
                tabBarInactiveTintColor: '#64748b',
                tabBarLabelStyle: {
                    fontFamily: 'Inter-Medium',
                    fontSize: 12,
                },
            }}
            tabBar={(props) => (
                <View>
                    <View style={styles.boltBanner}>
                        <Text style={styles.boltText}>Built on Bolt ⚡</Text>
                    </View>
                    <BottomTabBar
                        {...props}
                        style={{
                            backgroundColor: '#ffffff',
                            borderTopWidth: 1,
                            borderTopColor: '#f1f5f9',
                            height: Platform.OS === 'ios' ? 90 : 70,
                            paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                            paddingTop: 10,
                        }}
                    />
                </View>
            )}
        >
            <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ size, color }) => <Home size={size} color={color} /> }} />
            <Tabs.Screen name="mood" options={{ title: 'Mood', tabBarIcon: ({ size, color }) => <Heart size={size} color={color} /> }} />
            <Tabs.Screen name="health" options={{ title: 'Health', tabBarIcon: ({ size, color }) => <Activity size={size} color={color} /> }} />
            <Tabs.Screen name="finance" options={{ title: 'Finance', tabBarIcon: ({ size, color }) => <DollarSign size={size} color={color} /> }} />
            <Tabs.Screen name="goals" options={{ title: 'Goals', tabBarIcon: ({ size, color }) => <Target size={size} color={color} /> }} />
            <Tabs.Screen name="insights" options={{ title: 'Insights', tabBarIcon: ({ size, color }) => <TrendingUp size={size} color={color} /> }} />
            <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarIcon: ({ size, color }) => <MessageCircle size={size} color={color} /> }} />
            <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ size, color }) => <Settings size={size} color={color} /> }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    boltBanner: {
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        paddingVertical: 6,
        borderTopWidth: 1,
        borderColor: '#e2e8f0',
    },
    boltText: {
        fontSize: 12,
        color: '#94a3b8',
        fontFamily: 'Inter-Medium',
    },
});
