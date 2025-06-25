import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationManagerProps {
  children: React.ReactNode;
}

export default function NotificationManager({ children }: NotificationManagerProps) {
  const {
    sendGoalAchievementNotification,
    sendMoodStreakNotification,
    sendBudgetAlertNotification,
  } = useNotifications();

  useEffect(() => {
    // Set up any global notification logic here
    setupSmartNotifications();
  }, []);

  const setupSmartNotifications = () => {
    if (Platform.OS === 'web') return;

    // Example: Check for achievements and send notifications
    // This would typically be called when data changes
    checkForAchievements();
  };

  const checkForAchievements = async () => {
    // Mock data - in real app, this would come from your state/database
    const mockUserData = {
      moodStreak: 7,
      budgetUsed: 85,
      recentGoalCompleted: null,
    };

    // Check for mood tracking streak
    if (mockUserData.moodStreak > 0 && mockUserData.moodStreak % 7 === 0) {
      await sendMoodStreakNotification(mockUserData.moodStreak);
    }

    // Check for budget alerts
    if (mockUserData.budgetUsed >= 80) {
      await sendBudgetAlertNotification(mockUserData.budgetUsed);
    }

    // Check for goal achievements
    if (mockUserData.recentGoalCompleted) {
      await sendGoalAchievementNotification(mockUserData.recentGoalCompleted);
    }
  };

  return <>{children}</>;
}