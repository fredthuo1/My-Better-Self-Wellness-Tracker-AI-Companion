import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Footprints, Droplets, Dumbbell, Scale, Plus } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';

export default function HealthLog() {
  const [sleepHours, setSleepHours] = useState('');
  const [steps, setSteps] = useState('');
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [weight, setWeight] = useState('');

  const todayStats = {
    sleep: 7.5,
    steps: 8420,
    water: 6,
    exercise: 45,
    weight: 68.5,
  };

  const incrementWater = () => {
    setWaterGlasses(prev => prev + 1);
  };

  const decrementWater = () => {
    setWaterGlasses(prev => Math.max(0, prev - 1));
  };

  const handleSaveHealth = () => {
    const healthData = {
      sleep: parseFloat(sleepHours),
      steps: parseInt(steps),
      water: waterGlasses,
      exercise: parseInt(exerciseMinutes),
      weight: parseFloat(weight),
    };
    console.log('Saving health data:', healthData);
    // Reset form
    setSleepHours('');
    setSteps('');
    setWaterGlasses(0);
    setExerciseMinutes('');
    setWeight('');
  };

  const recentEntries = [
    { date: 'Today', sleep: 7.5, steps: 8420, water: 6 },
    { date: 'Yesterday', sleep: 8.0, steps: 10250, water: 8 },
    { date: '2 days ago', sleep: 6.5, steps: 7800, water: 5 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health Tracker</Text>
          <Text style={styles.subtitle}>Monitor your daily health metrics</Text>
        </View>

        {/* Today's Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Sleep"
              value={`${todayStats.sleep}h`}
              subtitle="Goal: 8h"
              icon={<Moon size={20} color="#8b5cf6" />}
              color="#8b5cf6"
            />
            <StatCard
              title="Steps"
              value={todayStats.steps.toLocaleString()}
              subtitle="Goal: 10,000"
              icon={<Footprints size={20} color="#10b981" />}
              color="#10b981"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Water"
              value={`${todayStats.water} glasses`}
              subtitle="Goal: 8 glasses"
              icon={<Droplets size={20} color="#3b82f6" />}
              color="#3b82f6"
            />
            <StatCard
              title="Exercise"
              value={`${todayStats.exercise} min`}
              subtitle="Goal: 60 min"
              icon={<Dumbbell size={20} color="#f59e0b" />}
              color="#f59e0b"
            />
          </View>
        </View>

        {/* Quick Water Tracker */}
        <Card>
          <Text style={styles.cardTitle}>Quick Water Tracker</Text>
          <View style={styles.waterTracker}>
            <TouchableOpacity style={styles.waterButton} onPress={decrementWater}>
              <Text style={styles.waterButtonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.waterDisplay}>
              <Droplets size={32} color="#3b82f6" />
              <Text style={styles.waterCount}>{waterGlasses} glasses</Text>
            </View>
            <TouchableOpacity style={styles.waterButton} onPress={incrementWater}>
              <Text style={styles.waterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Health Input Form */}
        <Card>
          <Text style={styles.cardTitle}>Log Health Metrics</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Moon size={20} color="#8b5cf6" />
              <Text style={styles.inputLabel}>Sleep (hours)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 7.5"
              value={sleepHours}
              onChangeText={setSleepHours}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Footprints size={20} color="#10b981" />
              <Text style={styles.inputLabel}>Steps</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 8000"
              value={steps}
              onChangeText={setSteps}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Dumbbell size={20} color="#f59e0b" />
              <Text style={styles.inputLabel}>Exercise (minutes)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30"
              value={exerciseMinutes}
              onChangeText={setExerciseMinutes}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputRow}>
              <Scale size={20} color="#ec4899" />
              <Text style={styles.inputLabel}>Weight (kg)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g., 70.5"
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
            />
          </View>

          <Button
            title="Save Health Data"
            onPress={handleSaveHealth}
            style={styles.saveButton}
          />
        </Card>

        {/* Recent Entries */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Entries</Text>
          <Card>
            {recentEntries.map((entry, index) => (
              <View key={index}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryDate}>{entry.date}</Text>
                  <View style={styles.entryMetrics}>
                    <View style={styles.metric}>
                      <Moon size={16} color="#8b5cf6" />
                      <Text style={styles.metricText}>{entry.sleep}h</Text>
                    </View>
                    <View style={styles.metric}>
                      <Footprints size={16} color="#10b981" />
                      <Text style={styles.metricText}>{entry.steps.toLocaleString()}</Text>
                    </View>
                    <View style={styles.metric}>
                      <Droplets size={16} color="#3b82f6" />
                      <Text style={styles.metricText}>{entry.water}</Text>
                    </View>
                  </View>
                </View>
                {index < recentEntries.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Health Tips */}
        <Card style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>💡 Health Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Aim for 7-9 hours of sleep per night</Text>
            <Text style={styles.tip}>• Drink water throughout the day, not just when thirsty</Text>
            <Text style={styles.tip}>• Try to get 150 minutes of moderate exercise per week</Text>
            <Text style={styles.tip}>• Take the stairs instead of the elevator when possible</Text>
          </View>
        </Card>
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
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  waterTracker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  waterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
  },
  waterDisplay: {
    alignItems: 'center',
    gap: 8,
  },
  waterCount: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  saveButton: {
    marginTop: 8,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  entryDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
  },
  entryMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
  },
  tipsCard: {
    backgroundColor: '#fef7ff',
    borderColor: '#f3e8ff',
    borderWidth: 1,
    marginBottom: 32,
  },
  tipsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7c3aed',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tip: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7c3aed',
    lineHeight: 20,
  },
});