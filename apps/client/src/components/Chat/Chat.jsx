import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Send, User, MessageSquare, FileText, Loader, CheckCheck, MoreVertical, Download } from 'lucide-react';
import { Button } from '../ui';
import toast from 'react-hot-toast';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const inputRef = useRef(null);
  
  const sendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.off("receive_message").on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [socket]);

  const summarizeConversation = async () => {
    if (messageList.length === 0) {
      toast.error('No messages to summarize');
      return;
    }

    setIsSummarizing(true);
    try {
      const conversation = messageList
        .map((message) => `${message.author}: ${message.message}`)
        .join("\n");

      const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000";
      const response = await fetch(`${API_BASE_URL}/doctors/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
      toast.success('Summary generated successfully');
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error('Failed to generate summary');
    } finally {
      setIsSummarizing(false);
    }
  };

  const exportChat = () => {
    const chatText = messageList.map(msg => 
      `[${msg.time}] ${msg.author}: ${msg.message}`
    ).join('\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-${room}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Chat exported successfully');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {room.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Room: {room}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> 
              Live Consultation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={summarizeConversation}
            variant="secondary"
            size="sm"
            loading={isSummarizing}
            leftIcon={!isSummarizing && <FileText size={16} />}
            className="hidden md:flex"
          >
            {isSummarizing ? 'Generating...' : 'Summarize'}
          </Button>
          
          <button
            onClick={exportChat}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
            title="Export chat"
          >
            <Download size={20} />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollToBottom className="h-full w-full px-4 py-6 scrollbar-thin">
          {messageList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={40} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start Your Consultation</h3>
              <p className="text-gray-600">Send a message to begin the conversation</p>
            </div>
          ) : (
            messageList.map((messageContent, index) => {
              const isMe = username === messageContent.author;
              return (
                <div
                  key={index}
                  className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[75%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                    <div
                      className={`px-5 py-3.5 rounded-2xl shadow-md relative group transition-all ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap break-words">
                        {messageContent.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 px-1 text-xs text-gray-400">
                      <span>{messageContent.time}</span>
                      <span>•</span>
                      <span className="font-medium">{messageContent.author}</span>
                      {isMe && <CheckCheck size={14} className="text-blue-500" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </ScrollToBottom>
        
        {/* Summary Overlay */}
        {summary && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              
              <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <FileText size={24} />
                  </div>
                  <h3 className="font-bold text-xl">AI Consultation Summary</h3>
                </div>
                <button 
                  onClick={() => setSummary("")} 
                  className="text-white hover:bg-white/20 rounded-xl p-2 transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSummary("")}>
                  Close
                </Button>
                <Button onClick={() => window.print()} leftIcon={<Download size={18} />}>
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={currentMessage}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-gray-200 px-5 py-3.5 rounded-xl outline-none text-gray-800 placeholder-gray-400 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            size="md"
            className="!px-6"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Chat;