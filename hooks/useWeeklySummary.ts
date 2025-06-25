import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useNotifications } from './useNotifications';

export interface WeeklySummaryData {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  overall_score: number;
  weekly_highlight: string;
  areas_of_improvement: string[];
  achievements: string[];
  mood_insights: string;
  health_insights: string;
  finance_insights: string;
  recommendations: {
    mood: string[];
    health: string[];
    finance: string[];
  };
  next_week_goals: string[];
  motivational_message: string;
  mood_average: number;
  sleep_average: number;
  steps_total: number;
  exercise_total: number;
  expenses_total: number;
  days_logged: number;
  created_at: string;
}

export function useWeeklySummary() {
  const [currentSummary, setCurrentSummary] = useState<WeeklySummaryData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { sendCustomNotification } = useNotifications();

  useEffect(() => {
    // Check if it's time to generate a new summary
    checkForWeeklySummaryGeneration();
    
    // Set up automatic generation every Sunday at 10 AM
    scheduleWeeklySummaryGeneration();
  }, []);

  const checkForWeeklySummaryGeneration = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const hour = now.getHours();
    
    // Check if it's Sunday between 10 AM and 11 AM and we haven't generated today
    if (dayOfWeek === 0 && hour === 10 && !hasGeneratedToday()) {
      generateWeeklySummary();
    }
  };

  const hasGeneratedToday = (): boolean => {
    if (!lastGenerated) return false;
    
    const today = new Date().toDateString();
    const lastGenDate = new Date(lastGenerated).toDateString();
    
    return today === lastGenDate;
  };

  const scheduleWeeklySummaryGeneration = () => {
    if (Platform.OS === 'web') {
      // For web, we can use setTimeout to check periodically
      const checkInterval = setInterval(() => {
        checkForWeeklySummaryGeneration();
      }, 60000 * 60); // Check every hour

      return () => clearInterval(checkInterval);
    }
  };

  const generateWeeklySummary = async (userId: string = 'user_123') => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Calculate week start and end dates
      const now = new Date();
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - now.getDay()); // Last Sunday
      
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekEnd.getDate() - 6); // Previous Monday
      
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          weekStart: weekStart.toISOString().split('T')[0],
          weekEnd: weekEnd.toISOString().split('T')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      setCurrentSummary(result.summary);
      setLastGenerated(new Date().toISOString());
      
      // Send notification about new summary
      await sendCustomNotification(
        '📊 Weekly Summary Ready!',
        'Your personalized wellness insights are now available. See how you did this week!',
        { screen: 'insights', type: 'weekly_summary_ready' }
      );
      
      console.log('Weekly summary generated successfully:', result.summary);
      
    } catch (error) {
      console.error('Error generating weekly summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const manualGenerateSummary = async (userId: string = 'user_123') => {
    await generateWeeklySummary(userId);
  };

  const getWeeklySummaryHistory = async (userId: string = 'user_123', limit: number = 10) => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now, return mock historical data
      const mockHistory: WeeklySummaryData[] = [
        {
          id: 'summary_1',
          user_id: userId,
          week_start: '2024-01-08',
          week_end: '2024-01-14',
          overall_score: 7,
          weekly_highlight: 'Maintained consistent exercise routine',
          areas_of_improvement: ['Sleep consistency', 'Hydration'],
          achievements: ['Perfect mood tracking', 'Exceeded step goals'],
          mood_insights: 'Your mood was generally positive this week, with particularly good days when you exercised.',
          health_insights: 'Sleep could be more consistent, but your activity levels were excellent.',
          finance_insights: 'Wellness spending was well within budget this week.',
          recommendations: {
            mood: ['Continue morning meditation', 'Schedule more social activities'],
            health: ['Set a consistent bedtime', 'Drink water first thing in morning'],
            finance: ['Track daily expenses', 'Look for gym membership deals']
          },
          next_week_goals: [
            'Sleep 8 hours for 5 nights',
            'Drink 8 glasses of water daily',
            'Continue daily mood tracking',
            'Try one new healthy recipe'
          ],
          motivational_message: 'You\'re building amazing habits! Keep up the consistency.',
          mood_average: 3.8,
          sleep_average: 7.1,
          steps_total: 68500,
          exercise_total: 180,
          expenses_total: 125.50,
          days_logged: 7,
          created_at: '2024-01-14T10:00:00Z',
        }
      ];
      
      return mockHistory.slice(0, limit);
    } catch (error) {
      console.error('Error fetching summary history:', error);
      return [];
    }
  };

  const getSummaryTrends = (summaries: WeeklySummaryData[]) => {
    if (summaries.length < 2) return null;
    
    const latest = summaries[0];
    const previous = summaries[1];
    
    return {
      moodTrend: latest.mood_average > previous.mood_average ? 'up' : 
                 latest.mood_average < previous.mood_average ? 'down' : 'stable',
      sleepTrend: latest.sleep_average > previous.sleep_average ? 'up' : 
                  latest.sleep_average < previous.sleep_average ? 'down' : 'stable',
      activityTrend: latest.steps_total > previous.steps_total ? 'up' : 
                     latest.steps_total < previous.steps_total ? 'down' : 'stable',
      spendingTrend: latest.expenses_total < previous.expenses_total ? 'up' : 
                     latest.expenses_total > previous.expenses_total ? 'down' : 'stable',
      overallTrend: latest.overall_score > previous.overall_score ? 'up' : 
                    latest.overall_score < previous.overall_score ? 'down' : 'stable',
    };
  };

  return {
    currentSummary,
    isGenerating,
    lastGenerated,
    generateWeeklySummary: manualGenerateSummary,
    getWeeklySummaryHistory,
    getSummaryTrends,
  };
}