import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, Calendar, Target, Award, ChartBar as BarChart3, Sparkles, RefreshCw } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import Button from '@/components/ui/Button';
import { useWeeklySummary, WeeklySummaryData } from '@/hooks/useWeeklySummary';

export default function Insights() {
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
    const [summaryHistory, setSummaryHistory] = useState<WeeklySummaryData[]>([]);

    const {
        currentSummary,
        isGenerating,
        generateWeeklySummary,
        getWeeklySummaryHistory,
        getSummaryTrends
    } = useWeeklySummary();

    const periods = [
        { key: 'week', label: 'This Week' },
        { key: 'month', label: 'This Month' },
        { key: 'year', label: 'This Year' },
    ];

    useEffect(() => {
        loadSummaryHistory();
    }, []);

    const loadSummaryHistory = async () => {
        const history = await getWeeklySummaryHistory();
        setSummaryHistory(history);
    };

    const handleGenerateSummary = async () => {
        await generateWeeklySummary();
        await loadSummaryHistory();
    };

    const displaySummary = currentSummary || summaryHistory[0];
    const trends = getSummaryTrends(summaryHistory);

    const weeklyInsights = displaySummary ? {
        averageMood: displaySummary.mood_average,
        moodTrend: trends?.moodTrend || 'stable',
        totalSteps: displaySummary.steps_total,
        stepsTrend: trends?.activityTrend || 'stable',
        averageSleep: displaySummary.sleep_average,
        sleepTrend: trends?.sleepTrend || 'stable',
        totalExpenses: displaySummary.expenses_total,
        expensesTrend: trends?.spendingTrend || 'stable',
        overallScore: displaySummary.overall_score,
    } : {
        averageMood: 3.8,
        moodTrend: 'up' as const,
        totalSteps: 52420,
        stepsTrend: 'up' as const,
        averageSleep: 7.2,
        sleepTrend: 'stable' as const,
        totalExpenses: 245.50,
        expensesTrend: 'down' as const,
        overallScore: 7,
    };

    const achievements = displaySummary?.achievements || [
        'Sleep Champion - Hit sleep goal 5 days in a row',
        'Step Master - Walked 10,000+ steps 4 times',
        'Mood Tracker - Logged mood daily for 7 days',
        'Budget Saver - Spent 20% less than last week',
    ];

    const moodData = [
        { day: 'Mon', value: 3 },
        { day: 'Tue', value: 4 },
        { day: 'Wed', value: 5 },
        { day: 'Thu', value: 4 },
        { day: 'Fri', value: 4 },
        { day: 'Sat', value: 3 },
        { day: 'Sun', value: 4 },
    ];

    const healthData = [
        { metric: 'Sleep', current: weeklyInsights.averageSleep, target: 8.0, unit: 'hours' },
        { metric: 'Water', current: 6.5, target: 8.0, unit: 'glasses' },
        { metric: 'Exercise', current: typeof displaySummary?.exercise_total === 'number' ? displaySummary.exercise_total : 180, target: 300, unit: 'minutes' },
        { metric: 'Steps', current: weeklyInsights.totalSteps / 7, target: 10000, unit: 'avg/day' },
    ];

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return <TrendingUp size={16} color="#10b981" />;
            case 'down':
                return <TrendingDown size={16} color="#ef4444" />;
            default:
                return <TrendingUp size={16} color="#64748b" style={{ transform: [{ rotate: '90deg' }] }} />;
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case 'up':
                return { text: 'Improving', color: '#10b981' };
            case 'down':
                return { text: 'Declining', color: '#ef4444' };
            default:
                return { text: 'Stable', color: '#64748b' };
        }
    };

    const getProgressPercentage = (current: number, target: number) => {
        return Math.min((current / target) * 100, 100);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Weekly Insights</Text>
            <Text style={styles.subtitle}>AI-powered wellness analysis</Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleGenerateSummary}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator size="small" color="#8b5cf6" />
            ) : (
              <RefreshCw size={20} color="#8b5cf6" />
            )}
          </TouchableOpacity>
        </View>

        {/* AI Summary Generation */}
        {!displaySummary && (
          <Card style={styles.generateCard}>
            <View style={styles.generateHeader}>
              <Sparkles size={24} color="#8b5cf6" />
              <Text style={styles.generateTitle}>Generate Your Weekly Summary</Text>
            </View>
            <Text style={styles.generateDescription}>
              Get personalized insights and recommendations based on your mood, health, and finance data from the past week.
            </Text>
            <Button
              title={isGenerating ? "Generating Summary..." : "Generate AI Summary"}
              onPress={handleGenerateSummary}
              disabled={isGenerating}
              style={styles.generateButton}
            />
          </Card>
        )}

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.selectedPeriod
              ]}
              onPress={() => setSelectedPeriod(period.key as any)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period.key && styles.selectedPeriodText
              ]}>
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overall Score */}
        {displaySummary && (
          <Card style={styles.scoreCard}>
            <View style={styles.scoreHeader}>
              <Text style={styles.scoreTitle}>Overall Wellness Score</Text>
              <Text style={styles.scoreSubtitle}>
                Week of {formatDate(displaySummary.week_start)} - {formatDate(displaySummary.week_end)}
              </Text>
            </View>
            <View style={styles.scoreDisplay}>
              <Text style={styles.scoreNumber}>{weeklyInsights.overallScore}/10</Text>
              <View style={styles.scoreBar}>
                <View 
                  style={[
                    styles.scoreBarFill,
                    { width: `${weeklyInsights.overallScore * 10}%` }
                  ]} 
                />
              </View>
            </View>
          </Card>
        )}

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Avg Mood"
              value={`${weeklyInsights.averageMood}/5`}
              subtitle={getTrendText(weeklyInsights.moodTrend).text}
              icon={getTrendIcon(weeklyInsights.moodTrend)}
              color="#ec4899"
            />
            <StatCard
              title="Total Steps"
              value={weeklyInsights.totalSteps.toLocaleString()}
              subtitle={getTrendText(weeklyInsights.stepsTrend).text}
              icon={getTrendIcon(weeklyInsights.stepsTrend)}
              color="#10b981"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              title="Avg Sleep"
              value={`${weeklyInsights.averageSleep}h`}
              subtitle={getTrendText(weeklyInsights.sleepTrend).text}
              icon={getTrendIcon(weeklyInsights.sleepTrend)}
              color="#8b5cf6"
            />
            <StatCard
              title="Expenses"
              value={`$${weeklyInsights.totalExpenses.toFixed(2)}`}
              subtitle={getTrendText(weeklyInsights.expensesTrend).text}
              icon={getTrendIcon(weeklyInsights.expensesTrend)}
              color="#f59e0b"
            />
          </View>
        </View>

        {/* AI Insights */}
        {displaySummary && (
          <>
            {/* Weekly Highlight */}
            <Card style={styles.highlightCard}>
              <Text style={styles.highlightTitle}>🌟 Weekly Highlight</Text>
              <Text style={styles.highlightText}>{displaySummary.weekly_highlight}</Text>
            </Card>

            {/* AI Insights */}
            <Card>
              <Text style={styles.cardTitle}>AI Insights</Text>
              
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Mood Analysis</Text>
                <Text style={styles.insightText}>{displaySummary.mood_insights}</Text>
              </View>
              
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Health Analysis</Text>
                <Text style={styles.insightText}>{displaySummary.health_insights}</Text>
              </View>
              
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Finance Analysis</Text>
                <Text style={styles.insightText}>{displaySummary.finance_insights}</Text>
              </View>
            </Card>

            {/* Recommendations */}
            <Card>
              <Text style={styles.cardTitle}>Personalized Recommendations</Text>
              
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>💭 Mood</Text>
                {displaySummary.recommendations.mood.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
              
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>💪 Health</Text>
                {displaySummary.recommendations.health.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
              
              <View style={styles.recommendationSection}>
                <Text style={styles.recommendationTitle}>💰 Finance</Text>
                {displaySummary.recommendations.finance.map((rec, index) => (
                  <Text key={index} style={styles.recommendationText}>• {rec}</Text>
                ))}
              </View>
            </Card>

            {/* Next Week Goals */}
            <Card style={styles.goalsCard}>
              <Text style={styles.goalsTitle}>🎯 Goals for Next Week</Text>
              {displaySummary.next_week_goals.map((goal, index) => (
                <Text key={index} style={styles.goalText}>• {goal}</Text>
              ))}
            </Card>
          </>
        )}

        {/* Mood Chart */}
        <Card>
          <View style={styles.chartHeader}>
            <Text style={styles.cardTitle}>Mood Trends</Text>
            <BarChart3 size={20} color="#64748b" />
          </View>
          <View style={styles.moodChart}>
            {moodData.map((data, index) => (
              <View key={index} style={styles.moodBar}>
                <View style={styles.moodBarContainer}>
                  <View 
                    style={[
                      styles.moodBarFill,
                      { height: `${(data.value / 5) * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.moodBarLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Health Progress */}
        <Card>
          <Text style={styles.cardTitle}>Health Goals Progress</Text>
          {healthData.map((item, index) => (
            <View key={index} style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{item.metric}</Text>
                <Text style={styles.progressValue}>
                  {item.current.toLocaleString()} / {item.target.toLocaleString()} {item.unit}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${getProgressPercentage(item.current, item.target)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressPercentage}>
                {getProgressPercentage(item.current, item.target).toFixed(0)}%
              </Text>
            </View>
          ))}
        </Card>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.slice(0, 4).map((achievement, index) => (
              <Card key={index} style={styles.achievementCard}>
                <Award size={24} color="#f59e0b" />
                <Text style={styles.achievementText}>{achievement}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Motivational Message */}
        {displaySummary && (
          <Card style={styles.motivationCard}>
            <Text style={styles.motivationTitle}>💪 Your Wellness Journey</Text>
            <Text style={styles.motivationText}>{displaySummary.motivational_message}</Text>
          </Card>
        )}
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
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  generateCard: {
    backgroundColor: '#faf5ff',
    borderColor: '#e9d5ff',
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  generateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  generateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#7c3aed',
    marginLeft: 8,
  },
  generateDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8b5cf6',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  generateButton: {
    backgroundColor: '#8b5cf6',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriod: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748b',
  },
  selectedPeriodText: {
    color: '#1e293b',
  },
  scoreCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#e0f2fe',
    borderWidth: 1,
    marginBottom: 24,
  },
  scoreHeader: {
    marginBottom: 16,
  },
  scoreTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0c4a6e',
    marginBottom: 4,
  },
  scoreSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#0369a1',
  },
  scoreDisplay: {
    alignItems: 'center',
  },
  scoreNumber: {
    fontFamily: 'Inter-Bold',
    fontSize: 48,
    color: '#0c4a6e',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0f2fe',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#0369a1',
    borderRadius: 4,
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
  highlightCard: {
    backgroundColor: '#fefce8',
    borderColor: '#fef3c7',
    borderWidth: 1,
    marginBottom: 24,
  },
  highlightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#92400e',
    marginBottom: 8,
  },
  highlightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#a16207',
    lineHeight: 20,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  insightSection: {
    marginBottom: 20,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
  },
  insightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  recommendationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 8,
  },
  recommendationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 4,
  },
  goalsCard: {
    backgroundColor: '#ecfdf5',
    borderColor: '#d1fae5',
    borderWidth: 1,
    marginBottom: 24,
  },
  goalsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#065f46',
    marginBottom: 12,
  },
  goalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#047857',
    lineHeight: 20,
    marginBottom: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  moodChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingBottom: 20,
  },
  moodBar: {
    flex: 1,
    alignItems: 'center',
  },
  moodBarContainer: {
    width: 24,
    height: 80,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  moodBarFill: {
    backgroundColor: '#ec4899',
    borderRadius: 12,
    width: '100%',
  },
  moodBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
  progressItem: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
  },
  progressValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#14b8a6',
    borderRadius: 4,
  },
  progressPercentage: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#14b8a6',
    textAlign: 'right',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
  },
  achievementText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
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
  motivationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#7c3aed',
    lineHeight: 20,
  },
});