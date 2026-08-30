import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Minimize2,
  Maximize2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { PartyPlan, AgentChatMessage, ShoppingItem } from '../types';
import confetti from 'canvas-confetti';

interface AIAgentChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
  onUpdatePlan: (updated: PartyPlan) => void;
}

const QUICK_PROMPTS = [
  '🛒 Find budget-friendly CymbalMart brand swaps',
  '🥗 Make all food options vegetarian & nut-free',
  '👥 4 extra adults just RSVP\'d, adjust my quantities',
  '🍹 Suggest a signature CymbalMart batch mocktail/punch',
  '📍 Guide me through store aisles efficiently'
];

export const AIAgentChatDrawer: React.FC<AIAgentChatDrawerProps> = ({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
}) => {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'agent',
      text: `Hello! I'm your CymbalMart Assistant. Welcome to CymbalMart party planning for "${plan.brief.name}"! I can help you find products across our aisles, swap in money-saving store brands, handle dietary preferences, or scale portions for guest changes. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || loading) return;

    const userMsg: AgentChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          currentPlan: plan,
          chatHistory: messages.slice(-6),
        }),
      });

      if (!res.ok) throw new Error('Chat API returned error');

      const data = await res.json();

      let diffSummary = '';

      // If AI proposed modifications
      if ((data.itemsToAdd && data.itemsToAdd.length > 0) || (data.itemNamesToRemove && data.itemNamesToRemove.length > 0)) {
        let currentItems = [...plan.items];

        if (data.itemNamesToRemove && data.itemNamesToRemove.length > 0) {
          const namesToRemove = data.itemNamesToRemove.map((n: string) => n.toLowerCase());
          currentItems = currentItems.filter((i) => !namesToRemove.includes(i.name.toLowerCase()));
        }

        if (data.itemsToAdd && data.itemsToAdd.length > 0) {
          const formattedAdditions: ShoppingItem[] = data.itemsToAdd.map((item: any, idx: number) => ({
            id: item.id || `agent-add-${Date.now()}-${idx}`,
            name: item.name,
            category: item.category || 'food',
            quantity: item.quantity || '1 pack',
            numericQty: item.numericQty || 1,
            unit: item.unit || 'pack',
            estimatedUnitPrice: item.estimatedUnitPrice || 4.0,
            estimatedTotalPrice: item.estimatedTotalPrice || 4.0,
            priority: item.priority || 'must_have',
            purchased: false,
            storeCategory: item.storeCategory || 'grocery',
            aisle: item.aisle || 'General',
            dietaryTags: item.dietaryTags || [],
            buyingTip: item.buyingTip || 'Added by AI Shopping Agent',
          }));

          currentItems = [...formattedAdditions, ...currentItems];
        }

        onUpdatePlan({ ...plan, items: currentItems });

        diffSummary = data.suggestedAction || 'Updated your shopping checklist!';
        try {
          confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
        } catch (_) {}
      }

      const agentReply: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: data.reply || 'I have analyzed your request and updated the party plan accordingly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appliedDiffSummary: diffSummary || undefined,
      };

      setMessages((prev) => [...prev, agentReply]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: AgentChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: "I'm having trouble processing that right now. Feel free to directly edit items or check them off in your shopping list!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">CymbalMart Assistant</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-amber-300">Your AI Grocery & Party Concierge</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts Carousel */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 flex gap-1.5 no-scrollbar">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt.replace(/^[^\s]+\s/, ''))}
            disabled={loading}
            className="px-2.5 py-1 rounded-full bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-[11px] font-medium text-slate-700 whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="p-4 overflow-y-auto grow space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-amber-500 text-white shadow-2xs'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className={`space-y-1 max-w-[82%]`}>
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/80'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.appliedDiffSummary && (
                  <div className="mt-2 pt-2 border-t border-amber-200/60 text-emerald-800 font-bold flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{msg.appliedDiffSummary}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 px-1 block">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-4 h-4 text-amber-500 animate-spin" />
            <span>CymbalMart Assistant is checking inventory and tailoring your plan...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-3.5 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask CymbalMart Assistant for items, swaps, portions..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="grow px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
