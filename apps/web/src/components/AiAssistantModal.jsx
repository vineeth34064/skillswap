import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Compass, Map, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AiAssistantModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your SkillSwap AI Learning Assistant. Ask me to suggest a skill roadmap, recommend peer mentors, or generate practice exercises!' }
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    setTimeout(() => {
      let reply = "I recommend checking out our verified mentors in Discover or creating a custom learning roadmap!";
      if (userText.toLowerCase().includes('react') || userText.toLowerCase().includes('code')) {
        reply = "For React coding, check out Vineet's profile or generate a 3-step Frontend Roadmap on the Roadmaps page!";
      } else if (userText.toLowerCase().includes('credit') || userText.toLowerCase().includes('wallet')) {
        reply = "SkillSwap uses a 1-to-1 Time Credit economy. 1 hr teaching = +1 Credit, 1 hr learning = -1 Credit!";
      }
      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-4 bg-[#05070A]/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="w-full max-w-md liquid-glass-premium rounded-3xl border border-[#8B7CFF]/40 p-6 bg-[#0D1524]/95 space-y-4 text-white shadow-2xl relative"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6 text-[#72C7FF]" />
              <h3 className="font-black text-sm text-white">AI Learning Assistant</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs custom-scrollbar">
            {messages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-2xl ${m.sender === 'user' ? 'bg-[#8B7CFF]/20 border border-[#8B7CFF]/40 ml-8 text-white' : 'bg-white/[0.04] border border-white/10 mr-8 text-slate-200'}`}>
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Ask AI for mentor suggestions, roadmaps..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#080E24] border border-white/20 text-xs text-white"
            />
            <button type="submit" className="p-2.5 rounded-xl accent-gradient-bg text-[#05070A] font-bold">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiAssistantModal;
