import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, TrendingUp, Plus } from 'lucide-react-native';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function MoodLog() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodNote, setMoodNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const moodEmojis = ['😢', '😟', '😐', '😊', '😄'];
  const moodLabels = ['Very Bad', 'Bad', 'Okay', 'Good', 'Great'];
  
  const moodTags = [
    'Work', 'Family', 'Health', 'Exercise', 'Sleep', 'Social', 
    'Weather', 'Stress', 'Relaxed', 'Motivated', 'Tired', 'Anxious'
  ];

  const recentMoods = [
    { date: 'Today', mood: 4, note: 'Had a great workout this morning!' },
    { date: 'Yesterday', mood: 3, note: 'Productive day at work' },
    { date: '2 days ago', mood: 2, note: 'Feeling a bit overwhelmed' },
    { date: '3 days ago', mood: 5, note: 'Amazing day with friends!' },
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      // TODO: Save mood to database
      console.log('Saving mood:', { selectedMood, moodNote, selectedTags });
      setSelectedMood(null);
      setMoodNote('');
      setSelectedTags([]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mood Tracker</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>

        {/* Mood Selection */}
        <Card>
          <Text style={styles.cardTitle}>Select Your Mood</Text>
          <View style={styles.moodGrid}>
            {moodEmojis.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodOption,
                  selectedMood === index + 1 && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(index + 1)}
              >
                <Text style={styles.moodEmoji}>{emoji}</Text>
                <Text style={styles.moodLabel}>{moodLabels[index]}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Mood Tags */}
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
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Mood Note */}
        <Card>
          <Text style={styles.cardTitle}>Add a Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind? How was your day?"
            multiline
            numberOfLines={4}
            value={moodNote}
            onChangeText={setMoodNote}
            textAlignVertical="top"
          />
        </Card>

        {/* Save Button */}
        <Button
          title="Save Mood Entry"
          onPress={handleSaveMood}
          disabled={!selectedMood}
          style={styles.saveButton}
        />

        {/* Recent Moods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <TrendingUp size={16} color="#14b8a6" />
              <Text style={styles.viewAllText}>View Trends</Text>
            </TouchableOpacity>
          </View>
          
          <Card>
            {recentMoods.map((entry, index) => (
              <View key={index}>
                <View style={styles.moodEntry}>
                  <View style={styles.moodEntryLeft}>
                    <Text style={styles.moodEntryEmoji}>
                      {moodEmojis[entry.mood - 1]}
                    </Text>
                    <View style={styles.moodEntryContent}>
                      <Text style={styles.moodEntryDate}>{entry.date}</Text>
                      <Text style={styles.moodEntryNote}>{entry.note}</Text>
                    </View>
                  </View>
                  <View style={styles.moodRating}>
                    <Text style={styles.moodRatingText}>{entry.mood}/5</Text>
                  </View>
                </View>
                {index < recentMoods.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        {/* Weekly Summary */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Calendar size={20} color="#14b8a6" />
            <Text style={styles.summaryTitle}>This Week's Summary</Text>
          </View>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3.8</Text>
              <Text style={styles.summaryLabel}>Average Mood</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>7</Text>
              <Text style={styles.summaryLabel}>Entries Logged</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>+0.5</Text>
              <Text style={styles.summaryLabel}>Improvement</Text>
            </View>
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
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodOption: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 60,
  },
  selectedMood: {
    backgroundColor: '#ecfdf5',
    borderColor: '#14b8a6',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  moodLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedTag: {
    backgroundColor: '#14b8a6',
    borderColor: '#14b8a6',
  },
  tagText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#475569',
  },
  selectedTagText: {
    color: '#ffffff',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
    minHeight: 100,
  },
  saveButton: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1e293b',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#14b8a6',
  },
  moodEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  moodEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEntryEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  moodEntryContent: {
    flex: 1,
  },
  moodEntryDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 2,
  },
  moodEntryNote: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748b',
  },
  moodRating: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodRatingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#0369a1',
  },
  separator: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 40,
  },
  summaryCard: {
    backgroundColor: '#f0f9ff',
    borderColor: '#e0f2fe',
    borderWidth: 1,
    marginBottom: 32,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0c4a6e',
    marginLeft: 8,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0369a1',
    marginBottom: 4,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#0369a1',
    textAlign: 'center',
  },
});