import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Share2,
  Download,
  Copy,
  Printer,
  ChevronDown,
  CheckCircle2,
  Layers,
  Store,
  DollarSign,
  FileText,
  Mic,
  Radio
} from 'lucide-react';
import { PartyPlan } from '../types';
import { exportShoppingListAsText, exportShoppingListAsCSV } from '../utils/storage';

interface HeaderProps {
  plans: PartyPlan[];
  activePlan: PartyPlan;
  onSelectPlan: (id: string) => void;
  onOpenNewModal: () => void;
  shopMode: boolean;
  onToggleShopMode: () => void;
  isVoiceOpen: boolean;
  onToggleVoice: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  plans,
  activePlan,
  onSelectPlan,
  onOpenNewModal,
  shopMode,
  onToggleShopMode,
  isVoiceOpen,
  onToggleVoice,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const purchasedCount = activePlan.items.filter((i) => i.purchased).length;
  const totalCount = activePlan.items.length;
  const percentPurchased = totalCount > 0 ? Math.round((purchasedCount / totalCount) * 100) : 0;

  const budget = activePlan.brief.budget;
  const estimated = activePlan.budgetSummary.estimatedTotal;
  const isOverBudget = estimated > budget;

  const handleCopyChecklist = () => {
    const text = exportShoppingListAsText(activePlan);
    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
    setShowExportMenu(false);
  };

  const handleDownloadCSV = () => {
    const csv = exportShoppingListAsCSV(activePlan);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activePlan.brief.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_shopping_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand & Active Party Selector */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-100">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                  CymbalMart <span className="text-amber-600 font-bold text-xs uppercase px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">Planner</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium">Smart AI Grocery & Party Concierge</p>
              </div>
            </div>

            {/* Plan Switcher Dropdown */}
            <div className="relative">
              <button
                id="party-selector-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 text-left rounded-lg bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-all text-sm font-semibold text-slate-800 max-w-[200px] sm:max-w-[260px] truncate"
              >
                <Layers className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="truncate">{activePlan.brief.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-auto" />
              </button>

              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute left-0 mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-2 divide-y divide-slate-100">
                    <div className="px-3 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Saved Party Blueprints
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {plans.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectPlan(p.id);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-sm flex items-center justify-between hover:bg-amber-50/80 transition-colors ${
                            p.id === activePlan.id ? 'bg-amber-50 font-bold text-amber-900' : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate text-sm font-medium">{p.brief.name}</p>
                            <p className="text-xs text-slate-400 font-normal">
                              {p.brief.adultCount + p.brief.kidCount} guests · ${p.brief.budget} budget
                            </p>
                          </div>
                          {p.id === activePlan.id && (
                            <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          onOpenNewModal();
                        }}
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Party Plan
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Budget status chip */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span>
                Est: <strong className={isOverBudget ? 'text-rose-600' : 'text-slate-900'}>${estimated.toFixed(0)}</strong> / ${budget}
              </span>
              <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (estimated / (budget || 1)) * 100)}%` }}
                />
              </div>
            </div>

            {/* Shopping progress badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-xs font-semibold text-amber-800">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {purchasedCount}/{totalCount} Items ({percentPurchased}%)
              </span>
            </div>

            {/* Shop Mode Toggle */}
            <button
              id="shop-mode-toggle"
              onClick={onToggleShopMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                shopMode
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
              title="Toggle In-Store Shopping Mode"
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{shopMode ? 'Exit Shop Mode' : 'In-Store Mode'}</span>
            </button>

            {/* Voice Control Hands-Free Toggle */}
            <button
              id="voice-control-toggle-btn"
              onClick={onToggleVoice}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                isVoiceOpen
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300 animate-pulse'
                  : 'bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border-slate-200 hover:border-amber-300'
              }`}
              title="Toggle Hands-Free Voice Control"
            >
              <Mic className={`w-3.5 h-3.5 ${isVoiceOpen ? 'text-white' : 'text-rose-600'}`} />
              <span className="hidden sm:inline">Voice Control</span>
              {isVoiceOpen && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button
                id="export-menu-btn"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                title="Export or Print List"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-1.5 w-56 rounded-xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 text-sm">
                    <button
                      onClick={handleCopyChecklist}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 text-xs font-medium"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                      Copy Aisle Checklist
                    </button>
                    <button
                      onClick={handleDownloadCSV}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 text-xs font-medium"
                    >
                      <Download className="w-4 h-4 text-slate-400" />
                      Download Spreadsheet (CSV)
                    </button>
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 text-xs font-medium"
                    >
                      <Printer className="w-4 h-4 text-slate-400" />
                      Print Shopping Sheet
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* New Plan Button */}
            <button
              id="new-party-btn"
              onClick={onOpenNewModal}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Plan Party with AI</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Shopping list copied to clipboard formatted by store aisle!
        </div>
      )}
    </header>
  );
};
