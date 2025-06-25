import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Shield, CircleHelp as HelpCircle, Info, ChevronRight, LogOut, Moon, Globe, Database, Target, Palette } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/hooks/useNotifications';

export default function Settings() {
  const { notificationSettings, updateNotificationSettings } = useNotifications();
  
  const [darkMode, setDarkMode] = useState(false);
  const [dataSync, setDataSync] = useState(true);

  const settingSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', subtitle: 'Manage your personal information', onPress: () => {} },
        { icon: Database, label: 'Data & Privacy', subtitle: 'Control your data and privacy settings', onPress: () => {} },
        { icon: Shield, label: 'Security', subtitle: 'Password and security settings', onPress: () => {} },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: Moon, 
          label: 'Dark Mode', 
          subtitle: 'Toggle dark mode theme',
          hasToggle: true,
          toggleValue: darkMode,
          onToggle: setDarkMode
        },
        { icon: Globe, label: 'Language', subtitle: 'English', onPress: () => {} },
        { icon: Target, label: 'Goals', subtitle: 'Set your wellness goals', onPress: () => {} },
      ]
    },
    {
      title: 'Data',
      items: [
        { 
          icon: Database, 
          label: 'Sync Data', 
          subtitle: 'Automatically sync with Supabase',
          hasToggle: true,
          toggleValue: dataSync,
          onToggle: setDataSync
        },
        { icon: Palette, label: 'Export Data', subtitle: 'Download your wellness data', onPress: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', subtitle: 'Get help and support', onPress: () => {} },
        { icon: Info, label: 'About', subtitle: 'App version and information', onPress: () => {} },
      ]
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Signing out...') }
      ]
    );
  };

  const renderSettingItem = (item: any) => {
    return (
      <TouchableOpacity 
        key={item.label}
        style={styles.settingItem}
        onPress={item.onPress}
        disabled={item.hasToggle}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <item.icon size={20} color="#64748b" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
          </View>
        </View>
        <View style={styles.settingRight}>
          {item.hasToggle ? (
            <Switch
              value={item.toggleValue}
              onValueChange={item.onToggle}
              trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
              thumbColor={item.toggleValue ? '#ffffff' : '#ffffff'}
            />
          ) : (
            <ChevronRight size={20} color="#94a3b8" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your wellness experience</Text>
        </View>

        {/* Profile Summary */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <User size={32} color="#14b8a6" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileStats}>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>47</Text>
              <Text style={styles.profileStatLabel}>Days Active</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>328</Text>
              <Text style={styles.profileStatLabel}>Entries Logged</Text>
            </View>
            <View style={styles.profileStat}>
              <Text style={styles.profileStatNumber}>12</Text>
              <Text style={styles.profileStatLabel}>Goals Achieved</Text>
            </View>
          </View>
        </Card>

        {/* Notification Settings */}
        <Card>
          <Text style={styles.cardTitle}>Smart Notifications</Text>
          <Text style={styles.cardSubtitle}>
            Get personalized reminders to help you stay on track with your wellness journey.
          </Text>
          <View style={styles.notificationsList}>
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Daily Reminders</Text>
                <Text style={styles.notificationDescription}>
                  9:00 AM reminders for mood, health, and finance tracking
                </Text>
              </View>
              <Switch
                value={notificationSettings.dailyReminders}
                onValueChange={(value) => updateNotificationSettings({ dailyReminders: value })}
                trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Weekly Insights</Text>
                <Text style={styles.notificationDescription}>
                  Sunday 10:00 AM summary of your weekly progress
                </Text>
              </View>
              <Switch
                value={notificationSettings.weeklyInsights}
                onValueChange={(value) => updateNotificationSettings({ weeklyInsights: value })}
                trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Mood Check-ins</Text>
                <Text style={styles.notificationDescription}>
                  Gentle reminders to log your daily mood
                </Text>
              </View>
              <Switch
                value={notificationSettings.moodReminders}
                onValueChange={(value) => updateNotificationSettings({ moodReminders: value })}
                trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Health Tracking</Text>
                <Text style={styles.notificationDescription}>
                  Reminders for sleep, steps, and hydration logging
                </Text>
              </View>
              <Switch
                value={notificationSettings.healthReminders}
                onValueChange={(value) => updateNotificationSettings({ healthReminders: value })}
                trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
                thumbColor="#ffffff"
              />
            </View>
            
            <View style={styles.notificationItem}>
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationLabel}>Finance Alerts</Text>
                <Text style={styles.notificationDescription}>
                  Budget alerts and expense tracking reminders
                </Text>
              </View>
              <Switch
                value={notificationSettings.financeReminders}
                onValueChange={(value) => updateNotificationSettings({ financeReminders: value })}
                trackColor={{ false: '#f1f5f9', true: '#14b8a6' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </Card>

        {/* Setting Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Card style={styles.settingsCard}>
              {section.items.map((item, itemIndex) => (
                <View key={item.label}>
                  {renderSettingItem(item)}
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        {/* Wellness Goals */}
        <Card>
          <Text style={styles.cardTitle}>Wellness Goals</Text>
          <View style={styles.goalsList}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Daily mood tracking</Text>
              <View style={styles.goalStatus}>
                <Text style={styles.goalStatusText}>Active</Text>
              </View>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>8 hours of sleep</Text>
              <View style={styles.goalStatus}>
                <Text style={styles.goalStatusText}>Active</Text>
              </View>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>10,000 steps daily</Text>
              <View style={styles.goalStatus}>
                <Text style={styles.goalStatusText}>Active</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* App Information */}
        <Card style={styles.infoCard}>
          <Text style={styles.appName}>My Better Self</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Your personal wellness companion for tracking mood, health, and financial wellness with smart notifications.
          </Text>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ecfdf5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#14b8a6',
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  profileStat: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 4,
  },
  profileStatLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    lineHeight: 20,
  },
  notificationsList: {
    gap: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationInfo: {
    flex: 1,
    marginRight: 16,
  },
  notificationLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  notificationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  settingRight: {
    marginLeft: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 72,
  },
  goalsList: {
    gap: 12,
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
  },
  goalStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#ecfdf5',
  },
  goalStatusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#10b981',
  },
  infoCard: {
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    borderColor: '#e0f2fe',
    borderWidth: 1,
    marginBottom: 24,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#0c4a6e',
    marginBottom: 4,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0369a1',
    marginBottom: 12,
  },
  appDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0369a1',
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutContainer: {
    marginBottom: 40,
  },
  logoutButton: {
    borderColor: '#ef4444',
  },
});