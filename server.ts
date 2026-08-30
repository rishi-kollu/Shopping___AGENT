import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", hasApiKey: Boolean(process.env.GEMINI_API_KEY) });
});

// Endpoint: Generate Full Party Plan & Shopping List
app.post("/api/gemini/plan", async (req, res) => {
  const brief = req.body;
  const ai = getGenAI();

  const prompt = `You are an expert Party Planner & Master Shopping Logistics Agent.
Generate a comprehensive, mathematically accurate party plan, portion calculation, and itemized shopping list tailored specifically for this event:

Event Specifications:
- Event Name / Theme: ${brief.name || "Party"} (${brief.theme || "General Celebration"})
- Event Type: ${brief.eventType}
- Guests: ${brief.adultCount} adults, ${brief.kidCount} kids (${brief.drinkersCount} drinking alcohol)
- Duration: ${brief.durationHours} hours
- Target Budget: $${brief.budget} ${brief.currency || "USD"}
- Dietary Restrictions: ${(brief.dietaryRestrictions || []).join(", ") || "None"}
- Vibe / Style: ${brief.vibe}
- Venue: ${brief.venueType}
- Prep Time Preference: ${brief.prepTimeAvailable}
- Special Notes / Requests: ${brief.specialRequests || "None"}

Please calculate precise food portions (ounces, counts, slices), exact drink counts (1.5 drinks/hour for adults, sodas/juices for kids, 1.5-2 lbs ice per guest), essential tableware with a 25% safety buffer, themed decor, activities/favors, and prep supplies.
Make sure the estimated total is realistic and stays close to or optimizes the target budget of $${brief.budget}.
Group items into stores (grocery, wholesale_bulk, party_store, specialty_amazon, bakery_local, liquor_store) and specific aisles to make the shopping trip fast and seamless.

Return ONLY a valid JSON object strictly matching this schema:
{
  "tagline": "Short catchy party tagline",
  "overview": "2-3 sentence overview of the party theme, catering strategy, and vibe",
  "items": [
    {
      "id": "unique-string",
      "name": "Item name",
      "category": "food" | "beverages" | "decor" | "tableware" | "activities_favors" | "prep_supplies",
      "quantity": "Exact quantity string (e.g. '3 lbs', '2 packs (48 ct)', '3 bottles (750ml)')",
      "numericQty": 3,
      "unit": "lbs/packs/bottles/etc",
      "estimatedUnitPrice": 5.50,
      "estimatedTotalPrice": 16.50,
      "priority": "must_have" | "recommended" | "optional_upgrade",
      "storeCategory": "grocery" | "wholesale_bulk" | "party_store" | "specialty_amazon" | "bakery_local" | "liquor_store",
      "aisle": "e.g. Meat & Deli, Produce, Bakery, Party Aisle, Mixers & Soda",
      "dietaryTags": ["Gluten-Free", "Vegetarian", etc],
      "buyingTip": "Smart shopping tip (e.g. 'Buy frozen block ice or ask store for party discount')",
      "suggestedSubstitute": "Alternative to save money or simplify prep"
    }
  ],
  "portionBreakdown": {
    "foodCalculation": {
      "label": "Food Portions Math",
      "formula": "Standard formula used",
      "recommendedTotal": "Overall summary (e.g. '4 lbs proteins, 6 sides, 30 appetizers')",
      "breakdown": [
        "Adults: ~6-8 oz protein + 2 sides each",
        "Kids: ~4 oz finger foods + fruit/veggie snacks",
        "Dessert: 1.5 portions per guest"
      ]
    },
    "drinkCalculation": {
      "totalDrinksNeeded": 45,
      "alcoholicDrinks": 30,
      "nonAlcoholicDrinks": 20,
      "iceBagsLbs": 30,
      "breakdown": [
        "Alcohol: 1.5 drinks/hr per drinker = ~X servings",
        "Non-Alcoholic & Kids: 1 drink/hr = ~Y servings",
        "Ice requirement: 1.5 lbs per guest = Z lbs"
      ]
    },
    "tablewareBufferMultiplier": 1.25
  },
  "budgetSummary": {
    "targetBudget": ${brief.budget},
    "estimatedTotal": 0,
    "savingsOpportunities": [
      "Cost saving suggestion 1",
      "Cost saving suggestion 2"
    ]
  },
  "timeline": [
    {
      "id": "t1",
      "timeframe": "T-7 Days",
      "title": "Decor & Specialty Order",
      "tasks": ["Order custom banner online", "Send digital invitations"],
      "completed": false
    },
    {
      "id": "t2",
      "timeframe": "T-2 Days",
      "title": "Dry Goods & Bulk Shopping",
      "tasks": ["Hit Costco for drinks, chips, paper plates", "Pre-buy non-perishables"],
      "completed": false
    },
    {
      "id": "t3",
      "timeframe": "T-1 Day",
      "title": "Fresh Grocery & Marinade Prep",
      "tasks": ["Buy produce and meats", "Marinate skewers / chill wine and beer"],
      "completed": false
    },
    {
      "id": "t4",
      "timeframe": "Day-Of (Morning)",
      "title": "Ice Run & Decor Setup",
      "tasks": ["Pick up 3 bags of ice", "Inflate balloon garland and set buffet table"],
      "completed": false
    },
    {
      "id": "t5",
      "timeframe": "1 Hour Before",
      "title": "Music & Final Finishing",
      "tasks": ["Start party playlist", "Put out chilled appetizers and signature punch"],
      "completed": false
    }
  ],
  "signatureIdeas": [
    {
      "id": "sig-1",
      "type": "cocktail_mocktail" | "easy_platter" | "budget_hack" | "party_game",
      "title": "Signature Item Title",
      "description": "Engaging description",
      "ingredientsOrMaterials": ["Item 1", "Item 2", "Item 3"],
      "prepTime": "15 mins",
      "estimatedCost": 18
    }
  ],
  "agentAdvice": [
    "Top planner tip 1 for smooth hosting",
    "Top planner tip 2 for preventing shortages or leftovers"
  ]
}`;

  if (!ai) {
    // Return robust template fallback
    const fallback = generateFallbackPlan(brief);
    return res.json(fallback);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);

    // Calculate sum if missing or incorrect
    let sum = 0;
    const categoryTotals: Record<string, number> = {};
    if (Array.isArray(parsed.items)) {
      parsed.items.forEach((item: any, index: number) => {
        if (!item.id) item.id = `item-${Date.now()}-${index}`;
        const total = item.estimatedTotalPrice || (item.numericQty || 1) * (item.estimatedUnitPrice || 0);
        item.estimatedTotalPrice = Math.round(total * 100) / 100;
        item.purchased = false;
        sum += item.estimatedTotalPrice;
        categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.estimatedTotalPrice;
      });
    }

    if (!parsed.budgetSummary) {
      parsed.budgetSummary = { targetBudget: brief.budget, estimatedTotal: sum, savingsOpportunities: [] };
    }
    parsed.budgetSummary.estimatedTotal = Math.round(sum * 100) / 100;
    parsed.budgetSummary.purchasedTotal = 0;
    parsed.budgetSummary.categoryTotals = categoryTotals;

    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini plan generation error:", err);
    // Graceful fallback
    const fallback = generateFallbackPlan(brief);
    res.json(fallback);
  }
});

