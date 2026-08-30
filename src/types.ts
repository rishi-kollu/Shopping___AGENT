export type EventType =
  | 'birthday'
  | 'dinner'
  | 'bbq'
  | 'cocktail'
  | 'kids'
  | 'game_night'
  | 'baby_shower'
  | 'holiday'
  | 'pool_party'
  | 'custom';

export type PartyVibe =
  | 'casual'
  | 'luxe'
  | 'budget_friendly'
  | 'quick_prep'
  | 'craft_diy'
  | 'high_energy';

export type VenueType =
  | 'home_indoor'
  | 'backyard'
  | 'park_outdoor'
  | 'event_hall'
  | 'pool'
  | 'rooftop';

export type ItemCategory =
  | 'food'
  | 'beverages'
  | 'decor'
  | 'tableware'
  | 'activities_favors'
  | 'prep_supplies';

export type ItemPriority = 'must_have' | 'recommended' | 'optional_upgrade';

export type StoreCategory =
  | 'grocery'
  | 'wholesale_bulk'
  | 'party_store'
  | 'specialty_amazon'
  | 'bakery_local'
  | 'liquor_store';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: string;
  numericQty: number;
  unit: string;
  estimatedUnitPrice: number;
  estimatedTotalPrice: number;
  priority: ItemPriority;
  purchased: boolean;
  storeCategory: StoreCategory;
  aisle: string;
  dietaryTags?: string[];
  buyingTip?: string;
  suggestedSubstitute?: string;
  notes?: string;
}

export interface FoodCalculation {
  label: string;
  formula: string;
  recommendedTotal: string;
  breakdown: string[];
}

export interface DrinkCalculation {
  totalDrinksNeeded: number;
  alcoholicDrinks: number;
  nonAlcoholicDrinks: number;
  iceBagsLbs: number;
  breakdown: string[];
}

export interface PortionBreakdown {
  foodCalculation: FoodCalculation;
  drinkCalculation: DrinkCalculation;
  tablewareBufferMultiplier: number;
}

export interface TimelineStep {
  id: string;
  timeframe: string;
  title: string;
  tasks: string[];
  completed: boolean;
}

export interface SignatureItemIdea {
  id: string;
  type: 'cocktail_mocktail' | 'easy_platter' | 'budget_hack' | 'party_game';
  title: string;
  description: string;
  ingredientsOrMaterials: string[];
  prepTime: string;
  estimatedCost: number;
}

export interface BudgetSummary {
  targetBudget: number;
  estimatedTotal: number;
  purchasedTotal: number;
  categoryTotals: Record<string, number>;
  savingsOpportunities: string[];
}

export interface PartyBrief {
  id: string;
  name: string;
  eventType: EventType;
  theme: string;
  adultCount: number;
  kidCount: number;
  drinkersCount: number;
  durationHours: number;
  budget: number;
  currency: string;
  dietaryRestrictions: string[];
  vibe: PartyVibe;
  venueType: VenueType;
  prepTimeAvailable: 'low' | 'medium' | 'high';
  specialRequests: string;
}

export interface PartyPlan {
  id: string;
  brief: PartyBrief;
  tagline: string;
  overview: string;
  items: ShoppingItem[];
  portionBreakdown: PortionBreakdown;
  budgetSummary: BudgetSummary;
  timeline: TimelineStep[];
  signatureIdeas: SignatureItemIdea[];
  agentAdvice: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
  appliedDiffSummary?: string;
}

export interface RecipeCard {
  title: string;
  yield: string;
  prepTime: string;
  difficulty: string;
  costEstimate: string;
  ingredients: string[];
  instructions: string[];
  hostProTip: string;
}
