import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { MessageSquare, Send, Image, Calendar, Check, User } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const recipientIdFromNav = location.state?.recipientId;

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      if (res.success) {
        setConversations(res.conversations);
        if (res.conversations.length > 0 && !activeConv) {
          setActiveConv(res.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (recipientIdFromNav && conversations.length > 0) {
      const found = conversations.find(c => c.participants.some(p => p._id === recipientIdFromNav));
      if (found) setActiveConv(found);
    }
  }, [recipientIdFromNav, conversations]);

  useEffect(() => {
    if (!activeConv) return;

    api.get(`/chat/messages/${activeConv._id}`).then(res => {
      if (res.success) setMessages(res.messages);
    }).catch(console.error);

    if (socket) {
      socket.emit('join_conversation', activeConv._id);
    }
  }, [activeConv, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m._id && msg._id && m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      scrollToBottom();
    };

    socket.on('receive_message', handleReceive);
    return () => socket.off('receive_message', handleReceive);
  }, [socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const msgText = text.trim();
    if (!msgText) return;

    const recipient = activeConv?.participants?.find(p => p._id !== user._id);
    const tempId = 'temp-' + Date.now();

    // 1. INSTANT OPTIMISTIC LOCAL UPDATE (0ms latency!)
    const optimisticMessage = {
      _id: tempId,
      conversationId: activeConv?._id,
      senderId: { _id: user._id, name: user.name, avatar: user.avatar },
      recipientId: recipient?._id,
      text: msgText,
      createdAt: new Date().toISOString()
    };

    setText('');
    setMessages(prev => [...prev, optimisticMessage]);

    // Update conversation list preview locally
    setConversations(prev => prev.map(c => {
      if (c._id === activeConv?._id) {
        return { ...c, lastMessage: msgText, lastMessageAt: new Date().toISOString() };
      }
      return c;
    }));

    // 2. Emit real-time socket message immediately
    if (socket) {
      socket.emit('send_message', {
        conversationId: activeConv?._id,
        message: optimisticMessage,
        recipientId: recipient?._id
      });
    }

    // 3. Persist asynchronously in background
    try {
      const res = await api.post('/chat/messages', {
        conversationId: activeConv?._id,
        recipientId: recipient?._id,
        text: msgText
      });

      if (res.success && res.message) {
        // Replace temp message with persisted database record
        setMessages(prev => prev.map(m => m._id === tempId ? res.message : m));
      }
    } catch (err) {
      console.error('Failed to persist message:', err);
      // Remove temp message if DB persistence fails
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  const activePartner = activeConv?.participants?.find(p => p._id !== user._id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
      <div className="glass-premium rounded-3xl border border-white/15 h-[580px] shadow-glass-3d overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Conversation List Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col glass-subtle">
          <div className="p-4 border-b border-white/10 font-extrabold text-base text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#72C7FF]" /> Messages
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No message threads yet. Request a swap to start chatting!</div>
            ) : (
              conversations.map((conv) => {
                const partner = conv.participants.find(p => p._id !== user._id);
                const isSelected = activeConv?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full p-4 text-left flex items-center gap-3 transition-colors ${
                      isSelected
                        ? 'glass-elevated border-l-4 border-[#72C7FF]'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <img src={partner?.avatar} alt={partner?.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-white truncate">{partner?.name}</h4>
                        <span className="text-[10px] text-slate-400">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate mt-0.5">{conv.lastMessage || 'Connected on SkillSwap'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Window */}
        {activeConv ? (
          <div className="flex-1 flex flex-col h-full bg-[#07090D]/60">
            
            {/* Top Partner Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between glass-subtle">
              <div className="flex items-center gap-3">
                <img src={activePartner?.avatar} alt={activePartner?.name} className="w-10 h-10 rounded-full object-cover border border-[#72C7FF]/40" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">{activePartner?.name}</h3>
                  <span className="text-[11px] text-[#72C7FF] font-semibold flex items-center gap-1">
                    ● Online for Skill Exchange
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => {
                const isMe = msg.senderId?._id === user._id || msg.senderId === user._id;

                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                      isMe
                        ? 'gradient-signature-bg text-[#07090D] font-medium rounded-br-none'
                        : 'glass-elevated text-slate-200 rounded-bl-none border border-white/10'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] text-right opacity-70 ${isMe ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2 glass-subtle">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Message ${activePartner?.name || 'partner'}...`}
                className="flex-1 px-4 py-2.5 rounded-xl glass-elevated border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#72C7FF]"
              />
              <button
                type="submit"
                className="p-2.5 gradient-signature-bg rounded-xl text-[#07090D] shadow-glow hover:scale-105 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 text-sm">
            Select a conversation thread to start messaging.
          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;
