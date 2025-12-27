import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  RefreshCw,
  Volume2,
  VolumeX,
  BookOpen,
  Zap,
  Brain,
  Loader2
} from "lucide-react";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI learning tutor. I can help with:\n• Explaining concepts\n• Solving problems\n• Study strategies\n• Code debugging\n• Research assistance\n\nWhat would you like to learn about today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [typingText, setTypingText] = useState("");
  const messagesEndRef = useRef(null);
  const speechSynthesisRef = useRef(null);

  // Sample suggestions
  const suggestions = [
    "Explain quantum computing in simple terms",
    "Help me solve this calculus problem",
    "What's the difference between AI and ML?",
    "Create a study plan for Python",
    "How does blockchain work?",
    "Explain neural networks step by step"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    speechSynthesisRef.current = utterance;
    setIsSpeaking(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Please enter a question or topic you'd like to learn about.");
      return;
    }

    const userMessage = {
      id: conversation.length + 1,
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    // Simulate streaming response
    const thinkingText = "I'm thinking about your question...";
    setTypingText(thinkingText);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.content }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.reply || data.error || "Something went wrong");
      }

      // Simulate typing effect
      const responseText = data.reply || "I apologize, but I couldn't generate a response.";
      const words = responseText.split(" ");
      let currentText = "";
      
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 30));
        currentText += (i === 0 ? "" : " ") + words[i];
        setTypingText(currentText);
      }

      const assistantMessage = {
        id: conversation.length + 2,
        role: "assistant",
        content: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, assistantMessage]);
      setTypingText("");
      
    } catch (err) {
      setError(err.message || "Failed to connect to AI Tutor");
      
      const errorMessage = {
        id: conversation.length + 2,
        role: "assistant",
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setTypingText("");
    }
  };

  const handleClearChat = () => {
    setConversation([{
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI learning tutor. I can help with:\n• Explaining concepts\n• Solving problems\n• Study strategies\n• Code debugging\n• Research assistance\n\nWhat would you like to learn about today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleFeedback = (messageId, isPositive) => {
    // Send feedback to backend
    console.log(`Feedback for message ${messageId}: ${isPositive ? 'positive' : 'negative'}`);
    // You could add visual feedback here
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-900 to-gray-950' : 'bg-gradient-to-br from-blue-50 to-gray-100'} text-gray-900 flex items-center justify-center p-4 transition-colors duration-300`}>
      <div className={`w-full max-w-4xl ${isDarkMode ? 'bg-gray-800/80 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'} rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300`}>
        
        {/* Header */}
        <div className={`p-6 ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Brain className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  AI Learning Tutor
                </h1>
                <p className="text-sm opacity-90">
                  Your personal AI-powered learning companion
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? "🌙" : "☀️"}
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>New Chat</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Real-time explanations</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Multi-subject expert</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="p-4 border-b border-gray-700/50">
          <p className="text-sm font-medium mb-2 text-gray-400">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Container */}
        <div className="h-[500px] overflow-y-auto p-6">
          <div className="space-y-6">
            {conversation.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                }`}>
                  {msg.role === 'assistant' ? (
                    <Bot className="w-6 h-6 text-white" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className={`flex-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-semibold ${
                      isDarkMode 
                        ? msg.role === 'assistant' ? 'text-indigo-300' : 'text-blue-300'
                        : msg.role === 'assistant' ? 'text-indigo-600' : 'text-blue-600'
                    }`}>
                      {msg.role === 'assistant' ? 'AI Tutor' : 'You'}
                    </span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  
                  <div className={`rounded-2xl p-4 max-w-[85%] ${
                    msg.role === 'assistant'
                      ? isDarkMode 
                        ? 'bg-gray-700/50 text-gray-100' 
                        : 'bg-indigo-50 text-gray-800'
                      : isDarkMode 
                        ? 'bg-blue-900/30 text-white' 
                        : 'bg-blue-100 text-gray-800'
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">
                      {msg.content}
                    </div>
                    
                    {/* Message Actions */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-600/30">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1.5 rounded-lg hover:bg-gray-600/30 transition"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => speakText(msg.content)}
                          className="p-1.5 rounded-lg hover:bg-gray-600/30 transition"
                          title={isSpeaking ? "Stop speaking" : "Read aloud"}
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => handleFeedback(msg.id, true)}
                          className="p-1.5 rounded-lg hover:bg-gray-600/30 transition text-green-400"
                          title="Helpful"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, false)}
                          className="p-1.5 rounded-lg hover:bg-gray-600/30 transition text-red-400"
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && typingText && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-indigo-300">AI Tutor</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-150" />
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-300" />
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-2xl p-4 max-w-[85%]">
                    <p className="text-gray-300">{typingText}</p>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className={`p-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <form onSubmit={handleSend} className="space-y-3">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="relative">
              <textarea
                rows="3"
                placeholder="Ask anything about programming, math, science, or any other subject..."
                className={`w-full p-4 pr-12 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                  isDarkMode 
                    ? 'bg-gray-700/50 text-white placeholder-gray-400' 
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
              />
              
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all ${
                  loading || !message.trim()
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>Press Enter to send, Shift+Enter for new line</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400">
                  Powered by AI
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}