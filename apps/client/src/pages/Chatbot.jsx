import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, StopCircle, Bot, User, Sparkles, FileText, Activity } from 'lucide-react';
import { API_BASE_URL } from '../config/constant';

export function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "Hello! I'm your AI Medical Assistant. I can help analyze your symptoms, summarize medical reports, or answer health questions. How can I help you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/doctors/ai/patient_querry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      
      const data = await response.json();
      const botMessage = { type: 'bot', text: data.response || "I'm sorry, I couldn't process that request." };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'bot', text: "Sorry, I'm having trouble connecting to the server right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    { icon: Activity, text: "Check symptoms for fever" },
    { icon: FileText, text: "Interpret my blood test" },
    { icon: Sparkles, text: "Healthy diet tips" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-4">
        
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl text-white mr-3">
              <Bot size={24} />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-slate-800">AI Health Assistant</h1>
              <p className="text-xs text-slate-500">Powered by MedAI Models</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 glass rounded-3xl shadow-xl flex flex-col overflow-hidden h-[600px]">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex gap-4 ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
              >
                {msg.type === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  className={`max-w-[80%] p-4 rounded-2xl leading-relaxed text-sm ${
                    msg.type === 'user' 
                      ? 'bg-slate-800 text-white rounded-br-none shadow-md' 
                      : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (only show if few messages) */}
          {messages.length < 3 && (
             <div className="px-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
               {suggestions.map((s, i) => (
                 <button 
                   key={i}
                   onClick={() => setInput(s.text)}
                   className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors whitespace-nowrap"
                 >
                   <s.icon size={12} />
                   {s.text}
                 </button>
               ))}
             </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white/50 border-t border-slate-100 backdrop-blur-sm">
            <div className="relative flex items-center gap-2">
              <button 
                className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                onClick={() => setIsListening(!isListening)}
                title="Voice Input"
              >
                {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your health concern..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
              />
              
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              AI can make mistakes. Please consult a doctor for serious medical advice.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}