import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { MessageSquare, Send, Image, Paperclip, CheckCheck, Smile, Search, Phone, Video } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const recipientIdFromNav = location.state?.recipientId;

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      if (res.success) {
        setConversations(res.conversations || []);
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
      if (res.success) setMessages(res.messages || []);
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

    setConversations(prev => prev.map(c => {
      if (c._id === activeConv?._id) {
        return { ...c, lastMessage: msgText, lastMessageAt: new Date().toISOString() };
      }
      return c;
    }));

    if (socket) {
      socket.emit('send_message', {
        conversationId: activeConv?._id,
        message: optimisticMessage,
        recipientId: recipient?._id
      });
    }

    try {
      const res = await api.post('/chat/messages', {
        conversationId: activeConv?._id,
        recipientId: recipient?._id,
        text: msgText
      });

      if (res.success && res.message) {
        setMessages(prev => prev.map(m => m._id === tempId ? res.message : m));
      }
    } catch (err) {
      console.error('Failed to persist message:', err);
      setMessages(prev => prev.filter(m => m._id !== tempId));
    }
  };

  const filteredConversations = conversations.filter(c => {
    const partner = c.participants.find(p => p._id !== user._id);
    return partner?.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activePartner = activeConv?.participants?.find(p => p._id !== user._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 text-white">
      <div className="liquid-glass-premium rounded-3xl border border-white/20 h-[700px] shadow-2xl overflow-hidden flex flex-col md:flex-row bg-[#101827]/95">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#0D1524]">
          
          <div className="p-4 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-base text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#8B7CFF]" /> SkillSwap Chat
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No message threads found.</div>
            ) : (
              filteredConversations.map((conv) => {
                const partner = conv.participants.find(p => p._id !== user._id);
                const isSelected = activeConv?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full p-4 text-left flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B7CFF]/20 border-l-4 border-[#8B7CFF]'
                        : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="relative">
                      <img src={partner?.avatar} alt={partner?.name} className="w-10 h-10 rounded-2xl object-cover shrink-0" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0D1524]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-white truncate">{partner?.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(conv.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{conv.lastMessage || 'Connected'}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Active Chat Window */}
        {activeConv ? (
          <div className="flex-1 flex flex-col h-full bg-[#080E24]/80">
            
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0D1524]">
              <div className="flex items-center gap-3">
                <img src={activePartner?.avatar} alt={activePartner?.name} className="w-10 h-10 rounded-2xl object-cover border border-[#8B7CFF]/40" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">{activePartner?.name}</h3>
                  <span className="text-[11px] text-emerald-400 font-extrabold flex items-center gap-1">
                    ● Online for Skill Exchange
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, i) => {
                const isMe = String(msg.senderId?._id || msg.senderId) === String(user._id);

                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs md:max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-md ${
                      isMe
                        ? 'accent-gradient-bg text-[#05070A] font-extrabold rounded-br-none'
                        : 'bg-white/[0.06] text-white border border-white/10 rounded-bl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[9px] flex items-center justify-end gap-1 ${isMe ? 'text-[#05070A]/80 font-mono' : 'text-slate-400 font-mono'}`}>
                        <span>{new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-[#05070A]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#0D1524]">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Message ${activePartner?.name || 'partner'}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7CFF]"
              />
              <button
                type="submit"
                className="p-3 accent-gradient-bg rounded-xl text-[#05070A] shadow-glow hover:scale-105 transition-all cursor-pointer"
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