// Endpoint: Agent Chat & List Optimization
app.post("/api/gemini/chat", async (req, res) => {
  const { message, currentPlan, chatHistory } = req.body;
  const ai = getGenAI();

  if (!ai) {
    return res.json({
      reply: `I understand you want to "${message}". In offline mode, you can directly edit items, add custom items, or check them off in your shopping list tabs!`,
      planDiff: null,
    });
  }

  const prompt = `You are the official "CymbalMart Assistant", an expert, friendly AI party planning and grocery concierge at CymbalMart supermarket.
You interact directly with CymbalMart customers who are planning parties, grocery runs, and gatherings.
The customer is planning an event: "${currentPlan.brief?.name || "Party"}" with ${currentPlan.brief?.adultCount || 10} adults and ${currentPlan.brief?.kidCount || 0} kids.
Current budget: $${currentPlan.brief?.budget || 200}.
Current shopping items count: ${currentPlan.items?.length || 0}.

User says: "${message}"

Your task as CymbalMart Assistant:
1. Provide a warm, highly knowledgeable, and welcoming customer response (2-4 sentences) embodying CymbalMart's helpful service.
2. If the user asks for product substitutions, aisle locations, budget trimmings, dietary needs (vegan, gluten-free, halal, nut-free), or catering portion adjustments, recommend specific CymbalMart inventory items and changes.
3. If the user is asking to modify items (e.g. "make it cheaper", "swap out beer for non-alcoholic drinks", "add gluten-free dessert", "add vegan appetizers", "adjust for 5 more people"), propose specific item modifications (additions, removals, or quantity changes).
4. If no list changes are required, return itemsToAdd as empty and itemNamesToRemove as empty.

Return ONLY a JSON response:
{
  "reply": "Conversational helpful response from CymbalMart Assistant",
  "suggestedAction": "Summary of action taken or suggested (e.g., 'Swapped beef burgers for Portobello mushroom & halloumi sliders in Produce/Deli')",
  "itemsToAdd": [
    {
      "id": "new-item-id",
      "name": "Item name",
      "category": "food" | "beverages" | "decor" | "tableware" | "activities_favors" | "prep_supplies",
      "quantity": "2 packs",
      "numericQty": 2,
      "unit": "packs",
      "estimatedUnitPrice": 4.50,
      "estimatedTotalPrice": 9.00,
      "priority": "must_have",
      "storeCategory": "grocery",
      "aisle": "Produce / Bakery",
      "dietaryTags": ["Vegan"],
      "buyingTip": "Tip"
    }
  ],
  "itemNamesToRemove": ["Names of items to remove if applicable"],
  "updatedAdvice": "Optional fresh CymbalMart planner tip"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini chat error:", err);
    res.json({
      reply: `Hello from CymbalMart Assistant! I received your request: "${message}". I can help customize your shopping list, find aisle locations, make dietary swaps, and keep your cart within budget.`,
      itemsToAdd: [],
      itemNamesToRemove: [],
    });
  }
});

// Endpoint: AI Custom Party Recipe & Drink Formulation
app.post("/api/gemini/recipe", async (req, res) => {
  const { title, type, guests, budget, theme, ingredients } = req.body;
  const ai = getGenAI();

  if (!ai) {
    return res.json({
      title: title || "Signature Party Punch",
      yield: `${guests || 10} servings`,
      prepTime: "10 mins",
      difficulty: "Easy",
      costEstimate: "$15.00",
      ingredients: [
        "1 bottle Prosecco or Ginger Ale (750ml)",
        "3 cups Pomegranate or Cranberry Juice",
        "1 cup Orange Liqueur (or fresh orange juice)",
        "Fresh mint leaves and sliced citrus for garnish",
        "2 cups Ice cubes"
      ],
      instructions: [
        "In a large decorative punch bowl or drink dispenser, combine chilled juices and citrus slices.",
        "Just before guests arrive, gently stir in chilled Prosecco or Ginger Ale to preserve fizz.",
        "Float fresh mint sprigs on top and serve with an ice bucket nearby."
      ],
      hostProTip: "Pre-freeze citrus slices into ice cubes the night before so the punch stays cold without getting diluted!"
    });
  }

  const prompt = `Create a crowd-pleasing, budget-optimized ${type || "recipe or cocktail"} for a "${theme || "Festive"}" party for ${guests || 12} guests.
Title / Idea: ${title || "Signature Crowd Treat"}
Available shopping ingredients: ${(ingredients || []).join(", ") || "Standard pantry items"}

Return JSON format:
{
  "title": "Creative recipe name",
  "yield": "e.g. 15 servings (Batch Size)",
  "prepTime": "15 mins",
  "difficulty": "Easy" | "Medium",
  "costEstimate": "$18 - $24",
  "ingredients": ["Ingredient 1 with exact batch measurement", "Ingredient 2", ...],
  "instructions": ["Step 1", "Step 2", "Step 3"],
  "hostProTip": "Secret host hack for batching ahead or saving cleanup time"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (err: any) {
    console.error("Gemini recipe error:", err);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

// Fallback Plan Generator
function generateFallbackPlan(brief: any) {
  const adultCount = Number(brief.adultCount) || 10;
  const kidCount = Number(brief.kidCount) || 0;
  const totalGuests = adultCount + kidCount;
  const drinkers = Number(brief.drinkersCount) || adultCount;
  const duration = Number(brief.durationHours) || 3;
  const budget = Number(brief.budget) || 200;

  const totalDrinks = Math.round(drinkers * duration * 1.25 + kidCount * duration * 1);
  const iceLbs = Math.max(15, Math.round(totalGuests * 1.75));

  const items = [
    {
      id: "f-1",
      name: "Artisan Burger Patties / Sliders (or plant-based)",
      category: "food",
      quantity: `${Math.ceil(totalGuests * 1.5)} count`,
      numericQty: Math.ceil(totalGuests * 1.5),
      unit: "patties",
      estimatedUnitPrice: 1.80,
      estimatedTotalPrice: Math.round(Math.ceil(totalGuests * 1.5) * 1.80 * 100) / 100,
      priority: "must_have",
      storeCategory: "grocery",
      aisle: "Meat & Seafood / Plant-Based",
      dietaryTags: ["Available GF/Vegan"],
      buyingTip: "Pre-seasoned bulk packs save 20 minutes of host prep time.",
      suggestedSubstitute: "Chicken drumsticks or pulled pork for higher yield."
    },
    {
      id: "f-2",
      name: "Brioche Slider Buns & Gluten-Free Buns",
      category: "food",
      quantity: `${Math.ceil((totalGuests * 1.5) / 8)} packs (8 ct)`,
      numericQty: Math.ceil((totalGuests * 1.5) / 8),
      unit: "packs",
      estimatedUnitPrice: 4.20,
      estimatedTotalPrice: Math.round(Math.ceil((totalGuests * 1.5) / 8) * 4.20 * 100) / 100,
      priority: "must_have",
      storeCategory: "grocery",
      aisle: "Bakery",
      buyingTip: "Toast with garlic butter right before serving."
    },
    {
      id: "f-3",
      name: "Gourmet Cheese & Charcuterie Platter Accents",
      category: "food",
      quantity: "1 large board kit",
      numericQty: 1,
      unit: "kit",
      estimatedUnitPrice: 24.00,
      estimatedTotalPrice: 24.00,
      priority: "recommended",
      storeCategory: "wholesale_bulk",
      aisle: "Deli & Specialty Cheese",
      dietaryTags: ["Vegetarian Options"],
      buyingTip: "Buy a variety pack of cheeses and slice at home to save 40%."
    },
    {
      id: "f-4",
      name: "Seasonal Fruit & Berry Skewers",
      category: "food",
      quantity: "3 lbs mixed fruit",
      numericQty: 3,
      unit: "lbs",
      estimatedUnitPrice: 4.50,
      estimatedTotalPrice: 13.50,
      priority: "recommended",
      storeCategory: "grocery",
      aisle: "Produce",
      dietaryTags: ["Vegan", "Gluten-Free"],
      buyingTip: "Watermelon and pineapple provide maximum color and volume per dollar."
    },
    {
      id: "f-5",
      name: "Signature Theme Cupcakes / Dessert Bites",
      category: "food",
      quantity: `${Math.ceil(totalGuests * 1.2)} count`,
      numericQty: Math.ceil(totalGuests * 1.2),
      unit: "pieces",
      estimatedUnitPrice: 1.50,
      estimatedTotalPrice: Math.round(Math.ceil(totalGuests * 1.2) * 1.50 * 100) / 100,
      priority: "must_have",
      storeCategory: "bakery_local",
      aisle: "Bakery Counter",
      buyingTip: "Mini bite-sized treats encourage trying multiple flavors without plate waste."
    },
    {
      id: "b-1",
      name: "Craft Beer & Hard Seltzer Variety Packs",
      category: "beverages",
      quantity: `${Math.ceil((drinkers * duration * 0.8) / 12)} x 12-packs`,
      numericQty: Math.ceil((drinkers * duration * 0.8) / 12),
      unit: "12-packs",
      estimatedUnitPrice: 18.50,
      estimatedTotalPrice: Math.round(Math.ceil((drinkers * duration * 0.8) / 12) * 18.50 * 100) / 100,
      priority: "must_have",
      storeCategory: "liquor_store",
      aisle: "Beer & Seltzer Cooler",
      buyingTip: "Variety 12-packs please IPA, light beer, and seltzer drinkers alike."
    },
    {
      id: "b-2",
      name: "Artisan Soda & Sparkling Botanical Water (Lime/Berry)",
      category: "beverages",
      quantity: `${Math.ceil(totalGuests * 1.5 / 8)} x 8-packs`,
      numericQty: Math.ceil(totalGuests * 1.5 / 8),
      unit: "8-packs",
      estimatedUnitPrice: 5.50,
      estimatedTotalPrice: Math.round(Math.ceil(totalGuests * 1.5 / 8) * 5.50 * 100) / 100,
      priority: "must_have",
      storeCategory: "grocery",
      aisle: "Beverages / Sparkling",
      dietaryTags: ["Non-Alcoholic", "Zero Sugar"],
      buyingTip: "Essential for designated drivers, non-drinkers, and kids."
    },
    {
      id: "b-3",
      name: "Party Ice Bags",
      category: "beverages",
      quantity: `${Math.ceil(iceLbs / 10)} x 10-lb bags`,
      numericQty: Math.ceil(iceLbs / 10),
      unit: "bags",
      estimatedUnitPrice: 3.25,
      estimatedTotalPrice: Math.round(Math.ceil(iceLbs / 10) * 3.25 * 100) / 100,
      priority: "must_have",
      storeCategory: "grocery",
      aisle: "Front Ice Freezer",
      buyingTip: "Dedicate 1 clean bag for drink glasses, and 2 bags for drink cooling tubs."
    },
    {
      id: "d-1",
      name: "Theme Color Balloon Arch Kit & Backdrop",
      category: "decor",
      quantity: "1 complete kit",
      numericQty: 1,
      unit: "kit",
      estimatedUnitPrice: 16.00,
      estimatedTotalPrice: 16.00,
      priority: "recommended",
      storeCategory: "party_store",
      aisle: "Decorations & Photo Booth",
      buyingTip: "Assemble 1 night in advance using a handheld balloon pump."
    },
    {
      id: "d-2",
      name: "Warm Fairy String Lights / LED Lanterns",
      category: "decor",
      quantity: "2 strands",
      numericQty: 2,
      unit: "strands",
      estimatedUnitPrice: 7.50,
      estimatedTotalPrice: 15.00,
      priority: "optional_upgrade",
      storeCategory: "specialty_amazon",
      aisle: "Lighting & Home",
      buyingTip: "Reusable for future dinner parties and patio hangouts."
    },
    {
      id: "t-1",
      name: "Heavy-Duty Compostable Palm Leaf Plates & Bowls",
      category: "tableware",
      quantity: `${Math.ceil(totalGuests * 1.5 / 25)} packs (25 ct)`,
      numericQty: Math.ceil(totalGuests * 1.5 / 25),
      unit: "packs",
      estimatedUnitPrice: 12.00,
      estimatedTotalPrice: Math.round(Math.ceil(totalGuests * 1.5 / 25) * 12.00 * 100) / 100,
      priority: "must_have",
      storeCategory: "wholesale_bulk",
      aisle: "Paper & Disposable Goods",
      buyingTip: "Eco-friendly, sturdier than paper, and elevates the party aesthetics."
    },
    {
      id: "t-2",
      name: "3-Ply Theme Color Dinner Napkins & Cocktail Napkins",
      category: "tableware",
      quantity: "1 mega pack (100 ct)",
      numericQty: 1,
      unit: "pack",
      estimatedUnitPrice: 6.50,
      estimatedTotalPrice: 6.50,
      priority: "must_have",
      storeCategory: "party_store",
      aisle: "Tableware",
      buyingTip: "Always buy 2-3 napkins per person to handle finger food messes."
    },
    {
      id: "a-1",
      name: "Party Game Props / Glow Sticks or Trivia Pack",
      category: "activities_favors",
      quantity: "1 set",
      numericQty: 1,
      unit: "set",
      estimatedUnitPrice: 14.00,
      estimatedTotalPrice: 14.00,
      priority: "recommended",
      storeCategory: "specialty_amazon",
      aisle: "Games & Party Toys",
      buyingTip: "Icebreaker games get guests mingling within the first 20 minutes."
    },
    {
      id: "p-1",
      name: "Heavy Duty Drawstring Trash Bags & Surface Wipes",
      category: "prep_supplies",
      quantity: "1 box",
      numericQty: 1,
      unit: "box",
      estimatedUnitPrice: 8.50,
      estimatedTotalPrice: 8.50,
      priority: "must_have",
      storeCategory: "grocery",
      aisle: "Cleaning & Paper Aisles",
      buyingTip: "Set up 2 clearly marked stations: 1 for Trash, 1 for Recycling/Cans."
    }
  ];

  let sum = items.reduce((acc, item) => acc + item.estimatedTotalPrice, 0);
  sum = Math.round(sum * 100) / 100;

  const categoryTotals: Record<string, number> = {};
  items.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.estimatedTotalPrice;
  });

  return {
    tagline: `Unforgettable ${brief.name || "Celebration"} – Effortless Planning & Flawless Execution`,
    overview: `A tailored ${brief.eventType} blueprint designed for ${totalGuests} guests with a ${brief.vibe} vibe. Portion calculations ensure abundant catering without wasteful over-purchasing.`,
    items,
    portionBreakdown: {
      foodCalculation: {
        label: "Portion Math for " + totalGuests + " Guests",
        formula: "Adults: 6-8 oz protein + 2 hearty sides; Kids: 4-5 oz snacks + finger fruit",
        recommendedTotal: `${Math.ceil(totalGuests * 1.5)} main portions, 3 side dishes, 1.2 desserts/guest`,
        breakdown: [
          `Adults (${adultCount}): 1.5 mains + 2 side portions each`,
          `Kids (${kidCount}): 1 mini portion + easy snacks`,
          `Tableware: 25% extra buffer included for seconds and refills`
        ]
      },
      drinkCalculation: {
        totalDrinksNeeded: totalDrinks,
        alcoholicDrinks: Math.round(drinkers * duration * 1.2),
        nonAlcoholicDrinks: Math.round((totalGuests - drinkers + kidCount) * duration * 1.0 + drinkers * 0.5),
        iceBagsLbs: iceLbs,
        breakdown: [
          `Alcoholic drinks calculated at 1.5 drinks/hour for the first 2 hours, 1/hour after`,
          `Water & Mocktails: 1 serving per guest per hour`,
          `Ice: ${iceLbs} lbs (1/3 for drink glasses, 2/3 for chilling coolers)`
        ]
      },
      tablewareBufferMultiplier: 1.25
    },
    budgetSummary: {
      targetBudget: budget,
      estimatedTotal: sum,
      purchasedTotal: 0,
      categoryTotals,
      savingsOpportunities: [
        "Buy beverages and disposable tableware at wholesale clubs (Costco/Sam's) to save ~25%",
        "Batch signature punch in a dispenser rather than buying individual canned craft cocktails"
      ]
    },
    timeline: [
      {
        id: "t-1",
        timeframe: "T-7 Days",
        title: "Confirm RSVPs & Order Specialty Items",
        tasks: ["Lock in final headcounts", "Order any custom decor/favors online", "Check cooler and serving bowl inventory"],
        completed: false
      },
      {
        id: "t-2",
        timeframe: "T-2 Days",
        title: "Wholesale & Dry Goods Trip",
        tasks: ["Buy plates, napkins, cups, chips, sodas, and canned drinks", "Curate the party music playlist (3+ hours)"],
        completed: false
      },
      {
        id: "t-3",
        timeframe: "T-1 Day",
        title: "Fresh Groceries & Marinate",
        tasks: ["Buy fresh produce and meats", "Prep veggies and dips", "Chill white wine, beer, and sodas in fridge"],
        completed: false
      },
      {
        id: "t-4",
        timeframe: "Day-Of (Morning)",
        title: "Ice & Table Styling",
        tasks: ["Pick up 3 bags of ice", "Assemble balloon garland / set buffet stations", "Set out labeled recycling and trash bins"],
        completed: false
      },
      {
        id: "t-5",
        timeframe: "30 Mins Before",
        title: "Music On & Final Touches",
        tasks: ["Fire up playlist and ambient lighting", "Put out chilled appetizers and signature punch", "Pour yourself a drink and relax!"],
        completed: false
      }
    ],
    signatureIdeas: [
      {
        id: "sig-1",
        type: "cocktail_mocktail",
        title: "Sunset Citrus Sparkler (Batchable)",
        description: "Bright, refreshing crowd punch with Prosecco or sparkling cider, citrus juices, and fresh rosemary sprigs.",
        ingredientsOrMaterials: ["2 bottles Prosecco/Cider", "1L Blood Orange Juice", "Fresh Rosemary", "Sliced Oranges"],
        prepTime: "5 mins",
        estimatedCost: 22
      },
      {
        id: "sig-2",
        type: "budget_hack",
        title: "DIY Grazing Table Board",
        description: "Arrange crackers, sliced blocks of cheddar/gouda, grapes, and nuts across butcher paper for a lavish look at 1/3 catering cost.",
        ingredientsOrMaterials: ["Butcher paper roll", "2 cheese blocks", "Grapes", "Almonds", "Water crackers"],
        prepTime: "15 mins",
        estimatedCost: 18
      }
    ],
    agentAdvice: [
      "Keep drinks and food in two separate zones to prevent human traffic jams.",
      "Always chill canned/bottled drinks in water + ice (slurry) — it cools drinks in 15 minutes vs 2 hours in a dry fridge."
    ]
  };
}

// Vite middleware for dev or static serving for prod
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Party Planner Shopping Agent server running on http://0.0.0.0:${PORT}`);
  });
}

start();
