export interface MoodEntry {
  id: string;
  date: string;
  mood: number; // 1-5 scale
  notes?: string;
  tags?: string[];
}

export interface HealthEntry {
  id: string;
  date: string;
  sleep: number; // hours
  steps: number;
  hydration: number; // glasses of water
  weight?: number;
  exercise?: number; // minutes
}

export interface FinanceEntry {
  id: string;
  date: string;
  category: 'gym' | 'supplements' | 'therapy' | 'wellness' | 'medical' | 'other';
  amount: number;
  description: string;
  type: 'expense' | 'income';
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  is_completed: boolean;
  created_at: string;
}

export interface WeeklyInsight {
  week: string;
  averageMood: number;
  totalSteps: number;
  averageSleep: number;
  totalExpenses: number;
  trends: {
    mood: 'up' | 'down' | 'stable';
    health: 'up' | 'down' | 'stable';
    finance: 'up' | 'down' | 'stable';
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}