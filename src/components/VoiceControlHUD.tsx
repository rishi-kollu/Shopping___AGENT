import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShoppingBag,
  Calculator,
  PieChart,
  Clock,
  Store,
  RefreshCw,
  HelpCircle,
  Play,
  Flame,
  Radio,
  Sliders
} from 'lucide-react';
import { PartyPlan, ShoppingItem, StoreCategory, ItemCategory } from '../types';

interface VoiceControlHUDProps {
  activePlan: PartyPlan;
  plans: PartyPlan[];
  onUpdatePlan: (updated: PartyPlan) => void;
  onSelectPlan: (id: string) => void;
  onNavigateTab: (tab: 'shopping' | 'portions' | 'budget' | 'timeline') => void;
  onToggleShopMode: () => void;
  shopMode: boolean;
  onOpenWizard: () => void;
  onOpenRecipes: () => void;
  onOpenChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

// Fallback SpeechRecognition type for browser compatibility
type SpeechRecognitionType = any;

export const VoiceControlHUD: React.FC<VoiceControlHUDProps> = ({
  activePlan,
  plans,
  onUpdatePlan,
  onSelectPlan,
  onNavigateTab,
  onToggleShopMode,
  shopMode,
  onOpenWizard,
  onOpenRecipes,
  onOpenChat,
  isOpen,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastFeedback, setLastFeedback] = useState<string>('Ready for voice commands. Try saying "Check off ice" or "What is my total?"');
  const [continuousMode, setContinuousMode] = useState(true);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [expandedCheatSheet, setExpandedCheatSheet] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number[]>([15, 25, 40, 60, 30, 20]);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const isListeningRef = useRef(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Text-to-Speech response
  const speakResponse = useCallback((text: string) => {
    setLastFeedback(text);
    if (!voiceFeedbackEnabled || !synthRef.current) return;

    try {
      synthRef.current.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      // Prefer friendly English voices if available
      const voices = synthRef.current.getVoices();
      const friendlyVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Alex'))
      );
      if (friendlyVoice) utterance.voice = friendlyVoice;

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
    }
  }, [voiceFeedbackEnabled]);

  // Audio wave animation when listening
  useEffect(() => {
    let interval: any;
    if (isListening) {
      interval = setInterval(() => {
        setAudioLevel([
          Math.floor(Math.random() * 50) + 15,
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 95) + 30,
          Math.floor(Math.random() * 70) + 20,
          Math.floor(Math.random() * 50) + 15,
        ]);
      }, 120);
    } else {
      setAudioLevel([10, 10, 10, 10, 10]);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  // Voice Command Processing Logic
  const processVoiceCommand = useCallback(
    async (rawText: string) => {
      const command = rawText.trim().toLowerCase();
      if (!command) return;

      setIsProcessing(true);

      // 1. Navigation Commands
      if (
        command.includes('shopping list') ||
        command.includes('show list') ||
        command.includes('go to list') ||
        command.includes('items')
      ) {
        onNavigateTab('shopping');
        speakResponse('Switched to your Shopping List.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('budget') ||
        command.includes('analytics') ||
        command.includes('spending') ||
        command.includes('show budget')
      ) {
        onNavigateTab('budget');
        speakResponse('Switched to Budget Allocation and Savings.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('portion') ||
        command.includes('drink math') ||
        command.includes('calculator') ||
        command.includes('food math')
      ) {
        onNavigateTab('portions');
        speakResponse('Switched to Portion and Drink Math Calculator.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('timeline') ||
        command.includes('schedule') ||
        command.includes('run of show') ||
        command.includes('countdown')
      ) {
        onNavigateTab('timeline');
        speakResponse('Switched to Run-of-Show Party Timeline.');
        setIsProcessing(false);
        return;
      }

      // 2. Shopping In-Store Mode
      if (
        command.includes('start shopping') ||
        command.includes('in store mode') ||
        command.includes('shop mode') ||
        command.includes('enter shop')
      ) {
        if (!shopMode) onToggleShopMode();
        speakResponse('In-Store Shopping Mode activated. Aisle by aisle view ready.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('exit shop') ||
        command.includes('leave shop') ||
        command.includes('close shop mode')
      ) {
        if (shopMode) onToggleShopMode();
        speakResponse('Exited In-Store Mode.');
        setIsProcessing(false);
        return;
      }

      // 3. Modals & Tools
      if (
        command.includes('plan new party') ||
        command.includes('create party') ||
        command.includes('open wizard') ||
        command.includes('new party')
      ) {
        onOpenWizard();
        speakResponse('Opening Party Planner AI Wizard.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('recipe') ||
        command.includes('signature cocktail') ||
        command.includes('batch cocktail') ||
        command.includes('drink recipe')
      ) {
        onOpenRecipes();
        speakResponse('Opening Signature Batch Recipes and Host Menus.');
        setIsProcessing(false);
        return;
      }

      if (
        command.includes('chat with assistant') ||
        command.includes('open chat') ||
        command.includes('open assistant')
      ) {
        onOpenChat();
        speakResponse('Opened CymbalMart Assistant chat drawer.');
        setIsProcessing(false);
        return;
      }

      // 4. Party Switcher
      if (command.includes('switch to') || command.includes('select')) {
        const found = plans.find((p) =>
          command.includes(p.brief.name.toLowerCase()) ||
          (command.includes('bbq') && p.brief.eventType === 'bbq') ||
          (command.includes('cocktail') && p.brief.eventType === 'cocktail') ||
          (command.includes('birthday') && p.brief.eventType === 'birthday')
        );
        if (found) {
          onSelectPlan(found.id);
          speakResponse(`Switched to party plan: ${found.brief.name}.`);
          setIsProcessing(false);
          return;
        }
      }

      // 5. Budget Inquiries & Recalculations
      if (
        command.includes('what is my total') ||
        command.includes('how much have i spent') ||
        command.includes('how much is my total') ||
        command.includes('budget status') ||
        command.includes('check budget')
      ) {
        const total = activePlan.budgetSummary.estimatedTotal || 0;
        const budget = activePlan.brief.budget || 200;
        const diff = budget - total;
        if (diff >= 0) {
          speakResponse(`Your estimated shopping total is $${total.toFixed(2)}, which is $${diff.toFixed(2)} under your $${budget} budget.`);
        } else {
          speakResponse(`Your estimated total is $${total.toFixed(2)}, which is $${Math.abs(diff).toFixed(2)} over your target budget of $${budget}.`);
        }
        setIsProcessing(false);
        return;
      }

      // 6. Set Budget
      const budgetMatch = command.match(/set budget (?:to )?\$?(\d+)/i) || command.match(/change budget (?:to )?\$?(\d+)/i);
      if (budgetMatch) {
        const newBudget = parseInt(budgetMatch[1], 10);
        if (newBudget > 0) {
          const updated: PartyPlan = {
            ...activePlan,
            brief: { ...activePlan.brief, budget: newBudget },
            budgetSummary: { ...activePlan.budgetSummary, targetBudget: newBudget },
          };
          onUpdatePlan(updated);
          speakResponse(`Target budget updated to $${newBudget}. Recalculated variance automatically.`);
          setIsProcessing(false);
          return;
        }
      }

      // 7. Set Guests
      const guestMatch = command.match(/set (?:adults|guests|people) (?:to )?(\d+)/i) || command.match(/change (?:adults|guests|people) (?:to )?(\d+)/i);
      if (guestMatch) {
        const newAdults = parseInt(guestMatch[1], 10);
        if (newAdults > 0) {
          const updated: PartyPlan = {
            ...activePlan,
            brief: { ...activePlan.brief, adultCount: newAdults },
          };
          onUpdatePlan(updated);
          speakResponse(`Guest count updated to ${newAdults} adults. Recalculating portions and budget.`);
          setIsProcessing(false);
          return;
        }
      }

      // 8. Read Shopping List (Hands-Free in store!)
      if (
        command.includes('read my list') ||
        command.includes('read shopping list') ||
        command.includes("what's on my list") ||
        command.includes('what is on my list') ||
        command.includes('what items are left') ||
        command.includes('what do i need')
      ) {
        const remaining = activePlan.items.filter((i) => !i.purchased);
        if (remaining.length === 0) {
          speakResponse('All items are checked off! You have completed your shopping.');
        } else {
          const topItems = remaining.slice(0, 5).map((i) => `${i.quantity} of ${i.name} in ${i.aisle || 'General Aisle'}`).join(', ');
          speakResponse(`You have ${remaining.length} items remaining. Top items are: ${topItems}.`);
        }
        setIsProcessing(false);
        return;
      }

      // 9. Check Off Item (Mark as purchased)
      if (
        command.startsWith('check off') ||
        command.startsWith('mark') ||
        command.startsWith('check') ||
        command.includes('purchased') ||
        command.includes('got the') ||
        command.includes('bought the')
      ) {
        let cleanName = command
          .replace(/^(check off|mark as done|mark as bought|mark as purchased|mark|check|bought the|bought|got the|got)\s+/i, '')
          .replace(/\s+(as done|as bought|as purchased|off)$/i, '')
          .trim();

        // Match against existing items
        const targetItem = activePlan.items.find((item) => {
          const iname = item.name.toLowerCase();
          return iname.includes(cleanName) || cleanName.includes(iname) ||
            cleanName.split(' ').some((word) => word.length > 3 && iname.includes(word));
        });

        if (targetItem) {
          const updatedItems = activePlan.items.map((i) =>
            i.id === targetItem.id ? { ...i, purchased: true } : i
          );
          onUpdatePlan({ ...activePlan, items: updatedItems });
          speakResponse(`Checked off ${targetItem.name}. Budget and progress updated.`);
          setIsProcessing(false);
          return;
        }
      }

      // 10. Uncheck Item
      if (
        command.startsWith('uncheck') ||
        command.startsWith('unmark')
      ) {
        const cleanName = command.replace(/^(uncheck|unmark)\s+/i, '').trim();
        const targetItem = activePlan.items.find((item) => {
          const iname = item.name.toLowerCase();
          return iname.includes(cleanName) || cleanName.includes(iname);
        });

        if (targetItem) {
          const updatedItems = activePlan.items.map((i) =>
            i.id === targetItem.id ? { ...i, purchased: false } : i
          );
          onUpdatePlan({ ...activePlan, items: updatedItems });
          speakResponse(`Unchecked ${targetItem.name}.`);
          setIsProcessing(false);
          return;
        }
      }

      // 11. Increase / Decrease Quantity
      if (command.startsWith('increase') || command.startsWith('add more') || command.startsWith('add one more')) {
        const cleanName = command.replace(/^(increase|add more|add one more)\s+/i, '').trim();
        const targetItem = activePlan.items.find((i) => i.name.toLowerCase().includes(cleanName));
        if (targetItem) {
          const curQty = targetItem.numericQty || 1;
          const newQty = curQty + 1;
          const newTotal = Math.round(newQty * (targetItem.estimatedUnitPrice || 0) * 100) / 100;
          const updatedItems = activePlan.items.map((i) =>
            i.id === targetItem.id
              ? { ...i, numericQty: newQty, quantity: `${newQty} ${i.unit || 'units'}`, estimatedTotalPrice: newTotal }
              : i
          );
          onUpdatePlan({ ...activePlan, items: updatedItems });
          speakResponse(`Increased ${targetItem.name} to quantity ${newQty}.`);
          setIsProcessing(false);
          return;
        }
      }

      // 12. Delete / Remove Item
      if (command.startsWith('delete') || command.startsWith('remove')) {
        const cleanName = command.replace(/^(delete|remove)\s+/i, '').trim();
        const targetItem = activePlan.items.find((i) => i.name.toLowerCase().includes(cleanName));
        if (targetItem) {
          const updatedItems = activePlan.items.filter((i) => i.id !== targetItem.id);
          onUpdatePlan({ ...activePlan, items: updatedItems });
          speakResponse(`Removed ${targetItem.name} from your shopping list.`);
          setIsProcessing(false);
          return;
        }
      }

      // 13. Add Item Hands-Free
      if (command.startsWith('add ') || command.startsWith('put ')) {
        const itemText = command.replace(/^(add|put)\s+/i, '').trim();
        // Check for quantity pattern e.g. "2 packs of hamburger buns" or "3 bags of ice"
        let parsedQty = 1;
        let parsedUnit = 'units';
        let parsedName = itemText;

        const qtyMatch = itemText.match(/^(\d+)\s+([a-zA-Z]+)\s+of\s+(.+)$/i);
        if (qtyMatch) {
          parsedQty = parseInt(qtyMatch[1], 10);
          parsedUnit = qtyMatch[2];
          parsedName = qtyMatch[3];
        } else {
          const simpleQtyMatch = itemText.match(/^(\d+)\s+(.+)$/i);
          if (simpleQtyMatch) {
            parsedQty = parseInt(simpleQtyMatch[1], 10);
            parsedName = simpleQtyMatch[2];
          }
        }

        // Category & Aisle heuristics
        let category: ItemCategory = 'food';
        let aisle = 'General Grocery';
        let estimatedPrice = 4.99;

        const lowerName = parsedName.toLowerCase();
        if (lowerName.includes('ice') || lowerName.includes('water') || lowerName.includes('soda') || lowerName.includes('juice') || lowerName.includes('wine') || lowerName.includes('beer')) {
          category = 'beverages';
          aisle = lowerName.includes('ice') ? 'Front Freezers' : 'Beverages Aisle 4';
          estimatedPrice = lowerName.includes('ice') ? 3.49 : 5.99;
        } else if (lowerName.includes('napkin') || lowerName.includes('plate') || lowerName.includes('cup') || lowerName.includes('fork')) {
          category = 'tableware';
          aisle = 'Paper Goods Aisle 7';
          estimatedPrice = 4.49;
        } else if (lowerName.includes('balloon') || lowerName.includes('banner') || lowerName.includes('candle')) {
          category = 'decor';
          aisle = 'Party Goods Aisle 8';
          estimatedPrice = 6.99;
        } else if (lowerName.includes('fruit') || lowerName.includes('lemon') || lowerName.includes('lime') || lowerName.includes('lettuce') || lowerName.includes('tomato')) {
          category = 'food';
          aisle = 'Produce Aisle 1';
          estimatedPrice = 3.99;
        } else if (lowerName.includes('beef') || lowerName.includes('chicken') || lowerName.includes('pork') || lowerName.includes('burger') || lowerName.includes('sausage')) {
          category = 'food';
          aisle = 'Meat & Poultry Counter';
          estimatedPrice = 9.99;
        }

        const newItem: ShoppingItem = {
          id: `voice-item-${Date.now()}`,
          name: parsedName.charAt(0).toUpperCase() + parsedName.slice(1),
          category,
          storeCategory: 'grocery' as StoreCategory,
          quantity: `${parsedQty} ${parsedUnit}`,
          numericQty: parsedQty,
          unit: parsedUnit,
          estimatedUnitPrice: estimatedPrice,
          estimatedTotalPrice: Math.round(parsedQty * estimatedPrice * 100) / 100,
          priority: 'must_have',
          purchased: false,
          aisle,
          buyingTip: 'Added hands-free via voice command.',
        };

        onUpdatePlan({
          ...activePlan,
          items: [newItem, ...activePlan.items],
        });

        speakResponse(`Added ${parsedQty} ${parsedUnit} of ${newItem.name} to ${aisle}. Total recalculated.`);
        setIsProcessing(false);
        return;
      }

      // 14. Fallback: Intelligent AI Query to CymbalMart Assistant
      try {
        const response = await fetch('/api/party/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: rawText,
            currentPlan: activePlan,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let replyText = data.reply || "I've processed your request.";

          // If AI suggested item additions or removals
          if (data.itemsToAdd?.length || data.itemNamesToRemove?.length) {
            let updatedList = [...activePlan.items];
            if (data.itemNamesToRemove?.length) {
              updatedList = updatedList.filter(
                (item) => !data.itemNamesToRemove.some((r: string) => item.name.toLowerCase().includes(r.toLowerCase()))
              );
            }
            if (data.itemsToAdd?.length) {
              const formattedNew = data.itemsToAdd.map((n: any, idx: number) => ({
                id: `voice-ai-${Date.now()}-${idx}`,
                name: n.name,
                category: n.category || 'food',
                quantity: n.quantity || '1 unit',
                numericQty: n.numericQty || 1,
                unit: n.unit || 'unit',
                estimatedUnitPrice: n.estimatedUnitPrice || 4.99,
                estimatedTotalPrice: n.estimatedTotalPrice || 4.99,
                priority: n.priority || 'recommended',
                purchased: false,
                storeCategory: n.storeCategory || 'grocery',
                aisle: n.aisle || 'General Aisle',
                buyingTip: n.buyingTip || 'CymbalMart Assistant voice recommendation.',
              }));
              updatedList = [...formattedNew, ...updatedList];
            }
            onUpdatePlan({ ...activePlan, items: updatedList });
          }

          speakResponse(replyText);
        } else {
          speakResponse(`CymbalMart Assistant heard: "${rawText}". You can say "Check off [item]", "Add [item]", or "Read my list".`);
        }
      } catch (err) {
        speakResponse(`Heard: "${rawText}". Say "Help" for list of hands-free commands.`);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      activePlan,
      plans,
      onUpdatePlan,
      onSelectPlan,
      onNavigateTab,
      onToggleShopMode,
      shopMode,
      onOpenWizard,
      onOpenRecipes,
      onOpenChat,
      speakResponse,
    ]
  );

  // Initialize Speech Recognition instance
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = continuousMode;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            const finalText = event.results[i][0].transcript;
            setTranscript(finalText);
            processVoiceCommand(finalText);
          }
        }
        if (currentTranscript && !event.results[event.results.length - 1].isFinal) {
          setTranscript(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setIsListening(false);
          isListeningRef.current = false;
          setLastFeedback('Microphone access was denied. Please allow microphone permissions in your browser.');
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && continuousMode) {
          try {
            recognition.start();
          } catch (e) {
            setIsListening(false);
            isListeningRef.current = false;
          }
        } else {
          setIsListening(false);
          isListeningRef.current = false;
        }
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.error('Speech recognition initialization failed:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [continuousMode, processVoiceCommand]);

  // Start / Stop listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      // If browser doesn't support Web Speech, prompt
      if (!isSupported) {
        speakResponse('Speech recognition is not natively supported in this browser environment. You can test commands below using 1-click triggers!');
        return;
      }
      return;
    }

    if (isListening) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
      setLastFeedback('Voice control paused.');
    } else {
      try {
        isListeningRef.current = true;
        recognitionRef.current.start();
        setIsListening(true);
        setLastFeedback('Listening... Speak any party command or ask a question.');
      } catch (err) {
        console.warn('Failed to start recognition:', err);
      }
    }
  };

  const handleTestCommand = (cmdText: string) => {
    setTranscript(cmdText);
    processVoiceCommand(cmdText);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-md w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-slate-950 text-white rounded-2xl shadow-2xl border border-slate-800 overflow-hidden ring-1 ring-white/10 backdrop-blur-xl">
        {/* Top Header */}
        <div className="p-3.5 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white transition-all ${
                  isListening
                    ? 'bg-rose-500 shadow-md shadow-rose-500/50 animate-pulse'
                    : 'bg-amber-500/80'
                }`}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </div>
              {isListening && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-wide uppercase text-amber-400">
                  Hands-Free Voice Control
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {isListening ? 'Live Listening' : 'Standby'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Control shopping, budget & aisle checks hands-free
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)}
              className={`p-1.5 rounded-lg border transition-colors ${
                voiceFeedbackEnabled
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-slate-500 bg-slate-900 border-slate-800'
              }`}
              title={voiceFeedbackEnabled ? 'Audio Speech Feedback Enabled' : 'Audio Muted'}
            >
              {voiceFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer & Waveform */}
        <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {audioLevel.map((height, idx) => (
              <div
                key={idx}
                className={`w-1.5 rounded-full transition-all duration-100 ${
                  isListening ? 'bg-gradient-to-t from-amber-500 to-rose-400' : 'bg-slate-700'
                }`}
                style={{ height: `${isListening ? Math.max(6, height / 3) : 6}px` }}
              />
            ))}
            <span className="text-[11px] font-mono text-slate-400 ml-2 truncate max-w-[210px]">
              {transcript ? `"${transcript}"` : isListening ? 'Listening for command...' : 'Microphone idle'}
            </span>
          </div>

          {/* Toggle Listening Mic Button */}
          <button
            onClick={toggleListening}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-1 ring-emerald-400/50'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Start Mic</span>
              </>
            )}
          </button>
        </div>

        {/* Feedback / Speech Caption Card */}
        <div className="p-3.5 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CymbalMart Voice Response</span>
              {isProcessing && <RefreshCw className="w-3 h-3 text-amber-400 animate-spin ml-auto" />}
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              {lastFeedback}
            </p>
          </div>

          {/* Hands-Free Settings Pill */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-300">
              <input
                type="checkbox"
                checked={continuousMode}
                onChange={(e) => setContinuousMode(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/30 bg-slate-900"
              />
              <span>Continuous Walk-Through Mode</span>
            </label>

            <button
              onClick={() => setExpandedCheatSheet(!expandedCheatSheet)}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
            >
              <span>{expandedCheatSheet ? 'Hide Commands' : 'Voice Command Cheat Sheet'}</span>
              {expandedCheatSheet ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Quick Voice Command Triggers / Cheat Sheet */}
          {expandedCheatSheet && (
            <div className="pt-2 border-t border-slate-800/80 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Tap or Speak These Commands:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  { text: 'Check off ice', desc: 'Marks bagged ice bought' },
                  { text: 'Add 2 bags of ice', desc: 'Adds items to freezer aisle' },
                  { text: 'Read my list', desc: 'Speaks remaining items' },
                  { text: 'What is my total?', desc: 'Audits current budget' },
                  { text: 'Start shopping mode', desc: 'Launches in-store UI' },
                  { text: 'Show budget', desc: 'Switches to analytics' },
                  { text: 'Set budget to $250', desc: 'Updates target budget' },
                  { text: 'Show cocktail recipes', desc: 'Opens batch cocktails' },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleTestCommand(item.text)}
                    className="p-2 rounded-lg bg-slate-900/80 hover:bg-amber-950/40 border border-slate-800 hover:border-amber-500/40 text-left transition-all text-[11px] group"
                  >
                    <div className="font-bold text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
                      <span>"{item.text}"</span>
                      <Play className="w-2.5 h-2.5 text-slate-500 group-hover:text-amber-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
