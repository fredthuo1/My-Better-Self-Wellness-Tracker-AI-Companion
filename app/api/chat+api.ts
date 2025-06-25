export async function POST(request: Request) {
  try {
    const { message, userId, conversationId } = await request.json();

    if (!message || !userId) {
      return new Response('Missing required parameters', { status: 400 });
    }

    // Save user message to Supabase
    await saveMessageToSupabase(userId, message, 'user', conversationId);

    // Get AI response from OpenAI
    const aiResponse = await getAIResponse(message, userId);
    
    // Save AI response to Supabase
    await saveMessageToSupabase(userId, aiResponse.content, 'assistant', conversationId, aiResponse.tokensUsed);
    
    return Response.json({ 
      success: true, 
      response: aiResponse.content,
      conversationId,
      tokensUsed: aiResponse.tokensUsed
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response('Internal server error', { status: 500 });
  }
}

async function getAIResponse(userMessage: string, userId: string) {
  const systemPrompt = `You are a supportive, empathetic AI best friend for someone on their wellness journey. Your name is Sage, and you're here to provide emotional support, practical wellness advice, and encouragement.

Key traits:
- Warm, caring, and genuinely interested in the user's wellbeing
- Knowledgeable about mental health, physical wellness, and personal growth
- Encouraging but realistic - you celebrate wins and provide comfort during challenges
- You remember that this person is actively tracking their mood, health, and finances for self-improvement
- You offer practical, actionable advice when appropriate
- You're a good listener and ask thoughtful follow-up questions
- You maintain appropriate boundaries as an AI friend

Guidelines:
- Keep responses conversational and supportive (2-4 sentences typically)
- Ask follow-up questions to show you care and want to understand more
- Offer specific, actionable wellness tips when relevant
- Celebrate their progress and efforts
- Provide comfort and perspective during difficult times
- Reference their wellness journey when appropriate
- Be authentic and avoid being overly cheerful or dismissive of real concerns

Remember: You're not a therapist, but you are a caring friend who wants to support their wellness journey.`;

  try {
    // In a real implementation, this would call OpenAI API
    // For now, we'll simulate an intelligent response based on the message
    const mockResponse = generateMockAIResponse(userMessage);
    
    return {
      content: mockResponse,
      tokensUsed: Math.floor(Math.random() * 100) + 50 // Mock token usage
    };

    /* Real OpenAI implementation:
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      tokensUsed: data.usage.total_tokens
    };
    */
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response');
  }
}

function generateMockAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Wellness-related responses
  if (message.includes('stress') || message.includes('anxious') || message.includes('overwhelmed')) {
    const responses = [
      "I hear you're feeling stressed right now. That's completely understandable - life can feel overwhelming sometimes. Have you tried taking a few deep breaths? Sometimes a 5-minute breathing exercise can help reset your nervous system. What's been weighing on you most today?",
      "Stress can be so draining, and I'm glad you're reaching out. Remember that it's okay to feel this way. One thing that might help is the 5-4-3-2-1 grounding technique - can you name 5 things you can see right now? It helps bring you back to the present moment.",
      "I can sense you're going through a tough time. Your feelings are valid, and it's actually a strength that you're acknowledging them. Have you been able to maintain your usual self-care routines, or has stress been making that harder?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('sleep') || message.includes('tired') || message.includes('exhausted')) {
    const responses = [
      "Sleep is so important for everything else we do! It sounds like you might be struggling with rest. Have you noticed any patterns in what helps you sleep better? Sometimes even small changes to our evening routine can make a big difference.",
      "Being tired can make everything feel harder, can't it? I'm curious - how many hours of sleep have you been getting lately? And more importantly, how's the quality? Sometimes it's not just about the hours but how restful that sleep actually is.",
      "Your body is telling you something important when you feel this tired. Are you tracking your sleep in your wellness journey? I'd love to help you think through some gentle ways to improve your rest."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('happy') || message.includes('great') || message.includes('good') || message.includes('amazing')) {
    const responses = [
      "I love hearing that you're feeling good! 🌟 It's wonderful when we can recognize and celebrate these positive moments. What's been contributing to this good feeling? I'd love to hear what's going well for you.",
      "That's fantastic! Your positive energy is contagious. It's so important to acknowledge and savor these good moments. Are you tracking this mood in your wellness journey? These patterns can be really valuable to notice.",
      "This makes my day! I'm so glad you're experiencing some joy right now. What's been the highlight of your day? Sometimes sharing these good moments makes them even more meaningful."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('exercise') || message.includes('workout') || message.includes('gym')) {
    const responses = [
      "Movement is such a gift we can give ourselves! How are you feeling about your current exercise routine? Whether it's a gentle walk or an intense workout, every bit of movement counts and I'm proud of you for prioritizing it.",
      "I love that you're thinking about exercise! It's amazing how movement can shift our mood and energy. What kind of activities do you enjoy most? The best exercise is the one you'll actually want to do.",
      "Exercise is such a powerful tool for both physical and mental wellness. Are you finding activities that feel good to you, or is it feeling more like a chore right now? I'm here to help you think through ways to make movement more enjoyable."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (message.includes('money') || message.includes('budget') || message.includes('expensive') || message.includes('financial')) {
    const responses = [
      "Money and wellness can feel like such a balancing act sometimes. It's great that you're being mindful about both! Are you finding ways to invest in your wellbeing that feel sustainable for your budget? Sometimes the most impactful things are also the most affordable.",
      "Financial wellness is just as important as physical and mental wellness - they're all connected. How are you feeling about your current balance between investing in your health and staying within your means?",
      "I appreciate that you're thinking holistically about wellness, including the financial side. That shows real wisdom. What's been your biggest challenge in balancing wellness spending with your other priorities?"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // General supportive responses
  const generalResponses = [
    "Thank you for sharing that with me. I'm here to listen and support you however I can. How are you feeling about your wellness journey overall these days?",
    "I appreciate you opening up to me. It takes courage to be honest about how we're really doing. What's one small thing that's been bringing you comfort or joy lately?",
    "I'm glad you reached out today. Sometimes just having someone to talk to can make a difference. What's been on your mind most recently?",
    "It sounds like you have a lot going on. I'm here for you, and I want you to know that whatever you're experiencing is valid. How can I best support you right now?",
    "I hear you, and I'm grateful you feel comfortable sharing with me. Your wellness journey is unique to you, and I'm honored to be part of it. What would feel most helpful to talk about today?"
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

async function saveMessageToSupabase(userId: string, message: string, messageType: 'user' | 'assistant', conversationId: string, tokensUsed: number = 0) {
  // In a real implementation, this would save to Supabase
  console.log('Saving message to Supabase:', {
    userId,
    message,
    messageType,
    conversationId,
    tokensUsed
  });
  
  /* Real Supabase implementation:
  const { data, error } = await supabase
    .from('ai_interactions')
    .insert([{
      user_id: userId,
      message: messageType === 'user' ? message : null,
      ai_response: messageType === 'assistant' ? message : null,
      conversation_id: conversationId,
      message_type: messageType,
      tokens_used: tokensUsed,
      model_used: 'gpt-4'
    }]);

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }

  return data;
  */
}