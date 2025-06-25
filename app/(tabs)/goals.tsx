import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Plus, CircleCheck as CheckCircle, Circle, Sparkles, Calendar, TrendingUp } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';

interface Goal {
  id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

interface WeeklySummary {
  averageMood: number;
  totalSteps: number;
  averageSleep: number;
  totalExpenses: number;
  moodTrend: 'up' | 'down' | 'stable';
  healthTrend: 'up' | 'down' | 'stable';
  financeTrend: 'up' | 'down' | 'stable';
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Improve Sleep Quality',
      description: 'Get 8 hours of sleep consistently for 7 days in a row',
      is_completed: false,
      created_at: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      title: 'Daily Mood Tracking',
      description: 'Log my mood every day for 30 days to identify patterns',
      is_completed: true,
      created_at: '2024-01-10T09:00:00Z',
    },
    {
      id: '3',
      title: 'Reduce Wellness Spending',
      description: 'Cut monthly wellness expenses by 20% while maintaining quality',
      is_completed: false,
      created_at: '2024-01-12T14:30:00Z',
    },
  ]);

  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const [suggestedGoals, setSuggestedGoals] = useState<Omit<Goal, 'id' | 'created_at'>[]>([]);

  // Mock weekly summary data (in real app, this would come from Supabase)
  const weeklySummary: WeeklySummary = {
    averageMood: 3.2,
    totalSteps: 45000,
    averageSleep: 6.8,
    totalExpenses: 285.50,
    moodTrend: 'down',
    healthTrend: 'stable',
    financeTrend: 'up',
  };

  const completedGoals = goals.filter(goal => goal.is_completed).length;
  const activeGoals = goals.filter(goal => !goal.is_completed).length;
  const completionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, is_completed: !goal.is_completed }
          : goal
      )
    );
  };

  const generateAIGoals = async () => {
    setIsGeneratingGoals(true);
    
    try {
      // Simulate API call to OpenAI GPT-4
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI-generated goals based on user patterns
      const aiGoals = generateGoalsBasedOnPatterns(weeklySummary);
      setSuggestedGoals(aiGoals);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to generate AI suggestions. Please try again.');
    } finally {
      setIsGeneratingGoals(false);
    }
  };

  const generateGoalsBasedOnPatterns = (summary: WeeklySummary): Omit<Goal, 'id' | 'created_at'>[] => {
    const suggestions: Omit<Goal, 'id' | 'created_at'>[] = [];

    // Mood-based suggestions
    if (summary.averageMood < 3.5) {
      suggestions.push({
        title: 'Boost Daily Mood',
        description: 'Practice 10 minutes of mindfulness or gratitude journaling each morning to improve overall mood and emotional well-being',
        is_completed: false,
      });
    }

    // Sleep-based suggestions
    if (summary.averageSleep < 7.5) {
      suggestions.push({
        title: 'Optimize Sleep Schedule',
        description: 'Establish a consistent bedtime routine and aim for 7.5-8 hours of sleep nightly to improve energy and mood',
        is_completed: false,
      });
    }

    // Activity-based suggestions
    if (summary.totalSteps < 70000) { // Less than 10k per day average
      suggestions.push({
        title: 'Increase Daily Movement',
        description: 'Take a 15-minute walk after each meal to boost daily step count and improve cardiovascular health',
        is_completed: false,
      });
    }

    // Finance-based suggestions
    if (summary.financeTrend === 'up' && summary.totalExpenses > 250) {
      suggestions.push({
        title: 'Smart Wellness Budgeting',
        description: 'Create a monthly wellness budget and track expenses to maintain health investments without overspending',
        is_completed: false,
      });
    }

    // Holistic suggestions
    if (summary.moodTrend === 'down' && summary.healthTrend === 'stable') {
      suggestions.push({
        title: 'Mind-Body Connection',
        description: 'Try yoga or meditation 3 times per week to strengthen the connection between physical and mental wellness',
        is_completed: false,
      });
    }

    // Return only 2 most relevant suggestions
    return suggestions.slice(0, 2);
  };

  const addSuggestedGoal = (suggestedGoal: Omit<Goal, 'id' | 'created_at'>) => {
    const newGoal: Goal = {
      ...suggestedGoal,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setSuggestedGoals(prevSuggestions => 
      prevSuggestions.filter(goal => goal.title !== suggestedGoal.title)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Goals</Text>
          <Text style={styles.subtitle}>Track your wellness objectives</Text>
        </View>

        {/* Goals Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progress Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Active Goals"
              value={activeGoals.toString()}
              subtitle="In progress"
              icon={<Target size={20} color="#14b8a6" />}
              color="#14b8a6"
            />
            <StatCard
              title="Completed"
              value={completedGoals.toString()}
              subtitle="Achieved"
              icon={<CheckCircle size={20} color="#10b981" />}
              color="#10b981"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Success Rate"
              value={`${completionRate}%`}
              subtitle="Overall completion"
              icon={<TrendingUp size={20} color="#8b5cf6" />}
              color="#8b5cf6"
            />
            <StatCard
              title="This Month"
              value={goals.filter(g => new Date(g.created_at).getMonth() === new Date().getMonth()).length.toString()}
              subtitle="Goals created"
              icon={<Calendar size={20} color="#f59e0b" />}
              color="#f59e0b"
            />
          </View>
        </View>

        {/* AI Goal Suggestions */}
        <Card>
          <View style={styles.aiSectionHeader}>
            <View style={styles.aiTitleContainer}>
              <Sparkles size={20} color="#8b5cf6" />
              <Text style={styles.aiSectionTitle}>AI Goal Suggestions</Text>
            </View>
            <Button
              title={isGeneratingGoals ? "Generating..." : "Get Suggestions"}
              onPress={generateAIGoals}
              disabled={isGeneratingGoals}
              size="small"
              style={styles.generateButton}
            />
          </View>
          
          {isGeneratingGoals && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#8b5cf6" />
              <Text style={styles.loadingText}>Analyzing your wellness patterns...</Text>
            </View>
          )}

          {suggestedGoals.length > 0 && !isGeneratingGoals && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsSubtitle}>
                Based on your recent mood, health, and finance patterns:
              </Text>
              {suggestedGoals.map((suggestion, index) => (
                <View key={index} style={styles.suggestionCard}>
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
                    <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addSuggestionButton}
                    onPress={() => addSuggestedGoal(suggestion)}
                  >
                    <Plus size={16} color="#8b5cf6" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {suggestedGoals.length === 0 && !isGeneratingGoals && (
            <Text style={styles.noSuggestionsText}>
              Tap "Get Suggestions" to receive personalized goals based on your wellness data.
            </Text>
          )}
        </Card>

        {/* Current Goals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Goals</Text>
          
          {goals.length === 0 ? (
            <Card style={styles.emptyState}>
              <Target size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
              <Text style={styles.emptyStateText}>
                Start by generating AI suggestions or create your first wellness goal.
              </Text>
            </Card>
          ) : (
            <Card style={styles.goalsContainer}>
              {goals.map((goal, index) => (
                <View key={goal.id}>
                  <View style={styles.goalItem}>
                    <TouchableOpacity
                      style={styles.goalCheckbox}
                      onPress={() => toggleGoalCompletion(goal.id)}
                    >
                      {goal.is_completed ? (
                        <CheckCircle size={24} color="#10b981" />
                      ) : (
                        <Circle size={24} color="#94a3b8" />
                      )}
                    </TouchableOpacity>
                    
                    <View style={styles.goalContent}>
                      <Text style={[
                        styles.goalTitle,
                        goal.is_completed && styles.completedGoalTitle
                      ]}>
                        {goal.title}
                      </Text>
                      <Text style={[
                        styles.goalDescription,
                        goal.is_completed && styles.completedGoalDescription
                      ]}>
                        {goal.description}
                      </Text>
                      <Text style={styles.goalDate}>
                        Created {formatDate(goal.created_at)}
                      </Text>
                    </View>
                  </View>
                  {index < goals.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </Card>
          )}
        </View>

        {/* Motivation Card */}
        <Card style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>🎯 Goal Setting Tips</Text>
          <View style={styles.tipsList}>
            <Text style={styles.tip}>• Make goals specific and measurable</Text>
            <Text style={styles.tip}>• Break large goals into smaller, actionable steps</Text>
            <Text style={styles.tip}>• Set realistic timelines for achievement</Text>
            <Text style={styles.tip}>• Review and adjust goals regularly</Text>
            <Text style={styles.tip}>• Celebrate small wins along the way</Text>
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
  aiSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginLeft: 8,
  },
  generateButton: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  suggestionContent: {
    flex: 1,
    marginRight: 12,
  },
  suggestionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7c3aed',
    marginBottom: 4,
  },
  suggestionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b5cf6',
    lineHeight: 20,
  },
  addSuggestionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  noSuggestionsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  goalsContainer: {
    padding: 0,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  goalCheckbox: {
    marginRight: 16,
    marginTop: 2,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  completedGoalTitle: {
    textDecorationLine: 'line-through',
    color: '#64748b',
  },
  goalDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
  },
  completedGoalDescription: {
    color: '#94a3b8',
  },
  goalDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 56,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#64748b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  motivationCard: {
    backgroundColor: '#fef7ff',
    borderColor: '#f3e8ff',
    borderWidth: 1,
    marginBottom: 32,
  },
  motivationTitle: {
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