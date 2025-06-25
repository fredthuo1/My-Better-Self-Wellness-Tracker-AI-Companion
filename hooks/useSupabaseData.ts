import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export interface MoodLog {
  id: string;
  mood: number;
  notes?: string;
  tags: string[];
  date: string;
  created_at: string;
}

export interface HealthLog {
  id: string;
  sleep_hours?: number;
  steps: number;
  water_glasses: number;
  exercise_minutes: number;
  weight?: number;
  date: string;
  created_at: string;
}

export interface FinanceLog {
  id: string;
  amount: number;
  category: string;
  description: string;
  type: 'expense' | 'income';
  date: string;
  created_at: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  is_completed: boolean;
  created_at: string;
}

export function useSupabaseData() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Mood logs functions
  const saveMoodLog = async (mood: number, notes?: string, tags: string[] = []) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('mood_logs')
        .upsert({
          user_id: user.id,
          mood,
          notes,
          tags,
          date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const getMoodLogs = async (limit: number = 30) => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as MoodLog[];
  };

  // Health logs functions
  const saveHealthLog = async (healthData: {
    sleep_hours?: number;
    steps?: number;
    water_glasses?: number;
    exercise_minutes?: number;
    weight?: number;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('health_logs')
        .upsert({
          user_id: user.id,
          ...healthData,
          date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const getHealthLogs = async (limit: number = 30) => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as HealthLog[];
  };

  // Finance logs functions
  const saveFinanceLog = async (financeData: {
    amount: number;
    category: string;
    description: string;
    type: 'expense' | 'income';
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('finance_logs')
        .insert({
          user_id: user.id,
          ...financeData,
          date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const getFinanceLogs = async (limit: number = 30) => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('finance_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as FinanceLog[];
  };

  // Goals functions
  const saveGoal = async (goalData: {
    title: string;
    description?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          ...goalData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: {
    title?: string;
    description?: string;
    is_completed?: boolean;
  }) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } finally {
      setLoading(false);
    }
  };

  const getGoals = async () => {
    if (!user) return [];
    
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Goal[];
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;
    } finally {
      setLoading(false);
    }
  };

  // Analytics functions
  const getWeeklyStats = async () => {
    if (!user) return null;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    try {
      // Get mood average
      const { data: moodData } = await supabase
        .from('mood_logs')
        .select('mood')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr);

      // Get health totals
      const { data: healthData } = await supabase
        .from('health_logs')
        .select('sleep_hours, steps, water_glasses, exercise_minutes')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr);

      // Get finance totals
      const { data: financeData } = await supabase
        .from('finance_logs')
        .select('amount, type')
        .eq('user_id', user.id)
        .gte('date', weekAgoStr);

      const moodAverage = moodData?.length 
        ? moodData.reduce((sum, log) => sum + log.mood, 0) / moodData.length 
        : 0;

      const sleepAverage = healthData?.length 
        ? healthData.reduce((sum, log) => sum + (log.sleep_hours || 0), 0) / healthData.length 
        : 0;

      const stepsTotal = healthData?.reduce((sum, log) => sum + (log.steps || 0), 0) || 0;
      const exerciseTotal = healthData?.reduce((sum, log) => sum + (log.exercise_minutes || 0), 0) || 0;

      const expensesTotal = financeData
        ?.filter(log => log.type === 'expense')
        .reduce((sum, log) => sum + Math.abs(log.amount), 0) || 0;

      return {
        moodAverage: Number(moodAverage.toFixed(1)),
        sleepAverage: Number(sleepAverage.toFixed(1)),
        stepsTotal,
        exerciseTotal,
        expensesTotal: Number(expensesTotal.toFixed(2)),
        daysLogged: moodData?.length || 0,
      };
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      return null;
    }
  };

  return {
    loading,
    // Mood functions
    saveMoodLog,
    getMoodLogs,
    // Health functions
    saveHealthLog,
    getHealthLogs,
    // Finance functions
    saveFinanceLog,
    getFinanceLogs,
    // Goals functions
    saveGoal,
    updateGoal,
    getGoals,
    deleteGoal,
    // Analytics
    getWeeklyStats,
  };
}