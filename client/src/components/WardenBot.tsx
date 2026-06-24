import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  sources?: string[];
  isAI?: boolean;
}

interface WardenBotProps {
  propertyId?: string;
  propertyName?: string;
}

export const WardenBot = ({ propertyId: propId, propertyName }: WardenBotProps) => {
  const params = useParams();
  const propertyId = propId || params.id;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      // Fallback to ref method
      messagesEndRef.current?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Also scroll when chat opens
  useEffect(() => {
    if (isOpen) {
      // Immediate scroll when opening
      setTimeout(() => {
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      }, 50);
    }
  }, [isOpen]);

  // Check AI status on mount
  useEffect(() => {
    const checkAIStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/rag/status`);
        const data = await res.json();
        setAiEnabled(data.data?.gemini || false);
      } catch {
        setAiEnabled(false);
      }
    };
    checkAIStatus();
  }, []);

  // Add welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'bot',
          text: propertyName 
            ? `Hi! I'm the Warden Bot for ${propertyName}. Ask me anything about the rules, policies, curfew, guests, or facilities!`
            : "Hi! I'm the Warden Bot. Select a property to ask specific questions, or ask me general questions about PG rules!",
          isAI: aiEnabled,
        },
      ]);
    }
  }, [isOpen, propertyName, aiEnabled, messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/rag/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentInput,
          listingId: propertyId || null,
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.success 
          ? data.data.answer 
          : 'Sorry, I encountered an error. Please try again.',
        sources: data.data?.sources,
        isAI: data.data?.isAI !== false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: "I'm having trouble connecting to the server. Please make sure the server is running.",
          isAI: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSuggestion = async (suggestion: string) => {
    if (loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: suggestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/rag/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: suggestion,
          listingId: propertyId || null,
        }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: data.success 
          ? data.data.answer 
          : 'Sorry, I encountered an error. Please try again.',
        sources: data.data?.sources,
        isAI: data.data?.isAI !== false,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          text: "I'm having trouble connecting to the server. Please make sure the server is running.",
          isAI: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = propertyId
    ? ['What is the curfew time?', 'Are guests allowed?', 'Can I cook here?', 'Any hidden costs?']
    : ['Tell me about curfew policies', 'What about guest rules?', 'Pet-friendly PGs?'];

  return (
    <>
      {/* Floating Button */}
      <Button
        className="fixed bottom-24 md:bottom-8 right-4 z-40 shadow-2xl shadow-indigo-500/25 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 h-14 px-6"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        <span className="hidden sm:inline">Ask Warden Bot</span>
        {aiEnabled && <Sparkles className="w-4 h-4 ml-2 text-yellow-200" />}
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-0 right-0 md:bottom-8 md:right-8 w-full md:w-[420px] h-[85vh] md:h-[600px] md:max-h-[80vh] bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    Warden Bot
                    {aiEnabled && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">AI</span>
                    )}
                  </h3>
                  <p className="text-xs text-white/80">
                    {propertyName || 'Ask about rules & policies'}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 scroll-smooth" id="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm shadow-sm'
                    } p-4 space-y-2`}
                  >
                    <div className="flex items-start gap-2">
                      {message.type === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 text-indigo-600 shrink-0" />
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap dark:text-gray-200">{message.text}</p>
                    </div>
                    {message.sources && message.sources.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100 dark:border-gray-600">
                        {message.sources.map((source, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-full">
                            📋 {source}
                          </span>
                        ))}
                      </div>
                    )}
                    {message.isAI && message.type === 'bot' && (
                      <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                        <Sparkles className="w-3 h-3" />
                        <span>AI-powered response</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSendSuggestion(suggestion)}
                    disabled={loading}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about curfew, guests, rules..."
                  disabled={loading}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all disabled:opacity-50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <Button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 rounded-xl h-12 w-12"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
