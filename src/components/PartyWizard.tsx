import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Users,
  DollarSign,
  Clock,
  Wine,
  Utensils,
  MapPin,
  Flame,
  Check,
  AlertCircle,
  HelpCircle,
  Wand2
} from 'lucide-react';
import { PartyBrief, PartyPlan, EventType, PartyVibe, VenueType } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';
import confetti from 'canvas-confetti';

interface PartyWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: PartyPlan) => void;
}

const EVENT_TYPES: { id: EventType; label: string; icon: string }[] = [
  { id: 'birthday', label: 'Birthday Bash', icon: '🎂' },
  { id: 'dinner', label: 'Dinner Party', icon: '🍷' },
  { id: 'bbq', label: 'Backyard BBQ', icon: '🍖' },
  { id: 'cocktail', label: 'Cocktail Soirée', icon: '🍸' },
  { id: 'kids', label: 'Kids Party', icon: '🎈' },
  { id: 'game_night', label: 'Game Night', icon: '🎲' },
  { id: 'pool_party', label: 'Pool / Summer', icon: '🌊' },
  { id: 'holiday', label: 'Holiday Party', icon: '✨' },
  { id: 'custom', label: 'Custom Event', icon: '🎉' },
];

const VIBES: { id: PartyVibe; label: string; desc: string }[] = [
  { id: 'casual', label: 'Casual & Relaxed', desc: 'Low fuss, self-serve platters & drinks' },
  { id: 'luxe', label: 'Upscale / Luxe', desc: 'Premium ingredients, curated aesthetics' },
  { id: 'budget_friendly', label: 'Budget-Smart', desc: 'Maximizes portion volume per dollar' },
  { id: 'quick_prep', label: 'Quick Prep (Low Effort)', desc: 'Pre-made & easy assemble items' },
  { id: 'high_energy', label: 'High Energy', desc: 'Active games, finger foods, punch' },
];

const VENUES: { id: VenueType; label: string }[] = [
  { id: 'home_indoor', label: 'Home Living / Kitchen' },
  { id: 'backyard', label: 'Backyard / Patio' },
  { id: 'park_outdoor', label: 'Park / Outdoor (No Power)' },
  { id: 'pool', label: 'Poolside' },
  { id: 'event_hall', label: 'Rented Venue / Hall' },
  { id: 'rooftop', label: 'Rooftop Lounge' },
];

const DIETARY_OPTIONS = [
  'Vegetarian Option',
  'Vegan Option',
  'Gluten-Free',
  'Nut-Free (Strict)',
  'Dairy-Free',
  'Halal',
  'Kosher',
  'Kid-Friendly',
];

