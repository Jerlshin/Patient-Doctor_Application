import React, { useEffect, useState, useRef } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Send, User, MessageSquare, Clock, FileText, Loader } from 'lucide-react';

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
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const summarizeConversation = async () => {
    setIsSummarizing(true);
    try {
      const conversation = messageList
        .map((message) => `${message.author}: ${message.message}`)
        .join("\n");

      const { API_BASE_URL } = require("../../config/constant");
      const response = await fetch(`${API_BASE_URL}/doctors/ai/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversation }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Summarization error:", error);
      alert("Failed to summarize conversation");
    } finally {
      setIsSummarizing(false);
    }
  };

  useEffect(() => {
    socket.off("receive_message").on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 my-8">
      {/* Header */}
      <div className="bg-slate-800 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-white">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Live Consultation</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-slate-300 text-xs">Room: {room}</p>
            </div>
          </div>
        </div>
        {username === "Patient" && !summary && (
          <button
            onClick={summarizeConversation}
            disabled={isSummarizing || messageList.length === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {isSummarizing ? <Loader size={14} className="animate-spin" /> : <FileText size={14} />}
            Summarize
          </button>
        )}
      </div>

      {/* Chat Body */}
      <div className="flex-1 overflow-hidden relative bg-slate-50">
        <ScrollToBottom className="h-full w-full p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4 pb-4">
            {messageList.map((messageContent, index) => {
              const isMe = username === messageContent.author;
              return (
                <div
                  key={index}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}>
                      <p>{messageContent.message}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="text-[10px] text-gray-400 font-medium">{messageContent.author}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock size={10} /> {messageContent.time}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollToBottom>

        {/* Summary Overlay */}
        {summary && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 p-6 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-blue-600" /> Consultation Summary
                </h2>
                <button
                  onClick={() => setSummary("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{summary}</p>
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
                >
                  Print Summary
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 placeholder:text-gray-400"
            onChange={(event) => {
              setCurrentMessage(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            <Send size={18} className="translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
