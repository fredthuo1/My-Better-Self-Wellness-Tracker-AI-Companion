import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function MoodLog() {
    const [selectedMoodIndex, setSelectedMoodIndex] = useState<number | null>(null);
    const [moodNote, setMoodNote] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recentMoods, setRecentMoods] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const moodOptions = [
        { emoji: '😢', label: 'Sad', value: 'sad' },
        { emoji: '😠', label: 'Angry', value: 'angry' },
        { emoji: '😐', label: 'Neutral', value: 'neutral' },
        { emoji: '😨', label: 'Anxious', value: 'anxious' },
        { emoji: '😊', label: 'Happy', value: 'happy' },
        { emoji: '🤩', label: 'Excited', value: 'excited' },
    ];

    const moodTags = [
        'Work', 'Family', 'Health', 'Exercise', 'Sleep', 'Social',
        'Weather', 'Stress', 'Relaxed', 'Motivated', 'Tired', 'Anxious'
    ];

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleSaveMood = async () => {
        if (selectedMoodIndex === null) {
            alert('Please select a mood');
            return;
        }

        const moodString = moodOptions[selectedMoodIndex].value;

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error('User fetch failed:', userError);
            return;
        }

        // Optional: Ensure user is in users table if foreign key is not against auth.users
        // await supabase.from('users').insert([{ id: user.id, email: user.email }], { upsert: true });

        const { data, error } = await supabase.from('mood_logs').insert([
            {
                user_id: user.id,
                mood: moodString,
                note: moodNote,
                tags: selectedTags,
            },
        ]);

        if (error) {
            console.error('Insert failed:', error);
            Alert.alert('Error', 'Failed to log mood');
        } else {
            console.log('Mood logged successfully:', data);
            setSelectedMoodIndex(null);
            setMoodNote('');
            setSelectedTags([]);
            fetchRecentMoods();
        }
    };

    const fetchRecentMoods = async () => {
        const { data, error } = await supabase
            .from('mood_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(5);

        if (!error && data) setRecentMoods(data);
    };

    useEffect(() => {
        fetchRecentMoods();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Mood Tracker</Text>
                    <Text style={styles.subtitle}>How are you feeling today?</Text>
                </View>

                <Card>
                    <Text style={styles.cardTitle}>Select Your Mood</Text>
                    <View style={styles.moodGrid}>
                        {moodOptions.map((mood, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.moodOption,
                                    selectedMoodIndex === index && styles.selectedMood,
                                ]}
                                onPress={() => setSelectedMoodIndex(index)}
                            >
                                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                <Text style={styles.moodLabel}>{mood.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                <Card>
                    <Text style={styles.cardTitle}>What's influencing your mood?</Text>
                    <View style={styles.tagsContainer}>
                        {moodTags.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={[
                                    styles.tag,
                                    selectedTags.includes(tag) && styles.selectedTag
                                ]}
                                onPress={() => toggleTag(tag)}
                            >
                                <Text style={[
                                    styles.tagText,
                                    selectedTags.includes(tag) && styles.selectedTagText
                                ]}>{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Card>

                <Card>
                    <Text style={styles.cardTitle}>Add a Note (Optional)</Text>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="What's on your mind?"
                        multiline
                        numberOfLines={4}
                        value={moodNote}
                        onChangeText={setMoodNote}
                        textAlignVertical="top"
                    />
                </Card>

                <Button
                    title={loading ? 'Saving...' : 'Save Mood Entry'}
                    onPress={handleSaveMood}
                    disabled={selectedMoodIndex === null || loading}
                    style={styles.saveButton}
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Entries</Text>
                        <TouchableOpacity style={styles.viewAllButton}>
                            <TrendingUp size={16} color="#14b8a6" />
                            <Text style={styles.viewAllText}>View Trends</Text>
                        </TouchableOpacity>
                    </View>
                    <Card>
                        {recentMoods.length === 0 ? (
                            <Text style={{ padding: 12, color: '#64748b' }}>No entries yet.</Text>
                        ) : (
                            recentMoods.map((entry, index) => {
                                const moodMeta = moodOptions.find(m => m.value === entry.mood);
                                return (
                                    <View key={index} style={styles.moodEntry}>
                                        <Text style={styles.moodEntryEmoji}>{moodMeta?.emoji ?? '🙂'}</Text>
                                        <View style={styles.moodEntryContent}>
                                            <Text style={styles.moodEntryDate}>{new Date(entry.created_at).toLocaleDateString()}</Text>
                                            <Text style={styles.moodEntryNote}>{entry.note || 'No note.'}</Text>
                                        </View>
                                        <View style={styles.moodRating}>
                                            <Text style={styles.moodRatingText}>{moodMeta?.label}</Text>
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    scrollView: { flex: 1, paddingHorizontal: 20 },
    header: { paddingVertical: 20 },
    title: { fontSize: 32, fontWeight: '700', color: '#1e293b' },
    subtitle: { fontSize: 16, color: '#64748b' },
    cardTitle: { fontSize: 18, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
    moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    moodOption: { alignItems: 'center', padding: 16, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 2, borderColor: 'transparent', minWidth: 80, marginBottom: 12 },
    selectedMood: { backgroundColor: '#ecfdf5', borderColor: '#14b8a6' },
    moodEmoji: { fontSize: 28, marginBottom: 8 },
    moodLabel: { fontSize: 12, color: '#64748b', textAlign: 'center' },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' },
    selectedTag: { backgroundColor: '#14b8a6', borderColor: '#14b8a6' },
    tagText: { fontSize: 14, color: '#475569' },
    selectedTagText: { color: '#ffffff' },
    noteInput: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, padding: 16, fontSize: 16, backgroundColor: '#f8fafc', minHeight: 100 },
    saveButton: { marginVertical: 24 },
    section: { marginBottom: 32 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '600', color: '#1e293b' },
    viewAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    viewAllText: { fontSize: 14, color: '#14b8a6' },
    moodEntry: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    moodEntryEmoji: { fontSize: 24, marginRight: 12 },
    moodEntryContent: { flex: 1 },
    moodEntryDate: { fontSize: 14, fontWeight: '500', color: '#1e293b' },
    moodEntryNote: { fontSize: 12, color: '#64748b' },
    moodRating: { backgroundColor: '#f0f9ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    moodRatingText: { fontSize: 12, fontWeight: '600', color: '#0369a1' },
});
