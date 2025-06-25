import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Sun, Moon, Droplets, Footprints, DollarSign, Heart } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const todayStats = {
    mood: 4.2,
    sleep: 7.5,
    steps: 8420,
    hydration: 6,
    expenses: 45.50,
  };

  const recentActivities = [
    { id: '1', type: 'mood', description: 'Logged mood: Great', time: '2 hours ago', icon: '😊' },
    { id: '2', type: 'health', description: 'Tracked 30 min workout', time: '4 hours ago', icon: '💪' },
    { id: '3', type: 'finance', description: 'Added gym membership', time: '1 day ago', icon: '💰' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.welcomeText}>Ready to improve yourself today?</Text>
          </View>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/1547945/pexels-photo-1547945.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }}
            style={styles.profileImage}
          />
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Mood"
              value={`${todayStats.mood}/5`}
              subtitle="Feeling good"
              icon={<Heart size={20} color="#ec4899" />}
              color="#ec4899"
            />
            <StatCard
              title="Sleep"
              value={`${todayStats.sleep}h`}
              subtitle="Well rested"
              icon={<Moon size={20} color="#8b5cf6" />}
              color="#8b5cf6"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Steps"
              value={todayStats.steps.toLocaleString()}
              subtitle="Goal: 10,000"
              icon={<Footprints size={20} color="#10b981" />}
              color="#10b981"
            />
            <StatCard
              title="Water"
              value={`${todayStats.hydration} glasses`}
              subtitle="Stay hydrated"
              icon={<Droplets size={20} color="#3b82f6" />}
              color="#3b82f6"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Sun size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionText}>Log Mood</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
                <Droplets size={24} color="#3b82f6" />
              </View>
              <Text style={styles.actionText}>Add Water</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: '#ecfdf5' }]}>
                <Plus size={24} color="#10b981" />
              </View>
              <Text style={styles.actionText}>Track Health</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickAction}>
              <View style={[styles.actionIcon, { backgroundColor: '#fdf2f8' }]}>
                <DollarSign size={24} color="#ec4899" />
              </View>
              <Text style={styles.actionText}>Log Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card>
            {recentActivities.map((activity, index) => (
              <View key={activity.id}>
                <View style={styles.activityItem}>
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityDescription}>{activity.description}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
                {index < recentActivities.length - 1 && <View style={styles.activitySeparator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Daily Motivation */}
        <View style={styles.section}>
          <Card style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>Daily Motivation</Text>
            <Text style={styles.motivationText}>
              "The groundwork for all happiness is good health." - Leigh Hunt
            </Text>
            <Button
              title="Chat with AI Coach"
              onPress={() => {}}
              variant="outline"
              size="small"
              style={styles.motivationButton}
            />
          </Card>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#1e293b',
    marginBottom: 4,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  activitySeparator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 40,
  },
  motivationCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#e0f2fe',
    borderWidth: 1,
  },
  motivationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0c4a6e',
    marginBottom: 8,
  },
  motivationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  motivationButton: {
    alignSelf: 'flex-start',
  },
});