export const PartyWizard: React.FC<PartyWizardProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [mode, setMode] = useState<'custom' | 'templates'>('custom');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [eventType, setEventType] = useState<EventType>('birthday');
  const [theme, setTheme] = useState('');
  const [adultCount, setAdultCount] = useState(12);
  const [kidCount, setKidCount] = useState(0);
  const [drinkersCount, setDrinkersCount] = useState(10);
  const [durationHours, setDurationHours] = useState(3.5);
  const [budget, setBudget] = useState(250);
  const [currency, setCurrency] = useState('$');
  const [dietary, setDietary] = useState<string[]>(['Vegetarian Option']);
  const [vibe, setVibe] = useState<PartyVibe>('casual');
  const [venueType, setVenueType] = useState<VenueType>('home_indoor');
  const [prepTimeAvailable, setPrepTimeAvailable] = useState<'low' | 'medium' | 'high'>('medium');
  const [specialRequests, setSpecialRequests] = useState('');

  if (!isOpen) return null;

  const toggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((d) => d !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  const handleSelectTemplate = (template: typeof STARTER_TEMPLATES[0]) => {
    const newPlan: PartyPlan = {
      ...template.plan,
      id: `plan-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onPlanCreated(newPlan);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (_) {}
    onClose();
  };

  const handleSubmitCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLoadingStep('Analyzing guest counts and portion algorithms...');

    const brief: PartyBrief = {
      id: `brief-${Date.now()}`,
      name: name.trim() || `${eventType.charAt(0).toUpperCase() + eventType.slice(1)} Celebration`,
      eventType,
      theme: theme.trim() || `${vibe} ${eventType}`,
      adultCount,
      kidCount,
      drinkersCount: Math.min(drinkersCount, adultCount),
      durationHours,
      budget: Number(budget) || 200,
      currency: currency || '$',
      dietaryRestrictions: dietary,
      vibe,
      venueType,
      prepTimeAvailable,
      specialRequests: specialRequests.trim(),
    };

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('Calculating protein oz, drink servings & 25% tableware buffers...');
    }, 1200);

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('Organizing shopping aisles across grocery, wholesale & party stores...');
    }, 2800);

    try {
      const res = await fetch('/api/gemini/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      });

      if (!res.ok) {
        throw new Error('Server returned error');
      }

      const generatedPlanData = await res.json();

      const completePlan: PartyPlan = {
        id: `plan-${Date.now()}`,
        brief,
        tagline: generatedPlanData.tagline || `${brief.name} – Designed with Smart Logistics`,
        overview: generatedPlanData.overview || `A tailored ${brief.eventType} plan for ${adultCount + kidCount} guests.`,
        items: generatedPlanData.items || [],
        portionBreakdown: generatedPlanData.portionBreakdown || {
          foodCalculation: {
            label: 'Portion Breakdown',
            formula: 'Standard portion formula',
            recommendedTotal: 'Sufficient food for all guests',
            breakdown: ['6 oz protein per adult', 'Snacks for children'],
          },
          drinkCalculation: {
            totalDrinksNeeded: Math.round((adultCount + kidCount) * durationHours * 1.2),
            alcoholicDrinks: Math.round(drinkersCount * durationHours * 1.2),
            nonAlcoholicDrinks: Math.round((adultCount - drinkersCount + kidCount) * durationHours * 1.0),
            iceBagsLbs: Math.max(15, (adultCount + kidCount) * 1.5),
            breakdown: ['1.5 drinks/hr for drinkers', '1 drink/hr non-alcoholic'],
          },
          tablewareBufferMultiplier: 1.25,
        },
        budgetSummary: generatedPlanData.budgetSummary || {
          targetBudget: brief.budget,
          estimatedTotal: 0,
          purchasedTotal: 0,
          categoryTotals: {},
          savingsOpportunities: [],
        },
        timeline: generatedPlanData.timeline || [],
        signatureIdeas: generatedPlanData.signatureIdeas || [],
        agentAdvice: generatedPlanData.agentAdvice || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      onPlanCreated(completePlan);
      try {
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (_) {}
      onClose();
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Party Planner AI Agent</h2>
              <p className="text-xs text-amber-100">Set your event specs & get mathematically accurate shopping lists</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Custom Brief vs Quick Starter */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => setMode('custom')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'custom'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            Custom AI Party Generator
          </button>
          <button
            type="button"
            onClick={() => setMode('templates')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              mode === 'templates'
                ? 'border-amber-600 text-amber-900 bg-white rounded-t-lg shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            Ready-Made Starter Blueprints
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grow space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'templates' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Choose a pre-configured party blueprint with tested recipes, calibrated food portion formulas, and aisle-by-aisle shopping lists:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STARTER_TEMPLATES.map((t) => (
                  <div
                    key={t.brief.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => handleSelectTemplate(t)}
                  >
                    <div>
                      <span className="text-2xl mb-2 block">
                        {t.brief.eventType === 'kids' ? '🎈' : t.brief.eventType === 'cocktail' ? '🍷' : '🌮'}
                      </span>
                      <h3 className="font-bold text-slate-900 group-hover:text-amber-600 text-sm mb-1">
                        {t.brief.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {t.plan.overview}
                      </p>
                      <div className="flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600">
                        <span className="px-2 py-0.5 rounded bg-slate-100">
                          👥 {t.brief.adultCount + t.brief.kidCount} guests
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                          ${t.brief.budget} budget
                        </span>
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700">
                          ⏳ {t.brief.durationHours}h
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-4 w-full py-1.5 px-3 rounded-lg bg-slate-100 group-hover:bg-amber-500 group-hover:text-white text-slate-800 text-xs font-bold transition-all text-center"
                    >
                      Use This Blueprint
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitCustom} className="space-y-5">
              {/* Event Type Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Event Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {EVENT_TYPES.map((et) => (
                    <button
                      key={et.id}
                      type="button"
                      onClick={() => setEventType(et.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        eventType === et.id
                          ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-2xs ring-1 ring-amber-400'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-lg">{et.icon}</span>
                      <span className="text-xs truncate w-full">{et.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Party Name / Occasion
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Maya's 30th Birthday Soirée"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Theme / Aesthetic (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 90s Neon Arcade, Italian Trattoria, Boho Chic"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Guest Counts & Duration (Portion Math Engine Inputs) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    2. Guest Counts & Duration (Portion Calculators)
                  </span>
                  <span className="text-xs text-amber-700 font-bold bg-amber-100/70 px-2 py-0.5 rounded-full">
                    Total: {adultCount + kidCount} Guests
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Adults */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Adults</span>
                      <span className="font-bold text-slate-900">{adultCount}</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={50}
                      value={adultCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setAdultCount(val);
                        if (drinkersCount > val) setDrinkersCount(val);
                      }}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Kids */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Kids (under 12)</span>
                      <span className="font-bold text-slate-900">{kidCount}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={kidCount}
                      onChange={(e) => setKidCount(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Alcohol Drinkers */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span className="flex items-center gap-1">
                        <Wine className="w-3 h-3 text-amber-600" /> Alcohol Drinkers
                      </span>
                      <span className="font-bold text-slate-900">{drinkersCount}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={adultCount}
                      value={drinkersCount}
                      onChange={(e) => setDrinkersCount(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/80">
                  {/* Duration */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> Duration (Hours)
                      </span>
                      <span className="font-bold text-slate-900">{durationHours} hrs</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={8}
                      step={0.5}
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Budget Target
                      </span>
                      <span className="font-bold text-emerald-700">${budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={20}
                        max={5000}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-sm font-bold text-slate-900"
                      />
                      <div className="flex gap-1">
                        {[150, 300, 600].map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setBudget(b)}
                            className="px-2 py-1 text-[11px] font-semibold bg-white border border-slate-200 rounded hover:bg-slate-100"
                          >
                            ${b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vibe & Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Party Vibe & Style
                  </label>
                  <div className="space-y-1.5">
                    {VIBES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setVibe(v.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl border text-xs transition-all flex items-center justify-between ${
                          vibe === v.id
                            ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{v.label}</p>
                          <p className="text-[11px] text-slate-400 font-normal">{v.desc}</p>
                        </div>
                        {vibe === v.id && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Venue & Environment
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {VENUES.map((ven) => (
                      <button
                        key={ven.id}
                        type="button"
                        onClick={() => setVenueType(ven.id)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          venueType === ven.id
                            ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="truncate">{ven.label}</span>
                        {venueType === ven.id && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Host Prep Time
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['low', 'medium', 'high'] as const).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setPrepTimeAvailable(lvl)}
                          className={`py-1.5 px-2 rounded-lg border text-center text-xs font-medium capitalize ${
                            prepTimeAvailable === lvl
                              ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {lvl === 'low' ? '⚡ Low (<30m)' : lvl === 'medium' ? '🍲 Medium (1-2h)' : '👩‍🍳 High DIY'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dietary Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Dietary Considerations & Inclusions
                </label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map((item) => {
                    const isSelected = dietary.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleDietary(item)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-amber-700" />}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Host Wishes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please include a signature mocktail punch bowl, eco-friendly palm leaf plates, and 2 party icebreaker games."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? 'Designing Your Party Blueprint...' : 'Generate AI Party Plan & Shopping Cart'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-orange-400 flex items-center justify-center text-white shadow-xl shadow-amber-500/30 animate-bounce mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              AI Party Shopping Agent Working
            </h3>
            <p className="text-sm text-amber-700 font-medium max-w-md animate-pulse">
              {loadingStep || 'Designing your optimized shopping route and portion calculations...'}
            </p>
            <div className="mt-4 w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 animate-pulse rounded-full w-3/4" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
