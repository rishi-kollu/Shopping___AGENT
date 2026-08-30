import React, { useState } from 'react';
import {
  Sparkles,
  Wine,
  Utensils,
  Clock,
  DollarSign,
  X,
  Copy,
  CheckCircle2,
  ChefHat,
  Share2
} from 'lucide-react';
import { PartyPlan, RecipeCard } from '../types';

interface SignatureRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PartyPlan;
}

export const SignatureRecipesModal: React.FC<SignatureRecipesModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const [activeTab, setActiveTab] = useState<'cocktail' | 'platter' | 'dessert'>('cocktail');
  const [loading, setLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState<RecipeCard | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerateRecipe = async (type: 'cocktail' | 'platter' | 'dessert') => {
    setLoading(true);
    setActiveTab(type);

    const ingredientNames = plan.items
      .filter((i) => i.category === 'food' || i.category === 'beverages')
      .map((i) => i.name)
      .slice(0, 10);

    try {
      const res = await fetch('/api/gemini/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Signature Party ${type.charAt(0).toUpperCase() + type.slice(1)} for ${plan.brief.name}`,
          type,
          guests: plan.brief.adultCount + plan.brief.kidCount,
          budget: plan.brief.budget,
          theme: plan.brief.theme || plan.brief.eventType,
          ingredients: ingredientNames,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecipeResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!recipeResult) return;
    const text = `🍽️ ${recipeResult.title}\nYield: ${recipeResult.yield} | Prep: ${recipeResult.prepTime}\n\nIngredients:\n${recipeResult.ingredients.map((i) => `• ${i}`).join('\n')}\n\nInstructions:\n${recipeResult.instructions.map((ins, idx) => `${idx + 1}. ${ins}`).join('\n')}\n\n💡 Host Pro Tip:\n${recipeResult.hostProTip}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-rose-500 to-orange-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Party Recipe & Batch Drink Formulation</h3>
              <p className="text-xs text-amber-100">
                Custom recipes optimized from the ingredients in your shopping cart
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-3 gap-2">
          <button
            onClick={() => handleGenerateRecipe('cocktail')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'cocktail'
                ? 'border-amber-500 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Wine className="w-3.5 h-3.5 text-amber-600" />
            Batch Signature Punch / Cocktail
          </button>
          <button
            onClick={() => handleGenerateRecipe('platter')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'platter'
                ? 'border-amber-500 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            Crowd-Pleasing Platter
          </button>
          <button
            onClick={() => handleGenerateRecipe('dessert')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'dessert'
                ? 'border-amber-500 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Quick Dessert Hack
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grow space-y-5">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Formulating batch recipe for {plan.brief.adultCount + plan.brief.kidCount} guests...
              </p>
              <p className="text-xs text-slate-500">
                Balancing flavors and portion scaling based on your shopping list
              </p>
            </div>
          ) : recipeResult ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">
                    {recipeResult.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600 mt-1">
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      👥 {recipeResult.yield}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-100">
                      ⏳ {recipeResult.prepTime}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                      Est. {recipeResult.costEstimate}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Recipe'}
                </button>
              </div>

              {/* Ingredients */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Batch Ingredients:
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                  {recipeResult.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Easy Prep Steps:
                </h5>
                <ol className="space-y-2 text-xs text-slate-700">
                  {recipeResult.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Pro Tip */}
              {recipeResult.hostProTip && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Host Pro Tip: </strong>
                    <span>{recipeResult.hostProTip}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl">
                🍹
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Generate Instant Signature Recipes
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click below to formulate a signature batch drink, grazing platter, or dessert scaled precisely for {plan.brief.adultCount + plan.brief.kidCount} guests.
                </p>
              </div>
              <button
                onClick={() => handleGenerateRecipe('cocktail')}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md shadow-amber-500/20"
              >
                Generate Signature Batch Drink
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
