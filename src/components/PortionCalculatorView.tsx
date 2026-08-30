import React, { useState } from 'react';
import {
  Users,
  Wine,
  Clock,
  Flame,
  Info,
  Scale,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { PartyPlan, PortionBreakdown } from '../types';

interface PortionCalculatorViewProps {
  plan: PartyPlan;
  onUpdatePlan: (updated: PartyPlan) => void;
}

export const PortionCalculatorView: React.FC<PortionCalculatorViewProps> = ({
  plan,
  onUpdatePlan,
}) => {
  const [adults, setAdults] = useState(plan.brief.adultCount);
  const [kids, setKids] = useState(plan.brief.kidCount);
  const [drinkers, setDrinkers] = useState(plan.brief.drinkersCount);
  const [hours, setHours] = useState(plan.brief.durationHours);
  const [isScaledApplied, setIsScaledApplied] = useState(false);

  const totalGuests = adults + kids;

  // Real-time calculations based on industry catering rules
  // 1. Protein
  const adultProteinLbs = Math.round(((adults * 7.5) / 16) * 10) / 10; // ~7.5 oz cooked
  const kidProteinLbs = Math.round(((kids * 4.0) / 16) * 10) / 10;
  const totalProteinLbs = Math.round((adultProteinLbs + kidProteinLbs) * 10) / 10;

  // 2. Appetizers
  const appPiecesPerPerson = hours > 3 ? 6 : 4;
  const totalAppetizerPieces = Math.round(totalGuests * appPiecesPerPerson);

  // 3. Drinks
  // First 2 hours = 1.5 drinks/hr, remaining = 1.0 drink/hr
  const first2HrsRate = Math.min(hours, 2) * 1.5;
  const remHrsRate = Math.max(0, hours - 2) * 1.0;
  const adultDrinkerTotal = Math.round(drinkers * (first2HrsRate + remHrsRate));
  const nonAlcoholicTotal = Math.round((adults - drinkers + kids) * hours * 1.25 + drinkers * (hours * 0.5));
  const totalDrinks = adultDrinkerTotal + nonAlcoholicTotal;

  // 4. Ice (1.5 lbs per guest in cool weather, 2 lbs in summer/warm)
  const iceLbs = Math.max(10, Math.round(totalGuests * 1.8));

  // 5. Tableware (Plates, Cups, Napkins with 25-30% buffer)
  const platesNeeded = Math.ceil(totalGuests * 1.35);
  const cupsNeeded = Math.ceil(totalGuests * 2.2);
  const napkinsNeeded = Math.ceil(totalGuests * 3.0);

  const handleApplyScaleToShoppingList = () => {
    const originalTotal = (plan.brief.adultCount + plan.brief.kidCount) || 1;
    const ratio = totalGuests / originalTotal;

    const scaledItems = plan.items.map((item) => {
      // Scale numeric quantity if applicable
      const newNumeric = Math.max(1, Math.round(item.numericQty * ratio * 10) / 10);
      const newTotalPrice = Math.round(newNumeric * item.estimatedUnitPrice * 100) / 100;

      // Update quantity string label
      let newQtyStr = item.quantity;
      if (item.quantity.includes('lbs')) {
        newQtyStr = `${newNumeric} lbs`;
      } else if (item.quantity.includes('packs') || item.quantity.includes('bottles')) {
        newQtyStr = `${Math.ceil(newNumeric)} ${item.unit || 'units'}`;
      }

      return {
        ...item,
        numericQty: newNumeric,
        quantity: newQtyStr,
        estimatedTotalPrice: newTotalPrice,
      };
    });

    const updatedPlan: PartyPlan = {
      ...plan,
      brief: {
        ...plan.brief,
        adultCount: adults,
        kidCount: kids,
        drinkersCount: drinkers,
        durationHours: hours,
      },
      items: scaledItems,
      portionBreakdown: {
        ...plan.portionBreakdown,
        foodCalculation: {
          ...plan.portionBreakdown.foodCalculation,
          recommendedTotal: `${totalProteinLbs} lbs proteins, ${totalAppetizerPieces} appetizers, ${totalGuests * 1.2} desserts`,
        },
        drinkCalculation: {
          totalDrinksNeeded: totalDrinks,
          alcoholicDrinks: adultDrinkerTotal,
          nonAlcoholicDrinks: nonAlcoholicTotal,
          iceBagsLbs: iceLbs,
          breakdown: [
            `${adultDrinkerTotal} alcoholic drinks for ${drinkers} drinkers across ${hours} hrs`,
            `${nonAlcoholicTotal} mocktails, sodas, and waters for all guests`,
            `${iceLbs} lbs ice (${Math.round(iceLbs / 3)} lbs in glasses, ${Math.round((iceLbs * 2) / 3)} lbs in coolers)`
          ],
        },
      },
    };

    onUpdatePlan(updatedPlan);
    setIsScaledApplied(true);
    setTimeout(() => setIsScaledApplied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Interactive Guest Count & Duration Simulator */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              Smart Portion & Beverage Math Inspector
            </h3>
            <p className="text-xs text-slate-500">
              Interactive catering formula engine. Slide guest counts or party length to stress-test your quantities.
            </p>
          </div>

          <button
            onClick={handleApplyScaleToShoppingList}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {isScaledApplied ? 'Applied to Shopping List!' : 'Apply Scale to Shopping List'}
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Adult Guests</span>
              <span className="text-amber-700 font-extrabold">{adults}</span>
            </div>
            <input
              type="range"
              min={1}
              max={60}
              value={adults}
              onChange={(e) => {
                const v = Number(e.target.value);
                setAdults(v);
                if (drinkers > v) setDrinkers(v);
              }}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Kid Guests</span>
              <span className="text-amber-700 font-extrabold">{kids}</span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={kids}
              onChange={(e) => setKids(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Alcohol Drinkers</span>
              <span className="text-amber-700 font-extrabold">{drinkers}</span>
            </div>
            <input
              type="range"
              min={0}
              max={adults}
              value={drinkers}
              onChange={(e) => setDrinkers(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Party Length</span>
              <span className="text-amber-700 font-extrabold">{hours} hrs</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Calculation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Protein & Food Math */}
          <div className="p-5 rounded-xl border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">🥩</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                Protein & Mains
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalProteinLbs} <span className="text-sm font-semibold text-slate-500">lbs raw meat/protein</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Calculated at ~7-8 oz per adult and ~4 oz per kid.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <p>• Adults: ~{adultProteinLbs} lbs</p>
              <p>• Kids: ~{kidProteinLbs} lbs</p>
              <p>• Finger apps: ~{totalAppetizerPieces} total pieces</p>
            </div>
          </div>

          {/* Card 2: Drink & Beverage Math */}
          <div className="p-5 rounded-xl border border-blue-200/80 bg-gradient-to-b from-blue-50/50 to-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">🍹</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-900">
                Drink Servings
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {totalDrinks} <span className="text-sm font-semibold text-slate-500">total drinks</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {adultDrinkerTotal} alcoholic + {nonAlcoholicTotal} non-alcoholic / sodas.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <p>• Beer / Seltzers: ~{Math.ceil(adultDrinkerTotal * 0.6)} cans</p>
              <p>• Wine / Cocktails: ~{Math.ceil((adultDrinkerTotal * 0.4) / 5)} bottles (750ml)</p>
              <p>• Non-Alcoholic / Water: ~{nonAlcoholicTotal} servings</p>
            </div>
          </div>

          {/* Card 3: Ice & Tableware Buffer */}
          <div className="p-5 rounded-xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/50 to-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xl">🧊</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                Ice & Paper Goods
              </span>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {iceLbs} <span className="text-sm font-semibold text-slate-500">lbs of ice ({Math.ceil(iceLbs / 10)} bags)</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Rule: 1.8 lbs per guest (drink ice + cooler chilling).
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
              <p>• Plates: {platesNeeded} ct (includes 35% extra buffer)</p>
              <p>• Cups: {cupsNeeded} ct (drink marking recommended)</p>
              <p>• Napkins: {napkinsNeeded} ct (3 per person)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Host Rules & Food Waste Prevention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Top 4 Host Logistics Rules
          </h4>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">1.</span>
              <span><strong>The 50/50 Ice Separation:</strong> Never use cooler chilling ice in drink glasses. Keep 1 separate clean bag for the bar station.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">2.</span>
              <span><strong>Drink Station Spacing:</strong> Place the bar/drink station at the opposite end of the room from food to avoid bottleneck crowd clustering.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">3.</span>
              <span><strong>Cup Labeling:</strong> Provide metallic Sharpie markers next to cups. Guests will keep 1 cup all night instead of going through 4.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-amber-600">4.</span>
              <span><strong>Batching Signature Punch:</strong> Batch your signature cocktail in a beverage dispenser before guests arrive so you never play bartender all night.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-500" />
            Portion Safety & Leftover Prevention
          </h4>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span><strong>High Volume Veggies:</strong> Bell pepper strips, cucumber rounds, and carrot batons add vibrant platter color for pennies.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span><strong>Hot Holding:</strong> If serving warm sliders or tacos, keep half in the oven warm and replenish the buffet in 2 waves to prevent drying out.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600">•</span>
              <span><strong>Take-Home Containers:</strong> Have foil or leftover takeout boxes ready so guests can take home extra sweets or mains.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
