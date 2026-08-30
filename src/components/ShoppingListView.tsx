import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Tag,
  Store,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  ExternalLink,
  Edit2,
  CheckCircle2,
  Sparkles,
  Minus,
  TrendingUp,
  TrendingDown,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { ShoppingItem, ItemCategory, StoreCategory, ItemPriority, PartyPlan } from '../types';
import confetti from 'canvas-confetti';

interface ShoppingListViewProps {
  plan: PartyPlan;
  onUpdatePlan: (updated: PartyPlan) => void;
  shopMode: boolean;
}

const CATEGORY_META: Record<ItemCategory, { label: string; icon: string; color: string }> = {
  food: { label: 'Food & Catering', icon: '🍽️', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  beverages: { label: 'Beverages & Bar', icon: '🍹', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  decor: { label: 'Decor & Ambiance', icon: '🎈', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  tableware: { label: 'Tableware & Paper Goods', icon: '🍽️', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  activities_favors: { label: 'Activities, Games & Favors', icon: '🎲', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  prep_supplies: { label: 'Prep Supplies & Cleanup', icon: '🛠️', color: 'bg-slate-100 text-slate-800 border-slate-200' },
};

const STORE_META: Record<StoreCategory, { label: string; icon: string }> = {
  grocery: { label: 'Supermarket / Grocery', icon: '🛒' },
  wholesale_bulk: { label: 'Costco / Wholesale Bulk', icon: '📦' },
  liquor_store: { label: 'Beverage / Liquor Store', icon: '🍾' },
  party_store: { label: 'Party Supply Store', icon: '🎈' },
  specialty_amazon: { label: 'Specialty / Amazon', icon: '📦' },
  bakery_local: { label: 'Bakery / Deli Counter', icon: '🥐' },
};

const QUICK_STAPLES = [
  { name: 'Party Bagged Ice (10 lbs)', category: 'beverages' as ItemCategory, store: 'grocery' as StoreCategory, price: 3.49, qty: 2, unit: 'bags', aisle: 'Front Freezers' },
  { name: 'Fresh Lemons & Limes Combo', category: 'food' as ItemCategory, store: 'grocery' as StoreCategory, price: 3.99, qty: 1, unit: 'pack', aisle: 'Produce Aisle 1' },
  { name: 'CymbalMart Sparkling Water 12-Pack', category: 'beverages' as ItemCategory, store: 'grocery' as StoreCategory, price: 4.89, qty: 2, unit: 'packs', aisle: 'Beverages Aisle 4' },
  { name: 'Heavy-Duty Paper Napkins (150ct)', category: 'tableware' as ItemCategory, store: 'grocery' as StoreCategory, price: 3.29, qty: 1, unit: 'pack', aisle: 'Paper Goods Aisle 7' },
  { name: 'Artisan Tortilla Chips & Mild Salsa', category: 'food' as ItemCategory, store: 'grocery' as StoreCategory, price: 5.99, qty: 2, unit: 'sets', aisle: 'Snacks & Deli' },
];

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  plan,
  onUpdatePlan,
  shopMode,
}) => {
  const [groupBy, setGroupBy] = useState<'store' | 'category'>('store');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'remaining' | 'purchased'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null);

  // New Item State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('food');
  const [newItemStore, setNewItemStore] = useState<StoreCategory>('grocery');
  const [newItemQty, setNewItemQty] = useState('1');
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemPrice, setNewItemPrice] = useState('5.00');
  const [newItemAisle, setNewItemAisle] = useState('');
  const [newItemPriority, setNewItemPriority] = useState<ItemPriority>('must_have');

  // Edit Item Form State
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('1');
  const [editUnit, setEditUnit] = useState('units');
  const [editUnitPrice, setEditUnitPrice] = useState('0');
  const [editCategory, setEditCategory] = useState<ItemCategory>('food');
  const [editStore, setEditStore] = useState<StoreCategory>('grocery');
  const [editAisle, setEditAisle] = useState('');
  const [editPriority, setEditPriority] = useState<ItemPriority>('must_have');
  const [editBuyingTip, setEditBuyingTip] = useState('');

  const targetBudget = plan.brief.budget || 200;
  const currentTotal = plan.budgetSummary?.estimatedTotal || 0;
  const currentPurchased = plan.budgetSummary?.purchasedTotal || 0;
  const budgetVariance = targetBudget - currentTotal;
  const isWithinBudget = budgetVariance >= 0;
  const budgetPercent = targetBudget > 0 ? Math.min(100, Math.round((currentTotal / targetBudget) * 100)) : 100;

  const toggleItemPurchased = (itemId: string) => {
    const updatedItems = plan.items.map((item) => {
      if (item.id === itemId) {
        const nextState = !item.purchased;
        if (nextState) {
          try {
            confetti({ particleCount: 15, spread: 45, origin: { y: 0.8 } });
          } catch (_) {}
        }
        return { ...item, purchased: nextState };
      }
      return item;
    });

    onUpdatePlan({ ...plan, items: updatedItems });
  };

  const updateItemQty = (itemId: string, delta: number) => {
    const updatedItems = plan.items.map((item) => {
      if (item.id === itemId) {
        const currentNumeric = item.numericQty || 1;
        const newNumeric = Math.max(1, currentNumeric + delta);
        const unit = item.unit || 'units';
        const unitPrice = item.estimatedUnitPrice || 0;
        const newTotal = Math.round(newNumeric * unitPrice * 100) / 100;

        return {
          ...item,
          numericQty: newNumeric,
          quantity: `${newNumeric} ${unit}`,
          estimatedTotalPrice: newTotal,
        };
      }
      return item;
    });

    onUpdatePlan({ ...plan, items: updatedItems });
  };

  const startEditItem = (item: ShoppingItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQty(item.numericQty?.toString() || '1');
    setEditUnit(item.unit || 'units');
    setEditUnitPrice(item.estimatedUnitPrice?.toString() || '0');
    setEditCategory(item.category);
    setEditStore(item.storeCategory || 'grocery');
    setEditAisle(item.aisle || '');
    setEditPriority(item.priority || 'must_have');
    setEditBuyingTip(item.buyingTip || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editName.trim()) return;

    const numQty = Math.max(1, parseFloat(editQty) || 1);
    const unitPrice = Math.max(0, parseFloat(editUnitPrice) || 0);
    const newTotalPrice = Math.round(numQty * unitPrice * 100) / 100;

    const updatedItems = plan.items.map((item) => {
      if (item.id === editingItem.id) {
        return {
          ...item,
          name: editName.trim(),
          numericQty: numQty,
          unit: editUnit.trim() || 'units',
          quantity: `${numQty} ${editUnit.trim() || 'units'}`,
          estimatedUnitPrice: unitPrice,
          estimatedTotalPrice: newTotalPrice,
          category: editCategory,
          storeCategory: editStore,
          aisle: editAisle.trim() || 'General Aisle',
          priority: editPriority,
          buyingTip: editBuyingTip.trim() || item.buyingTip,
        };
      }
      return item;
    });

    onUpdatePlan({ ...plan, items: updatedItems });
    setEditingItem(null);
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = plan.items.filter((i) => i.id !== itemId);
    onUpdatePlan({ ...plan, items: updatedItems });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const price = parseFloat(newItemPrice) || 0;
    const numQty = parseFloat(newItemQty) || 1;
    const unit = newItemUnit.trim() || 'units';

    const newItem: ShoppingItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      storeCategory: newItemStore,
      quantity: `${numQty} ${unit}`,
      numericQty: numQty,
      unit,
      estimatedUnitPrice: price,
      estimatedTotalPrice: Math.round(price * numQty * 100) / 100,
      priority: newItemPriority,
      purchased: false,
      aisle: newItemAisle.trim() || 'General Aisle',
      buyingTip: 'Custom host item added to shopping checklist.',
    };

    onUpdatePlan({
      ...plan,
      items: [newItem, ...plan.items],
    });

    setNewItemName('');
    setNewItemAisle('');
    setShowAddModal(false);
  };

  const handleAddQuickStaple = (staple: typeof QUICK_STAPLES[0]) => {
    const newItem: ShoppingItem = {
      id: `staple-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: staple.name,
      category: staple.category,
      storeCategory: staple.store,
      quantity: `${staple.qty} ${staple.unit}`,
      numericQty: staple.qty,
      unit: staple.unit,
      estimatedUnitPrice: staple.price,
      estimatedTotalPrice: Math.round(staple.price * staple.qty * 100) / 100,
      priority: 'recommended',
      purchased: false,
      aisle: staple.aisle,
      buyingTip: 'Quick CymbalMart party staple added to checklist.',
    };

    onUpdatePlan({
      ...plan,
      items: [newItem, ...plan.items],
    });
  };

  // Filter items
  const filteredItems = plan.items.filter((item) => {
    if (searchQuery.trim()) {
      const match =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.aisle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.buyingTip?.toLowerCase().includes(searchQuery.toLowerCase());
      if (!match) return false;
    }

    if (filterPriority !== 'all' && item.priority !== filterPriority) {
      return false;
    }

    if (filterStatus === 'remaining' && item.purchased) return false;
    if (filterStatus === 'purchased' && !item.purchased) return false;

    return true;
  });

  // Group items
  const groupedSections: {
    key: string;
    title: string;
    icon: string;
    items: ShoppingItem[];
    subtotal: number;
    purchasedSubtotal: number;
  }[] = [];

  if (groupBy === 'store') {
    const storeKeys = Object.keys(STORE_META) as StoreCategory[];
    storeKeys.forEach((key) => {
      const groupItems = filteredItems.filter((i) => (i.storeCategory || 'grocery') === key);
      if (groupItems.length > 0) {
        const subtotal = groupItems.reduce((acc, i) => acc + i.estimatedTotalPrice, 0);
        const purchasedSubtotal = groupItems
          .filter((i) => i.purchased)
          .reduce((acc, i) => acc + i.estimatedTotalPrice, 0);
        groupedSections.push({
          key,
          title: STORE_META[key]?.label || key,
          icon: STORE_META[key]?.icon || '🛒',
          items: groupItems,
          subtotal,
          purchasedSubtotal,
        });
      }
    });
  } else {
    const catKeys = Object.keys(CATEGORY_META) as ItemCategory[];
    catKeys.forEach((key) => {
      const groupItems = filteredItems.filter((i) => i.category === key);
      if (groupItems.length > 0) {
        const subtotal = groupItems.reduce((acc, i) => acc + i.estimatedTotalPrice, 0);
        const purchasedSubtotal = groupItems
          .filter((i) => i.purchased)
          .reduce((acc, i) => acc + i.estimatedTotalPrice, 0);
        groupedSections.push({
          key,
          title: CATEGORY_META[key]?.label || key,
          icon: CATEGORY_META[key]?.icon || '📋',
          items: groupItems,
          subtotal,
          purchasedSubtotal,
        });
      }
    });
  }

  const totalFilteredSum = filteredItems.reduce((acc, i) => acc + i.estimatedTotalPrice, 0);
  const totalPurchasedSum = filteredItems.filter((i) => i.purchased).reduce((acc, i) => acc + i.estimatedTotalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Live Budget & Cart Recalculation Bar */}
      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl text-white shrink-0 ${isWithinBudget ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Live Cart & Budget Balance
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  <RefreshCw className="w-3 h-3 text-amber-500 animate-spin-reverse" />
                  Auto-Recalculating
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Updating any item quantity, price, or custom product automatically syncs all budget totals.
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[11px] font-medium text-slate-500 block">Est. Shopping Total</span>
              <span className="text-base font-extrabold text-slate-900">${currentTotal.toFixed(2)}</span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right">
              <span className="text-[11px] font-medium text-slate-500 block">Target Budget</span>
              <span className="text-base font-bold text-slate-700">${targetBudget.toFixed(2)}</span>
            </div>
            <div className={`px-3.5 py-2 rounded-xl border text-right ${
              isWithinBudget
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}>
              <span className="text-[11px] font-semibold block">
                {isWithinBudget ? 'Remaining Funds' : 'Over Budget'}
              </span>
              <span className="text-base font-extrabold">
                {isWithinBudget ? `+$${budgetVariance.toFixed(2)}` : `-$${Math.abs(budgetVariance).toFixed(2)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Budget Utilization: {budgetPercent}% of ${targetBudget} budget</span>
            <span>
              {plan.items.length} items ({currentPurchased > 0 ? `$${currentPurchased.toFixed(2)} purchased` : '0 purchased'})
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isWithinBudget
                  ? budgetPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, (currentTotal / (targetBudget || 1)) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Party Staples Bar */}
      {!shopMode && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-50 rounded-2xl border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Quick Add CymbalMart Staples (1-Click)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Adds instantly with real-time recalculation</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_STAPLES.map((staple) => (
              <button
                key={staple.name}
                type="button"
                onClick={() => handleAddQuickStaple(staple)}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>{staple.name}</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded text-[10px]">
                  +${(staple.price * staple.qty).toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Top Controls & Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative grow max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search items, aisles, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Custom Item
            </button>
          </div>
        </div>

        {/* Filters and Groupings */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Grouping toggles */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setGroupBy('store')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                groupBy === 'store'
                  ? 'bg-white text-amber-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              Group by Store Trip
            </button>
            <button
              onClick={() => setGroupBy('category')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all flex items-center gap-1 ${
                groupBy === 'category'
                  ? 'bg-white text-amber-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Group by Category
            </button>
          </div>

          {/* Status and Priority filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status */}
            <div className="flex items-center gap-1">
              {(['all', 'remaining', 'purchased'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize border transition-all ${
                    filterStatus === st
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st === 'remaining' ? 'To Buy' : 'Purchased'}
                </button>
              ))}
            </div>

            {/* Priority */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Priorities</option>
              <option value="must_have">Must-Haves Only</option>
              <option value="recommended">Recommended</option>
              <option value="optional_upgrade">Optional Upgrades</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shopping Trip Route Summary (When grouped by store) */}
      {groupBy === 'store' && !shopMode && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Smart Sourcing Route (Recommended Stops)
              </h4>
              <p className="text-xs text-amber-800">
                Organized to minimize travel: Start with Bulk Clubs for drinks/tableware, hit Grocery for produce, and pick up ice day-of.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 text-xs font-bold text-amber-900 bg-white/80 px-3 py-1.5 rounded-xl border border-amber-200">
            <span>{groupedSections.length} Store Stops</span>
            <span>·</span>
            <span>${totalFilteredSum.toFixed(2)} Total</span>
          </div>
        </div>
      )}

      {/* Item Sections */}
      {groupedSections.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 mb-1">No items match your filter</h3>
          <p className="text-xs text-slate-500 mb-4">
            Try resetting your search query, priority filter, or status toggles.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterPriority('all');
              setFilterStatus('all');
            }}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedSections.map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
            >
              {/* Section Header */}
              <div className="px-5 py-3 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      {section.title}
                      <span className="text-xs font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        {section.items.length} items
                      </span>
                    </h3>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900">
                    ${section.subtotal.toFixed(2)}
                  </span>
                  {section.purchasedSubtotal > 0 && (
                    <span className="text-[11px] text-emerald-600 font-medium block">
                      (${section.purchasedSubtotal.toFixed(2)} bought)
                    </span>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {section.items.map((item) => {
                  const isChecked = item.purchased;

                  return (
                    <div
                      key={item.id}
                      className={`px-4 sm:px-5 py-3.5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
                        isChecked ? 'bg-slate-50/60 opacity-60' : 'hover:bg-amber-50/30'
                      }`}
                    >
                      {/* Checkbox & Item Info */}
                      <div className="flex items-start gap-3 min-w-0 grow">
                        <button
                          type="button"
                          onClick={() => toggleItemPurchased(item.id)}
                          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-600 text-white shadow-2xs'
                              : 'border-slate-300 bg-white hover:border-amber-500 group-hover:ring-2 group-hover:ring-amber-100'
                          }`}
                        >
                          {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 grow">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span
                              className={`text-sm font-semibold tracking-tight ${
                                isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {item.name}
                            </span>

                            {/* Priority Badge */}
                            {item.priority === 'must_have' && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                Must-Have
                              </span>
                            )}
                            {item.priority === 'optional_upgrade' && (
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                                Optional Upgrade
                              </span>
                            )}

                            {/* Dietary Badges */}
                            {item.dietaryTags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Aisle & Specs */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                            {item.aisle && (
                              <span className="font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                                📍 Aisle: {item.aisle}
                              </span>
                            )}
                            <span className="font-medium text-slate-700">
                              Qty: {item.quantity}
                            </span>
                            {item.estimatedUnitPrice > 0 && (
                              <span>(~${item.estimatedUnitPrice.toFixed(2)}/{item.unit || 'ea'})</span>
                            )}
                          </div>

                          {/* Buying Tip / Substitute */}
                          {item.buyingTip && !shopMode && (
                            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-800 bg-amber-50/70 px-2.5 py-1 rounded-lg border border-amber-200/50">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span>{item.buyingTip}</span>
                            </div>
                          )}

                          {item.suggestedSubstitute && !shopMode && (
                            <div className="mt-1 text-[11px] text-slate-500 italic">
                              Alternative option: {item.suggestedSubstitute}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper & Price & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Inline Quantity Steppers (+ / -) */}
                        {!shopMode && (
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.id, -1)}
                              disabled={(item.numericQty || 1) <= 1}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-all"
                              title="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 min-w-[24px] text-center">
                              {item.numericQty || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.id, 1)}
                              className="w-6 h-6 rounded-lg bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shadow-2xs transition-all"
                              title="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Calculated Line Item Price */}
                        <div className="text-right min-w-[70px]">
                          <span
                            className={`text-sm font-extrabold block ${
                              isChecked ? 'text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            ${item.estimatedTotalPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ${(item.estimatedUnitPrice || 0).toFixed(2)}/{item.unit || 'unit'}
                          </span>
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        {!shopMode && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEditItem(item)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Edit item details, price or aisle"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Remove item from list"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Item Details Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-600" />
                Edit Item & Price Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editQty}
                    onChange={(e) => setEditQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unit (e.g. lbs, pk)
                  </label>
                  <input
                    type="text"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min={0}
                    value={editUnitPrice}
                    onChange={(e) => setEditUnitPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Live Preview of Line Item Total */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                <span className="text-amber-900 font-medium">Calculated Item Total:</span>
                <span className="text-sm font-extrabold text-amber-950">
                  ${(Math.max(1, parseFloat(editQty) || 1) * Math.max(0, parseFloat(editUnitPrice) || 0)).toFixed(2)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Department Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {Object.entries(CATEGORY_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store Sourcing
                  </label>
                  <select
                    value={editStore}
                    onChange={(e) => setEditStore(e.target.value as StoreCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {Object.entries(STORE_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Aisle / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Produce, Aisle 3"
                    value={editAisle}
                    onChange={(e) => setEditAisle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as ItemPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    <option value="must_have">Must-Have</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional_upgrade">Optional</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Host Buying Tip (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Look for organic ripe pack, buy store brand"
                  value={editBuyingTip}
                  onChange={(e) => setEditBuyingTip(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                >
                  Save & Update Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-600" />
                Add Item to Shopping Checklist
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fresh Limes, Organic Hummus, Scented Napkins"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {Object.entries(CATEGORY_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Store
                  </label>
                  <select
                    value={newItemStore}
                    onChange={(e) => setNewItemStore(e.target.value as StoreCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    {Object.entries(STORE_META).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.icon} {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Unit (e.g. pk, lbs)
                  </label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Est. Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    min={0}
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value as ItemPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  >
                    <option value="must_have">Must-Have</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional_upgrade">Optional</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Aisle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Produce, Meat Case, Aisle 4"
                    value={newItemAisle}
                    onChange={(e) => setNewItemAisle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm"
                >
                  Add to List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
