import { useEffect, useState, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { OneSignal } from 'react-native-onesignal';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationSettings {
  dailyReminders: boolean;
  weeklyInsights: boolean;
  moodReminders: boolean;
  healthReminders: boolean;
  financeReminders: boolean;
}

export function useNotifications() {
  const isMounted = useRef(true);
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [oneSignalUserId, setOneSignalUserId] = useState<string>('');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    dailyReminders: true,
    weeklyInsights: true,
    moodReminders: true,
    healthReminders: true,
    financeReminders: true,
  });

  useEffect(() => {
    initializeNotifications();
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const initializeNotifications = async () => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web platform');
      return;
    }

    try {
      // Initialize OneSignal
      OneSignal.initialize(process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID || 'your-onesignal-app-id');
      
      // Request permissions
      await requestNotificationPermissions();
      
      // Get OneSignal user ID
      const userId = await OneSignal.User.getOnesignalId();
      if (userId && isMounted.current) {
        setOneSignalUserId(userId);
      }

      // Set up notification listeners
      setupNotificationListeners();
      
      // Schedule default notifications
      await scheduleDefaultNotifications();
      
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const requestNotificationPermissions = async () => {
    if (Platform.OS === 'web') return;

    try {
      // Request OneSignal permissions
      const permission = await OneSignal.Notifications.requestPermission(true);
      console.log('OneSignal permission:', permission);

      // Request Expo notifications permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Get Expo push token
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      if (isMounted.current) {
        setExpoPushToken(token);
      }
      
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
    }
  };

  const setupNotificationListeners = () => {
    if (Platform.OS === 'web') return;

    // OneSignal notification listeners
    OneSignal.Notifications.addEventListener('click', (event) => {
      console.log('OneSignal notification clicked:', event);
      handleNotificationClick(event.notification);
    });

    OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
      console.log('OneSignal notification will display in foreground:', event);
      // Prevent notification from displaying in foreground if needed
      // event.preventDefault();
    });

    // Expo notification listeners
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Expo notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Expo notification response:', response);
      handleNotificationClick(response.notification);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };

  const handleNotificationClick = (notification: any) => {
    const data = notification.additionalData || notification.request?.content?.data;
    
    if (data?.screen) {
      // Navigate to specific screen based on notification data
      console.log('Navigate to screen:', data.screen);
      // You can use expo-router navigation here
    }
  };

  const scheduleDefaultNotifications = async () => {
    if (Platform.OS === 'web') return;

    try {
      // Cancel existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      if (notificationSettings.dailyReminders) {
        await scheduleDailyReminders();
      }

      if (notificationSettings.weeklyInsights) {
        await scheduleWeeklyInsights();
      }
    } catch (error) {
      console.error('Error scheduling notifications:', error);
    }
  };

  const scheduleDailyReminders = async () => {
    if (Platform.OS === 'web') return;

    const dailyNotifications = [
      {
        title: '🌅 Good Morning!',
        body: 'How are you feeling today? Take a moment to log your mood and start your day mindfully.',
        data: { screen: 'mood', type: 'daily_mood' },
        hour: 9,
        minute: 0,
      },
      {
        title: '💪 Health Check-in',
        body: "Don't forget to track your sleep, steps, and water intake for today!",
        data: { screen: 'health', type: 'daily_health' },
        hour: 9,
        minute: 5,
      },
      {
        title: '💰 Finance Reminder',
        body: 'Any wellness expenses today? Keep track of your spending to stay on budget.',
        data: { screen: 'finance', type: 'daily_finance' },
        hour: 9,
        minute: 10,
      },
    ];

    for (const notification of dailyNotifications) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
        },
        trigger: {
          hour: notification.hour,
          minute: notification.minute,
          repeats: true,
        },
      });
    }
  };

  const scheduleWeeklyInsights = async () => {
    if (Platform.OS === 'web') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📊 Weekly Wellness Summary',
        body: 'Your weekly insights are ready! See how you did this week and get personalized recommendations.',
        data: { screen: 'insights', type: 'weekly_summary' },
        sound: 'default',
      },
      trigger: {
        weekday: 1, // Sunday
        hour: 10,
        minute: 0,
        repeats: true,
      },
    });
  };

  const sendCustomNotification = async (title: string, body: string, data?: any) => {
    if (Platform.OS === 'web') {
      console.log('Custom notification (web):', { title, body, data });
      return;
    }

    try {
      // Send via OneSignal for better delivery
      if (oneSignalUserId) {
        await OneSignal.Notifications.sendNotification({
          contents: { en: body },
          headings: { en: title },
          include_external_user_ids: [oneSignalUserId],
          data: data || {},
        });
      } else {
        // Fallback to local notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: data || {},
            sound: 'default',
          },
          trigger: null, // Send immediately
        });
      }
    } catch (error) {
      console.error('Error sending custom notification:', error);
    }
  };

  const updateNotificationSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!isMounted.current) return;
    
    const updatedSettings = { ...notificationSettings, ...newSettings };
    setNotificationSettings(updatedSettings);
    
    // Reschedule notifications based on new settings
    await scheduleDefaultNotifications();
    
    // Save settings to storage (you might want to use AsyncStorage or Supabase)
    console.log('Updated notification settings:', updatedSettings);
  };

  const sendGoalAchievementNotification = async (goalTitle: string) => {
    await sendCustomNotification(
      '🎉 Goal Achieved!',
      `Congratulations! You've completed: ${goalTitle}`,
      { screen: 'goals', type: 'goal_achievement' }
    );
  };

  const sendMoodStreakNotification = async (streakDays: number) => {
    await sendCustomNotification(
      '🔥 Mood Tracking Streak!',
      `Amazing! You've logged your mood for ${streakDays} days in a row!`,
      { screen: 'mood', type: 'streak' }
    );
  };

  const sendBudgetAlertNotification = async (percentageUsed: number) => {
    await sendCustomNotification(
      '⚠️ Budget Alert',
      `You've used ${percentageUsed}% of your monthly wellness budget. Consider reviewing your expenses.`,
      { screen: 'finance', type: 'budget_alert' }
    );
  };

  return {
    expoPushToken,
    oneSignalUserId,
    notificationSettings,
    updateNotificationSettings,
    sendCustomNotification,
    sendGoalAchievementNotification,
    sendMoodStreakNotification,
    sendBudgetAlertNotification,
    scheduleDefaultNotifications,
  };
}