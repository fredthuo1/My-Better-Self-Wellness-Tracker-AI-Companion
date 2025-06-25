export async function POST(request: Request) {
  try {
    const { userId, weekStart, weekEnd } = await request.json();

    if (!userId || !weekStart || !weekEnd) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Fetch user data from the last 7 days
    const userData = await fetchWeeklyUserData(userId, weekStart, weekEnd);
    
    // Generate AI summary using OpenAI GPT-4
    const aiSummary = await generateAISummary(userData);
    
    // Save summary to Supabase
    const savedSummary = await saveSummaryToSupabase(userId, weekStart, weekEnd, aiSummary, userData);
    
    return Response.json({ 
      success: true, 
      summary: savedSummary,
      message: 'Weekly summary generated successfully' 
    });

  } catch (error) {
    console.error('Error generating weekly summary:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function fetchWeeklyUserData(userId: string, weekStart: string, weekEnd: string) {
  // In a real implementation, this would fetch from Supabase
  // For now, we'll simulate the data structure
  
  const mockData = {
    moodLogs: [
      { date: '2024-01-15', mood: 4, notes: 'Great workout today!', tags: ['Exercise', 'Motivated'] },
      { date: '2024-01-16', mood: 3, notes: 'Busy day at work', tags: ['Work', 'Stress'] },
      { date: '2024-01-17', mood: 5, notes: 'Amazing day with friends', tags: ['Social', 'Happy'] },
      { date: '2024-01-18', mood: 2, notes: 'Feeling overwhelmed', tags: ['Stress', 'Tired'] },
      { date: '2024-01-19', mood: 4, notes: 'Good sleep helped', tags: ['Sleep', 'Relaxed'] },
      { date: '2024-01-20', mood: 3, notes: 'Average day', tags: ['Work'] },
      { date: '2024-01-21', mood: 4, notes: 'Productive weekend', tags: ['Productive', 'Relaxed'] },
    ],
    healthLogs: [
      { date: '2024-01-15', sleep: 7.5, steps: 8420, water: 6, exercise: 45 },
      { date: '2024-01-16', sleep: 6.5, steps: 5200, water: 4, exercise: 0 },
      { date: '2024-01-17', sleep: 8.0, steps: 12000, water: 8, exercise: 60 },
      { date: '2024-01-18', sleep: 6.0, steps: 3500, water: 3, exercise: 0 },
      { date: '2024-01-19', sleep: 8.5, steps: 9500, water: 7, exercise: 30 },
      { date: '2024-01-20', sleep: 7.0, steps: 7800, water: 5, exercise: 20 },
      { date: '2024-01-21', sleep: 7.5, steps: 10500, water: 6, exercise: 40 },
    ],
    financeLogs: [
      { date: '2024-01-15', category: 'gym', amount: -45.00, description: 'Monthly gym membership' },
      { date: '2024-01-16', category: 'supplements', amount: -35.99, description: 'Protein powder' },
      { date: '2024-01-18', category: 'therapy', amount: -100.00, description: 'Therapy session' },
      { date: '2024-01-19', category: 'wellness', amount: -25.00, description: 'Yoga class' },
      { date: '2024-01-21', category: 'medical', amount: -80.00, description: 'Doctor visit' },
    ],
  };

  // Calculate summary statistics
  const moodAverage = mockData.moodLogs.reduce((sum, log) => sum + log.mood, 0) / mockData.moodLogs.length;
  const sleepAverage = mockData.healthLogs.reduce((sum, log) => sum + log.sleep, 0) / mockData.healthLogs.length;
  const stepsTotal = mockData.healthLogs.reduce((sum, log) => sum + log.steps, 0);
  const exerciseTotal = mockData.healthLogs.reduce((sum, log) => sum + log.exercise, 0);
  const expensesTotal = mockData.financeLogs.reduce((sum, log) => sum + Math.abs(log.amount), 0);

  return {
    userId,
    weekStart,
    weekEnd,
    moodLogs: mockData.moodLogs,
    healthLogs: mockData.healthLogs,
    financeLogs: mockData.financeLogs,
    summary: {
      moodAverage: Number(moodAverage.toFixed(1)),
      sleepAverage: Number(sleepAverage.toFixed(1)),
      stepsTotal,
      exerciseTotal,
      expensesTotal: Number(expensesTotal.toFixed(2)),
      daysLogged: mockData.moodLogs.length,
    }
  };
}

async function generateAISummary(userData: any) {
  const prompt = `
You are a wellness AI coach analyzing a user's weekly data. Please provide a comprehensive, personalized summary and actionable recommendations.

USER DATA FOR WEEK ${userData.weekStart} to ${userData.weekEnd}:

MOOD TRACKING:
- Average mood: ${userData.summary.moodAverage}/5
- Daily entries: ${userData.moodLogs.map(log => `${log.date}: ${log.mood}/5 - ${log.notes} (Tags: ${log.tags.join(', ')})`).join('\n')}

HEALTH METRICS:
- Average sleep: ${userData.summary.sleepAverage} hours
- Total steps: ${userData.summary.stepsTotal.toLocaleString()}
- Total exercise: ${userData.summary.exerciseTotal} minutes
- Daily health data: ${userData.healthLogs.map(log => `${log.date}: ${log.sleep}h sleep, ${log.steps} steps, ${log.water} glasses water, ${log.exercise}min exercise`).join('\n')}

FINANCIAL WELLNESS:
- Total expenses: $${userData.summary.expensesTotal}
- Expense breakdown: ${userData.financeLogs.map(log => `${log.date}: ${log.category} - $${Math.abs(log.amount)} (${log.description})`).join('\n')}

Please provide a JSON response with the following structure:
{
  "overallScore": number (1-10),
  "weeklyHighlight": "string (most positive moment)",
  "areasOfImprovement": ["array", "of", "specific", "areas"],
  "achievements": ["array", "of", "accomplishments"],
  "moodInsights": "detailed analysis of mood patterns",
  "healthInsights": "detailed analysis of health metrics", 
  "financeInsights": "detailed analysis of spending patterns",
  "recommendations": {
    "mood": ["specific", "actionable", "suggestions"],
    "health": ["specific", "actionable", "suggestions"],
    "finance": ["specific", "actionable", "suggestions"]
  },
  "nextWeekGoals": ["3-5", "specific", "achievable", "goals"],
  "motivationalMessage": "encouraging message for the user"
}

Focus on being encouraging, specific, and actionable. Identify patterns and provide personalized insights.
`;

  try {
    // In a real implementation, this would call OpenAI API
    // For now, we'll return a mock response based on the data
    const mockAIResponse = generateMockAIResponse(userData);
    return mockAIResponse;
    
    /* Real OpenAI implementation would look like:
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a wellness AI coach providing personalized insights and recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
    */
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate AI summary');
  }
}

function generateMockAIResponse(userData: any) {
  const { summary } = userData;
  
  // Analyze patterns to generate realistic insights
  const moodTrend = summary.moodAverage >= 3.5 ? 'positive' : 'needs attention';
  const sleepQuality = summary.sleepAverage >= 7.5 ? 'excellent' : summary.sleepAverage >= 6.5 ? 'good' : 'poor';
  const activityLevel = summary.stepsTotal >= 70000 ? 'high' : summary.stepsTotal >= 49000 ? 'moderate' : 'low';
  const spendingLevel = summary.expensesTotal > 300 ? 'high' : summary.expensesTotal > 150 ? 'moderate' : 'low';

  return {
    overallScore: Math.round((summary.moodAverage * 2) + (summary.sleepAverage / 8 * 10) / 2),
    weeklyHighlight: userData.moodLogs.find(log => log.mood === 5)?.notes || "Maintained consistent wellness tracking",
    areasOfImprovement: [
      ...(summary.sleepAverage < 7.5 ? ["Sleep consistency"] : []),
      ...(summary.stepsTotal < 70000 ? ["Daily movement"] : []),
      ...(summary.moodAverage < 3.5 ? ["Mood management"] : []),
      ...(summary.expensesTotal > 300 ? ["Wellness spending"] : [])
    ],
    achievements: [
      ...(summary.daysLogged === 7 ? ["Perfect tracking consistency"] : []),
      ...(summary.exerciseTotal > 150 ? ["Exceeded weekly exercise goals"] : []),
      ...(summary.moodAverage >= 4 ? ["Maintained positive mood"] : []),
      ...(summary.sleepAverage >= 8 ? ["Excellent sleep habits"] : [])
    ],
    moodInsights: `Your average mood this week was ${summary.moodAverage}/5, showing a ${moodTrend} trend. ${
      moodTrend === 'positive' 
        ? 'You maintained good emotional balance throughout the week, with particularly strong days when you exercised or spent time socially.' 
        : 'There were some challenging days this week. I noticed lower moods often coincided with poor sleep or high stress days.'
    }`,
    healthInsights: `Your sleep averaged ${summary.sleepAverage} hours (${sleepQuality}), and you accumulated ${summary.stepsTotal.toLocaleString()} steps with ${summary.exerciseTotal} minutes of exercise. ${
      sleepQuality === 'excellent' 
        ? 'Your sleep schedule is supporting your overall wellness beautifully.' 
        : 'Improving your sleep consistency could significantly boost your mood and energy levels.'
    }`,
    financeInsights: `You spent $${summary.expensesTotal} on wellness this week (${spendingLevel} spending). ${
      spendingLevel === 'high' 
        ? 'Consider reviewing your wellness budget to ensure sustainable spending habits.' 
        : 'Your wellness investments are well-balanced and sustainable.'
    }`,
    recommendations: {
      mood: [
        ...(summary.moodAverage < 3.5 ? ["Practice 10 minutes of daily mindfulness", "Schedule more social activities"] : ["Continue your positive mood practices"]),
        "Keep identifying what activities boost your mood most"
      ],
      health: [
        ...(summary.sleepAverage < 7.5 ? ["Establish a consistent bedtime routine", "Aim for 7.5-8 hours of sleep nightly"] : []),
        ...(summary.stepsTotal < 70000 ? ["Take a 15-minute walk after meals", "Use stairs instead of elevators"] : []),
        "Continue tracking your health metrics consistently"
      ],
      finance: [
        ...(summary.expensesTotal > 300 ? ["Set a monthly wellness budget", "Look for cost-effective wellness alternatives"] : []),
        "Track expenses to maintain awareness of spending patterns"
      ]
    },
    nextWeekGoals: [
      `Maintain ${summary.daysLogged === 7 ? 'perfect' : 'consistent'} daily tracking`,
      ...(summary.sleepAverage < 7.5 ? ["Get 7.5+ hours of sleep for 5 days"] : ["Continue excellent sleep habits"]),
      ...(summary.stepsTotal < 70000 ? ["Reach 10,000 steps on 4 days"] : ["Maintain high activity level"]),
      ...(summary.moodAverage < 4 ? ["Practice one mood-boosting activity daily"] : ["Identify and repeat mood-positive patterns"]),
      "Try one new wellness activity this week"
    ],
    motivationalMessage: `${
      summary.moodAverage >= 4 
        ? "You're doing an amazing job maintaining your wellness journey! Your consistency and positive attitude are truly inspiring." 
        : "Every step you take toward better wellness matters. This week showed both challenges and growth - that's exactly how progress works!"
    } Keep up the great work, and remember that small, consistent actions lead to big transformations. You've got this! 🌟`
  };
}

async function saveSummaryToSupabase(userId: string, weekStart: string, weekEnd: string, aiSummary: any, userData: any) {
  // In a real implementation, this would save to Supabase
  // For now, we'll return a mock saved summary
  
  const summary = {
    id: `summary_${Date.now()}`,
    user_id: userId,
    week_start: weekStart,
    week_end: weekEnd,
    overall_score: aiSummary.overallScore,
    weekly_highlight: aiSummary.weeklyHighlight,
    areas_of_improvement: aiSummary.areasOfImprovement,
    achievements: aiSummary.achievements,
    mood_insights: aiSummary.moodInsights,
    health_insights: aiSummary.healthInsights,
    finance_insights: aiSummary.financeInsights,
    recommendations: aiSummary.recommendations,
    next_week_goals: aiSummary.nextWeekGoals,
    motivational_message: aiSummary.motivationalMessage,
    mood_average: userData.summary.moodAverage,
    sleep_average: userData.summary.sleepAverage,
    steps_total: userData.summary.stepsTotal,
    exercise_total: userData.summary.exerciseTotal,
    expenses_total: userData.summary.expensesTotal,
    days_logged: userData.summary.daysLogged,
    created_at: new Date().toISOString(),
  };

  console.log('Saving summary to Supabase:', summary);
  
  /* Real Supabase implementation would look like:
  const { data, error } = await supabase
    .from('summaries')
    .insert([summary])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save summary: ${error.message}`);
  }

  return data;
  */
  
  return summary;
}