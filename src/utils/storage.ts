import { PartyPlan, ShoppingItem } from '../types';
import { STARTER_TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'party_planner_shopping_agent_plans';
const ACTIVE_PLAN_ID_KEY = 'party_planner_active_plan_id';

export function loadAllPlans(): PartyPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load plans from storage', e);
  }

  // Default starter templates
  const initial = STARTER_TEMPLATES.map((t) => t.plan);
  saveAllPlans(initial);
  return initial;
}

export function saveAllPlans(plans: PartyPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save plans to storage', e);
  }
}

export function getActivePlanId(): string {
  try {
    const id = localStorage.getItem(ACTIVE_PLAN_ID_KEY);
    if (id) return id;
  } catch (e) {
    // ignore
  }
  return STARTER_TEMPLATES[0].plan.id;
}

export function setActivePlanId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PLAN_ID_KEY, id);
  } catch (e) {
    // ignore
  }
}

export function recalculatePlanBudget(plan: PartyPlan): PartyPlan {
  let estimatedTotal = 0;
  let purchasedTotal = 0;
  const categoryTotals: Record<string, number> = {};

  plan.items.forEach((item) => {
    const total = item.estimatedTotalPrice || item.numericQty * item.estimatedUnitPrice;
    estimatedTotal += total;
    if (item.purchased) {
      purchasedTotal += total;
    }
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + total;
  });

  return {
    ...plan,
    budgetSummary: {
      ...plan.budgetSummary,
      estimatedTotal: Math.round(estimatedTotal * 100) / 100,
      purchasedTotal: Math.round(purchasedTotal * 100) / 100,
      categoryTotals,
    },
    updatedAt: new Date().toISOString(),
  };
}

export function exportShoppingListAsText(plan: PartyPlan): string {
  let text = `=================================================\n`;
  text += `🎉 ${plan.brief.name.toUpperCase()}\n`;
  text += `📋 Shopping Checklist & Aisle Route\n`;
  text += `👥 Guests: ${plan.brief.adultCount} adults, ${plan.brief.kidCount} kids | Budget: $${plan.brief.budget}\n`;
  text += `=================================================\n\n`;

  // Group by store category
  const storeGroups: Record<string, ShoppingItem[]> = {};
  plan.items.forEach((item) => {
    const store = item.storeCategory || 'grocery';
    if (!storeGroups[store]) storeGroups[store] = [];
    storeGroups[store].push(item);
  });

  const storeLabels: Record<string, string> = {
    grocery: '🛒 Supermarket / Grocery Store',
    wholesale_bulk: '📦 Wholesale / Bulk Club (Costco/Sam\'s)',
    liquor_store: '🍾 Beverage & Liquor Store',
    party_store: '🎈 Party Supply Store',
    specialty_amazon: '📦 Online / Specialty Store',
    bakery_local: '🥐 Local Bakery / Counter',
  };

  Object.entries(storeGroups).forEach(([store, items]) => {
    text += `### ${storeLabels[store] || store.toUpperCase()}\n`;
    items.forEach((item) => {
      const check = item.purchased ? '[x]' : '[ ]';
      text += `${check} ${item.name} (${item.quantity}) - ~$${item.estimatedTotalPrice.toFixed(2)}`;
      if (item.aisle) text += ` [Aisle: ${item.aisle}]`;
      if (item.buyingTip) text += `\n    💡 Tip: ${item.buyingTip}`;
      text += `\n`;
    });
    text += `\n`;
  });

  text += `=================================================\n`;
  text += `💰 Estimated Total: $${plan.budgetSummary.estimatedTotal.toFixed(2)} / Budget: $${plan.brief.budget}\n`;
  text += `🧊 Ice Needed: ${plan.portionBreakdown.drinkCalculation.iceBagsLbs} lbs\n`;
  text += `🍹 Total Drinks: ~${plan.portionBreakdown.drinkCalculation.totalDrinksNeeded} servings\n`;
  text += `=================================================\n`;

  return text;
}

export function exportShoppingListAsCSV(plan: PartyPlan): string {
  const headers = [
    'Item Name',
    'Category',
    'Store',
    'Aisle',
    'Quantity',
    'Unit Price',
    'Total Price',
    'Priority',
    'Purchased',
    'Dietary Tags',
    'Host Tip',
  ];

  const rows = plan.items.map((item) => [
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    `"${item.storeCategory}"`,
    `"${item.aisle || ''}"`,
    `"${item.quantity}"`,
    item.estimatedUnitPrice.toFixed(2),
    item.estimatedTotalPrice.toFixed(2),
    `"${item.priority}"`,
    item.purchased ? 'YES' : 'NO',
    `"${(item.dietaryTags || []).join(', ')}"`,
    `"${(item.buyingTip || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
