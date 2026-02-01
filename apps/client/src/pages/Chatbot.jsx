import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Bot, User, Sparkles, FileText, Activity, X, Download } from 'lucide-react';
import { API_BASE_URL } from '../config/constant';
import { Button } from '../components/ui';
import toast from 'react-hot-toast';

export function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "👋 Hello! I'm your AI Medical Assistant. I can help you with:\n\n• Symptom analysis and health queries\n• Medical report interpretation\n• General health and wellness advice\n• Medication information\n\nHow can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/doctors/ai/patient_querry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { 
        type: 'bot', 
        text: data.response || "I apologize, but I couldn't process that request. Please try again or rephrase your question." 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        type: 'bot', 
        text: "I'm having trouble connecting right now. Please check your connection and try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      { 
        type: 'bot', 
        text: "Chat cleared! How can I help you today?" 
      }
    ]);
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.type === 'bot' ? 'AI Assistant' : 'You'}: ${msg.text}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  const suggestions = [
    { icon: Activity, text: "I have a fever and headache", color: "blue" },
    { icon: FileText, text: "Explain my blood test results", color: "green" },
    { icon: Sparkles, text: "Tips for better sleep", color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col px-4">
        
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-lg border border-gray-100 mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-2xl text-white mr-4">
              <Bot size={32} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">AI Health Assistant</h1>
              <p className="text-sm text-gray-600">Powered by MedAI • Available 24/7</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[calc(100vh-280px)]">
          
          {/* Chat Header Bar */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white font-semibold">Online</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportChat}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Export chat"
              >
                <Download size={18} />
              </button>
              <button
                onClick={clearChat}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin bg-gradient-to-b from-gray-50/50 to-white">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {msg.type === 'bot' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                    <Bot size={20} />
                  </div>
                )}
                
                <div 
                  className={`max-w-[75%] p-4 rounded-2xl leading-relaxed shadow-md ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <p className={`text-xs mt-2 ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {msg.type === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                    <User size={20} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0">
                  <Bot size={20} />
                </div>
                <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-bl-none shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only show initially) */}
          {messages.length <= 2 && (
             <div className="px-6 pb-4 flex gap-3 overflow-x-auto scrollbar-none">
               {suggestions.map((s, i) => (
                 <button 
                   key={i}
                   onClick={() => setInput(s.text)}
                   className={`flex items-center gap-2 px-4 py-2.5 bg-${s.color}-50 border border-${s.color}-200 rounded-xl text-sm font-medium text-${s.color}-700 hover:bg-${s.color}-100 transition-colors whitespace-nowrap shadow-sm`}
                 >
                   <s.icon size={16} />
                   {s.text}
                 </button>
               ))}
             </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-3">
              <button 
                className={`p-3 rounded-xl transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setIsListening(!isListening)}
                title="Voice Input"
              >
                {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your health concern..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all placeholder-gray-400"
                disabled={isLoading}
              />
              
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="md"
                className="!rounded-xl px-6"
              >
                <Send size={20} />
              </Button>
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              ⚠️ AI can make mistakes. Please consult a doctor for serious medical advice.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-4">
          This AI assistant is for informational purposes only and does not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}