import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Scale,
  PieChart,
  Clock,
  Wine,
  Bot,
  Plus,
  Users,
  Store,
  DollarSign,
  ChefHat,
  ChevronRight,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { PartyPlan } from './types';
import {
  loadAllPlans,
  saveAllPlans,
  getActivePlanId,
  setActivePlanId,
  recalculatePlanBudget,
} from './utils/storage';
import { Header } from './components/Header';
import { PartyWizard } from './components/PartyWizard';
import { ShoppingListView } from './components/ShoppingListView';
import { PortionCalculatorView } from './components/PortionCalculatorView';
import { BudgetAnalyticsView } from './components/BudgetAnalyticsView';
import { TimelineRunOfShow } from './components/TimelineRunOfShow';
import { AIAgentChatDrawer } from './components/AIAgentChatDrawer';
import { SignatureRecipesModal } from './components/SignatureRecipesModal';
import { VoiceControlHUD } from './components/VoiceControlHUD';
import { Mic } from 'lucide-react';

export default function App() {
  const [plans, setPlans] = useState<PartyPlan[]>([]);
  const [activePlanId, setActiveId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'shopping' | 'portions' | 'budget' | 'timeline'>('shopping');

  // Modals & Drawers
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [shopMode, setShopMode] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);

  // Initialize plans from storage
  useEffect(() => {
    const loaded = loadAllPlans();
    setPlans(loaded);
    const initialId = getActivePlanId();
    const found = loaded.find((p) => p.id === initialId);
    if (found) {
      setActiveId(found.id);
    } else if (loaded.length > 0) {
      setActiveId(loaded[0].id);
    }
  }, []);

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const handleSelectPlan = (id: string) => {
    setActiveId(id);
    setActivePlanId(id);
  };

  const handleUpdatePlan = (updated: PartyPlan) => {
    const recalculated = recalculatePlanBudget(updated);
    const newPlans = plans.map((p) => (p.id === recalculated.id ? recalculated : p));
    setPlans(newPlans);
    saveAllPlans(newPlans);
  };

  const handlePlanCreated = (newPlan: PartyPlan) => {
    const recalculated = recalculatePlanBudget(newPlan);
    const newPlans = [recalculated, ...plans];
    setPlans(newPlans);
    setActiveId(recalculated.id);
    setActivePlanId(recalculated.id);
    saveAllPlans(newPlans);
  };

  if (!activePlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <Sparkles className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Loading Party Planner Shopping Agent...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header Bar */}
      <Header
        plans={plans}
        activePlan={activePlan}
        onSelectPlan={handleSelectPlan}
        onOpenNewModal={() => setIsWizardOpen(true)}
        shopMode={shopMode}
        onToggleShopMode={() => setShopMode(!shopMode)}
        isVoiceOpen={isVoiceOpen}
        onToggleVoice={() => setIsVoiceOpen(!isVoiceOpen)}
      />

      {/* Main Content Body */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Party Hero Summary Card (Hidden in compact shop mode) */}
        {!shopMode && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
            {/* Ambient decorative glow */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                    {activePlan.brief.eventType}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
                    {activePlan.brief.vibe} vibe
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/15">
                    📍 {activePlan.brief.venueType.replace(/_/g, ' ')}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {activePlan.brief.name}
                </h2>

                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
                  {activePlan.tagline || activePlan.overview}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{activePlan.brief.adultCount + activePlan.brief.kidCount}</strong> Guests ({activePlan.brief.adultCount} adults, {activePlan.brief.kidCount} kids)
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <strong>{activePlan.brief.durationHours}</strong> Hours
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Budget: <strong>${activePlan.brief.budget}</strong>
                  </span>
                </div>
              </div>

              {/* Quick Call to Action Buttons */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Bot className="w-4 h-4" />
                  Chat with Shopping Agent
                </button>
                <button
                  onClick={() => setIsRecipeModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 flex items-center justify-center gap-2 transition-colors"
                >
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  Formulate Batch Recipes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        {!shopMode && (
          <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('shopping')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'shopping'
                  ? 'border-amber-500 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              Shopping Checklist & Aisle Route
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
                {activePlan.items.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('portions')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'portions'
                  ? 'border-amber-500 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-600" />
              Portion & Drink Math Inspector
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'budget'
                  ? 'border-amber-500 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-4 h-4 text-amber-600" />
              Budget Allocation & Savings
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'timeline'
                  ? 'border-amber-500 text-amber-900'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-600" />
              Run-of-Show & Timeline
            </button>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'shopping' || shopMode ? (
          <ShoppingListView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
            shopMode={shopMode}
          />
        ) : activeTab === 'portions' ? (
          <PortionCalculatorView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        ) : activeTab === 'budget' ? (
          <BudgetAnalyticsView
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        ) : (
          <TimelineRunOfShow
            plan={activePlan}
            onUpdatePlan={handleUpdatePlan}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row items-end sm:items-center gap-2.5">
        {/* Floating Voice Control Launcher Button */}
        {!isVoiceOpen && (
          <button
            id="open-voice-control-btn"
            onClick={() => setIsVoiceOpen(true)}
            className="px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-slate-900/50 transition-all hover:scale-105 active:scale-95 group border border-slate-700 hover:border-amber-400"
            title="Open Hands-Free Voice Control"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-xs">
              <Mic className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <span>Hands-Free Voice</span>
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          </button>
        )}

        {/* Floating Chat Button */}
        {!isChatOpen && (
          <button
            id="open-cymbalmart-assistant-btn"
            onClick={() => setIsChatOpen(true)}
            className="px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2.5 shadow-2xl shadow-slate-900/50 transition-all hover:scale-105 active:scale-95 group border border-slate-700"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <span>Chat with CymbalMart Assistant</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}
      </div>

      {/* Voice Control HUD Overlay */}
      <VoiceControlHUD
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        activePlan={activePlan}
        plans={plans}
        onUpdatePlan={handleUpdatePlan}
        onSelectPlan={handleSelectPlan}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onToggleShopMode={() => setShopMode(!shopMode)}
        shopMode={shopMode}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenRecipes={() => setIsRecipeModalOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Party Creation Wizard Modal */}
      <PartyWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* Signature Recipe Modal */}
      <SignatureRecipesModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        plan={activePlan}
      />

      {/* AI Assistant Chat Drawer */}
      <AIAgentChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plan={activePlan}
        onUpdatePlan={handleUpdatePlan}
      />
    </div>
  );
}
