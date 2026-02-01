import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Send, User, MessageSquare, Clock, FileText, Loader, CheckCheck, MoreVertical } from 'lucide-react';

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  
  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
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
    setIsSummarizing(true);
    try {
      const conversation = messageList
        .map((message) => `${message.author}: ${message.message}`)
        .join("\n");

      // Assuming API_BASE_URL is imported or defined
      const API_BASE_URL = "http://localhost:4000"; // Or import from config
      const response = await fetch(`${API_BASE_URL}/doctors/ai/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversation }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {room.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Room: {room}</h3>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Live Consultation
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={summarizeConversation}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors"
          >
            {isSummarizing ? <Loader size={14} className="animate-spin" /> : <FileText size={14} />}
            Summarize
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <ScrollToBottom className="h-full w-full px-4 py-6 custom-scrollbar">
          {messageList.map((messageContent, index) => {
            const isMe = username === messageContent.author;
            return (
              <div
                key={index}
                className={`flex w-full mt-4 ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow-sm relative group ${
                      isMe
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                    }`}
                  >
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                    <span>{messageContent.time}</span>
                    <span>•</span>
                    <span className="font-medium">{messageContent.author}</span>
                    {isMe && <CheckCheck size={12} className="text-blue-500" />}
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
        
        {/* Summary Overlay */}
        {summary && (
            <div className="absolute inset-x-4 top-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-100 p-6 z-20 animate-fade-in max-h-[80%] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FileText size={20} />
                    </div>
                    <h3 className="font-bold text-indigo-900">AI Consultation Summary</h3>
                </div>
                <button onClick={() => setSummary("")} className="text-slate-400 hover:text-slate-600">
                    Close
                </button>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
              <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-700">Download PDF</button>
              </div>
            </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-full border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-white rounded-full transition-colors">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={currentMessage}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-2 py-2 outline-none text-slate-700 placeholder:text-slate-400 text-sm"
            onChange={(event) => setCurrentMessage(event.target.value)}
            onKeyPress={(event) => event.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!currentMessage.trim()}
          >
            <Send size={18} className={currentMessage.trim() ? "translate-x-0.5" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;