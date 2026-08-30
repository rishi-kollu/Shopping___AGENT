import React from 'react';
import {
  DollarSign,
  TrendingDown,
  Sparkles,
  PieChart,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PartyPlan, ItemCategory } from '../types';

interface BudgetAnalyticsViewProps {
  plan: PartyPlan;
  onUpdatePlan: (updated: PartyPlan) => void;
}

const CATEGORY_NAMES: Record<ItemCategory, { name: string; color: string; barColor: string }> = {
  food: { name: 'Food & Catering', color: 'text-amber-700 bg-amber-50 border-amber-200', barColor: 'bg-amber-500' },
  beverages: { name: 'Beverages & Bar', color: 'text-blue-700 bg-blue-50 border-blue-200', barColor: 'bg-blue-500' },
  decor: { name: 'Decor & Ambiance', color: 'text-pink-700 bg-pink-50 border-pink-200', barColor: 'bg-pink-500' },
  tableware: { name: 'Tableware & Paper', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', barColor: 'bg-emerald-500' },
  activities_favors: { name: 'Activities & Favors', color: 'text-purple-700 bg-purple-50 border-purple-200', barColor: 'bg-purple-500' },
  prep_supplies: { name: 'Supplies & Cleanup', color: 'text-slate-700 bg-slate-50 border-slate-200', barColor: 'bg-slate-500' },
};

export const BudgetAnalyticsView: React.FC<BudgetAnalyticsViewProps> = ({ plan }) => {
  const budget = plan.brief.budget || 200;
  const estimated = plan.budgetSummary.estimatedTotal || 0;
  const purchased = plan.budgetSummary.purchasedTotal || 0;
  const totalGuests = (plan.brief.adultCount + plan.brief.kidCount) || 1;

  const costPerGuest = Math.round((estimated / totalGuests) * 100) / 100;
  const variance = budget - estimated;
  const isUnderBudget = variance >= 0;

  // Category totals
  const categoryTotals = plan.budgetSummary.categoryTotals || {};

  return (
    <div className="space-y-6">
      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Metric 1: Target Budget */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Target Budget</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ${budget.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400">Set by host</div>
        </div>

        {/* Metric 2: Estimated Total */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Estimated Shopping Total</span>
            <TrendingDown className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            ${estimated.toFixed(2)}
          </div>
          <div
            className={`text-[11px] font-bold ${
              isUnderBudget ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {isUnderBudget
              ? `$${variance.toFixed(2)} Under Budget (${Math.round((variance / budget) * 100)}% buffer)`
              : `$${Math.abs(variance).toFixed(2)} Over Budget`}
          </div>
        </div>

        {/* Metric 3: Already Spent */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Purchased So Far</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">
            ${purchased.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            ${(estimated - purchased).toFixed(2)} remaining to buy
          </div>
        </div>

        {/* Metric 4: Cost Per Guest */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Cost Per Guest</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-purple-700 tracking-tight">
            ${costPerGuest.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500">
            Across {totalGuests} guests ({plan.brief.durationHours}h)
          </div>
        </div>
      </div>

      {/* Category Allocation Breakdown */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-amber-600" />
              Category Budget Allocation
            </h3>
            <p className="text-xs text-slate-500">
              Visual share of your budget spent across catering, bar, decor, and activities.
            </p>
          </div>
        </div>

        {/* Stacked Bar */}
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          {(Object.keys(CATEGORY_NAMES) as ItemCategory[]).map((cat) => {
            const amount = categoryTotals[cat] || 0;
            const pct = estimated > 0 ? (amount / estimated) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={cat}
                style={{ width: `${pct}%` }}
                className={`${CATEGORY_NAMES[cat].barColor} h-full transition-all`}
                title={`${CATEGORY_NAMES[cat].name}: $${amount.toFixed(2)} (${Math.round(pct)}%)`}
              />
            );
          })}
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {(Object.keys(CATEGORY_NAMES) as ItemCategory[]).map((cat) => {
            const amount = categoryTotals[cat] || 0;
            const pct = estimated > 0 ? Math.round((amount / estimated) * 100) : 0;
            const meta = CATEGORY_NAMES[cat];

            return (
              <div
                key={cat}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-full ${meta.barColor}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{meta.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{pct}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    ${amount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost-Cutter AI Hacks & Value Optimization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 bg-gradient-to-b from-emerald-50/70 to-white rounded-2xl border border-emerald-200/80 space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            AI Cost-Reduction Opportunities
          </div>

          <div className="space-y-3">
            {(plan.budgetSummary.savingsOpportunities || [
              'Buy canned drinks and paper plates in bulk at Costco or Sam’s Club to save ~25%.',
              'Batch signature cocktails into a 2-gallon glass dispenser rather than individual cans.'
            ]).map((opp, idx) => (
              <div
                key={idx}
                className="p-3 bg-white rounded-xl border border-emerald-200/60 text-xs text-slate-700 flex items-start gap-2 shadow-2xs"
              >
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{opp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gradient-to-b from-amber-50/70 to-white rounded-2xl border border-amber-200/80 space-y-4">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-600" />
            Luxe Upgrades (If Budget Permits)
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-white rounded-xl border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
              <span className="text-amber-500 font-bold shrink-0">✨</span>
              <div>
                <strong>Upgrade to Palm Leaf Tableware (+$12):</strong> Biodegradable palm leaf plates look and feel like rustic pottery while remaining 100% disposable.
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-amber-200/60 text-xs text-slate-700 flex items-start gap-2 shadow-2xs">
              <span className="text-amber-500 font-bold shrink-0">✨</span>
              <div>
                <strong>Botanical Herb Ice Cubes (+$4):</strong> Freeze mint leaves, raspberries, or edible pansies inside silicone ice cube trays for stunning cocktail glasses.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
