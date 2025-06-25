import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  conversationId?: string;
  tokensUsed?: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageTime: Date;
  messageCount: number;
}

export function useChat() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from Supabase
  const loadChatHistory = async (userId: string, conversationId?: string) => {
    try {
      // In a real implementation, this would fetch from Supabase
      console.log('Loading chat history for user:', userId, 'conversation:', conversationId);
      
      /* Real Supabase implementation:
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('conversation_id', conversationId || currentConversation)
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(`Failed to load chat history: ${error.message}`);
      }

      const chatMessages: ChatMessage[] = data.map(interaction => ({
        id: interaction.id,
        role: interaction.message_type,
        content: interaction.message || interaction.ai_response,
        timestamp: new Date(interaction.created_at),
        conversationId: interaction.conversation_id,
        tokensUsed: interaction.tokens_used,
      }));

      setMessages(chatMessages);
      */
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  // Load conversation list
  const loadConversations = async (userId: string) => {
    try {
      // In a real implementation, this would fetch from Supabase
      console.log('Loading conversations for user:', userId);
      
      /* Real Supabase implementation:
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('conversation_id, message, ai_response, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to load conversations: ${error.message}`);
      }

      // Group by conversation_id and create conversation summaries
      const conversationMap = new Map<string, ChatConversation>();
      
      data.forEach(interaction => {
        const convId = interaction.conversation_id;
        if (!conversationMap.has(convId)) {
          conversationMap.set(convId, {
            id: convId,
            title: generateConversationTitle(interaction.message || interaction.ai_response),
            lastMessage: interaction.message || interaction.ai_response,
            lastMessageTime: new Date(interaction.created_at),
            messageCount: 1,
          });
        } else {
          const conv = conversationMap.get(convId)!;
          conv.messageCount++;
          if (new Date(interaction.created_at) > conv.lastMessageTime) {
            conv.lastMessage = interaction.message || interaction.ai_response;
            conv.lastMessageTime = new Date(interaction.created_at);
          }
        }
      });

      setConversations(Array.from(conversationMap.values()));
      */
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Send message to AI
  const sendMessage = async (message: string, userId: string, conversationId: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      
      // Add user message
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
        conversationId,
      };

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        conversationId,
        tokensUsed: data.tokensUsed,
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newConversationId = `conv_${Date.now()}`;
    setCurrentConversation(newConversationId);
    setMessages([]);
    return newConversationId;
  };

  // Switch to existing conversation
  const switchConversation = async (conversationId: string, userId: string) => {
    setCurrentConversation(conversationId);
    await loadChatHistory(userId, conversationId);
  };

  // Generate conversation title from first message
  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  // Delete conversation
  const deleteConversation = async (conversationId: string, userId: string) => {
    try {
      // In a real implementation, this would delete from Supabase
      console.log('Deleting conversation:', conversationId);
      
      /* Real Supabase implementation:
      const { error } = await supabase
        .from('ai_interactions')
        .delete()
        .eq('user_id', userId)
        .eq('conversation_id', conversationId);

      if (error) {
        throw new Error(`Failed to delete conversation: ${error.message}`);
      }
      */

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  };

  // Get conversation statistics
  const getConversationStats = async (userId: string) => {
    try {
      // In a real implementation, this would query Supabase
      console.log('Getting conversation stats for user:', userId);
      
      /* Real Supabase implementation:
      const { data, error } = await supabase
        .from('ai_interactions')
        .select('tokens_used, created_at')
        .eq('user_id', userId);

      if (error) {
        throw new Error(`Failed to get conversation stats: ${error.message}`);
      }

      const totalTokens = data.reduce((sum, interaction) => sum + (interaction.tokens_used || 0), 0);
      const totalMessages = data.length;
      const conversationsCount = new Set(data.map(d => d.conversation_id)).size;

      return {
        totalTokens,
        totalMessages,
        conversationsCount,
        averageTokensPerMessage: totalMessages > 0 ? Math.round(totalTokens / totalMessages) : 0,
      };
      */

      // Mock stats for now
      return {
        totalTokens: 15420,
        totalMessages: 156,
        conversationsCount: 12,
        averageTokensPerMessage: 99,
      };
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      return null;
    }
  };

  return {
    conversations,
    currentConversation,
    messages,
    isLoading,
    loadChatHistory,
    loadConversations,
    sendMessage,
    createNewConversation,
    switchConversation,
    deleteConversation,
    getConversationStats,
  };
}