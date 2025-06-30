import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure you have this client
import { Session } from '@supabase/supabase-js';

export type MoodLog = {
    id: string;
    mood: number;
    note?: string;
    created_at: string;
};

export function useMoodLogs(userId?: string) {
    const [moods, setMoods] = useState<MoodLog[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<null | string>(null);

    const fetchMoodLogs = async () => {
        if (!userId) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('mood_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            setError(error.message);
        } else {
            setMoods(data);
        }
        setLoading(false);
    };

    const addMoodLog = async (mood: number, note?: string) => {
        const { data, error } = await supabase
            .from('mood_logs')
            .insert({ mood, note });

        if (error) {
            setError(error.message);
        } else {
            // re-fetch after insert
            fetchMoodLogs();
        }
    };

    useEffect(() => {
        fetchMoodLogs();
    }, [userId]);

    return {
        moods,
        loading,
        error,
        addMoodLog,
        fetchMoodLogs,
    };
}
