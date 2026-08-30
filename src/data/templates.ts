import { PartyBrief, PartyPlan } from '../types';

export const STARTER_TEMPLATES: { brief: PartyBrief; plan: PartyPlan }[] = [
  {
    brief: {
      id: 'template-fiesta',
      name: 'Taco & Margarita Sunset Fiesta',
      eventType: 'dinner',
      theme: 'Mexican Street Taquería & Craft Margaritas',
      adultCount: 12,
      kidCount: 2,
      drinkersCount: 10,
      durationHours: 4,
      budget: 240,
      currency: '$',
      dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Tortillas'],
      vibe: 'casual',
      venueType: 'backyard',
      prepTimeAvailable: 'medium',
      specialRequests: 'Fresh guacamole bar and batch spicy mezcal/tequila margaritas'
    },
    plan: {
      id: 'plan-fiesta',
      brief: {
        id: 'template-fiesta',
        name: 'Taco & Margarita Sunset Fiesta',
        eventType: 'dinner',
        theme: 'Mexican Street Taquería & Craft Margaritas',
        adultCount: 12,
        kidCount: 2,
        drinkersCount: 10,
        durationHours: 4,
        budget: 240,
        currency: '$',
        dietaryRestrictions: ['Vegetarian Option', 'Gluten-Free Tortillas'],
        vibe: 'casual',
        venueType: 'backyard',
        prepTimeAvailable: 'medium',
        specialRequests: 'Fresh guacamole bar and batch spicy mezcal/tequila margaritas'
      },
      tagline: 'Sizzling Street Tacos, Handcrafted Margaritas & Festive Vibes',
      overview: 'A crowd-pleasing DIY taco bar designed for 14 guests. Easy self-serve stations minimize host stress while guests customize their tacos and drinks.',
      items: [
        {
          id: 'taco-1',
          name: 'Pork Carnitas or Flank Steak (Pre-marinated)',
          category: 'food',
          quantity: '5 lbs',
          numericQty: 5,
          unit: 'lbs',
          estimatedUnitPrice: 6.99,
          estimatedTotalPrice: 34.95,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Meat & Seafood',
          dietaryTags: ['Gluten-Free'],
          buyingTip: 'Slow-cook in a crockpot the morning of the party so meat stays piping hot and juicy.'
        },
        {
          id: 'taco-2',
          name: 'Seasoned Black Beans & Fajita Peppers (Veggie Main)',
          category: 'food',
          quantity: '3 cans + 4 bell peppers',
          numericQty: 3,
          unit: 'packs',
          estimatedUnitPrice: 3.50,
          estimatedTotalPrice: 10.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Produce / Canned Goods',
          dietaryTags: ['Vegan', 'Gluten-Free'],
          buyingTip: 'Guarantees vegetarian and vegan guests have a hearty, flavorful protein.'
        },
        {
          id: 'taco-3',
          name: 'White Corn Tortillas & Soft Flour Tortillas',
          category: 'food',
          quantity: '2 packs (30 ct each)',
          numericQty: 2,
          unit: 'packs',
          estimatedUnitPrice: 2.75,
          estimatedTotalPrice: 5.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Bakery / Mexican Specialty',
          dietaryTags: ['Corn = GF'],
          buyingTip: 'Keep warm inside a clean kitchen towel or tortilla warmer.'
        },
        {
          id: 'taco-4',
          name: 'Fresh Avocados, Cilantro, Limes & Cotija Cheese',
          category: 'food',
          quantity: '10 avocados + bundle',
          numericQty: 1,
          unit: 'kit',
          estimatedUnitPrice: 18.00,
          estimatedTotalPrice: 18.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Produce & Dairy',
          dietaryTags: ['Vegetarian'],
          buyingTip: 'Buy 5 firm and 5 ripe avocados 2 days prior.'
        },
        {
          id: 'taco-5',
          name: 'Restaurant Style Tortilla Chips & Salsa Trio',
          category: 'food',
          quantity: '2 large bags + 3 salsa jars',
          numericQty: 2,
          unit: 'sets',
          estimatedUnitPrice: 7.50,
          estimatedTotalPrice: 15.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'wholesale_bulk',
          aisle: 'Snack Aisle',
          buyingTip: 'Warm tortilla chips in the oven at 300°F for 4 minutes for authentic restaurant crunch.'
        },
        {
          id: 'taco-6',
          name: 'Cinnamon Sugar Churro Bites & Chocolate Dip',
          category: 'food',
          quantity: '24 bites',
          numericQty: 24,
          unit: 'pieces',
          estimatedUnitPrice: 0.60,
          estimatedTotalPrice: 14.40,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'bakery_local',
          aisle: 'Bakery / Frozen',
          buyingTip: 'Air-fry frozen churro bites right before dessert serving.'
        },
        {
          id: 'taco-b1',
          name: '100% Blue Agave Blanco Tequila',
          category: 'beverages',
          quantity: '2 bottles (750ml)',
          numericQty: 2,
          unit: 'bottles',
          estimatedUnitPrice: 24.00,
          estimatedTotalPrice: 48.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'liquor_store',
          aisle: 'Spirits / Tequila',
          buyingTip: 'Batch into a 2-gallon glass dispenser with fresh lime wheels.'
        },
        {
          id: 'taco-b2',
          name: 'Mexican Cerveza (Corona / Modelo) 12-pack',
          category: 'beverages',
          quantity: '1 pack (12 bottles)',
          numericQty: 1,
          unit: '12-pack',
          estimatedUnitPrice: 18.00,
          estimatedTotalPrice: 18.00,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'liquor_store',
          aisle: 'Import Beer',
          buyingTip: 'Set out with sliced lime wedges and flaky sea salt.'
        },
        {
          id: 'taco-b3',
          name: 'Jarritos Mexican Sodas & Sparkling Lime Water',
          category: 'beverages',
          quantity: '12 bottles + 8 cans',
          numericQty: 2,
          unit: 'packs',
          estimatedUnitPrice: 6.50,
          estimatedTotalPrice: 13.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Beverages / Latin Section',
          dietaryTags: ['Non-Alcoholic'],
          buyingTip: 'Vibrant glass bottles double as colorful table decor!'
        },
        {
          id: 'taco-b4',
          name: 'Cocktail Ice & Cooler Ice',
          category: 'beverages',
          quantity: '3 x 10-lb bags',
          numericQty: 3,
          unit: 'bags',
          estimatedUnitPrice: 3.00,
          estimatedTotalPrice: 9.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Freezer',
          buyingTip: 'Keep drink dispenser ice separate from can cooler ice.'
        },
        {
          id: 'taco-d1',
          name: 'Papel Picado Mexican Fiesta Banner & Marigold Garland',
          category: 'decor',
          quantity: '1 set (30 ft)',
          numericQty: 1,
          unit: 'set',
          estimatedUnitPrice: 11.50,
          estimatedTotalPrice: 11.50,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Theme Party Decor',
          buyingTip: 'String between patio posts or along buffet table.'
        },
        {
          id: 'taco-t1',
          name: 'Sturdy Compostable 3-Compartment Taco Plates',
          category: 'tableware',
          quantity: '1 pack (30 ct)',
          numericQty: 1,
          unit: 'pack',
          estimatedUnitPrice: 10.50,
          estimatedTotalPrice: 10.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'wholesale_bulk',
          aisle: 'Disposable Tableware',
          buyingTip: 'Compartments prevent salsa from soaking into the tortilla!'
        },
        {
          id: 'taco-t2',
          name: 'Clear Tumblers (12 oz) & Festive Napkins',
          category: 'tableware',
          quantity: '50 cups + 75 napkins',
          numericQty: 1,
          unit: 'bundle',
          estimatedUnitPrice: 9.00,
          estimatedTotalPrice: 9.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Drinkware & Napkins',
          buyingTip: 'Provide a metallic sharpie marker so guests write names on cups.'
        },
        {
          id: 'taco-p1',
          name: 'Heavy Foil & Squeeze Bottles for Salsas',
          category: 'prep_supplies',
          quantity: '1 set',
          numericQty: 1,
          unit: 'set',
          estimatedUnitPrice: 7.50,
          estimatedTotalPrice: 7.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Kitchen & Foil Aisle',
          buyingTip: 'Squeeze bottles for crema and hot sauces speed up the buffet line.'
        }
      ],
      portionBreakdown: {
        foodCalculation: {
          label: 'Fiesta Portion Breakdown (14 Guests)',
          formula: '3.5 tacos per adult, 2 per child = ~46 total tacos',
          recommendedTotal: '5 lbs seasoned carnitas, 2 lbs black beans, 50 tortillas, 4 lbs guacamole/salsa',
          breakdown: [
            'Proteins: ~6 oz cooked meat/beans per adult',
            'Toppings: 2 cups cheese, 3 cups pico de gallo, 4 limes cut into wedges',
            'Chips: 1.5 oz chips per person for appetizers'
          ]
        },
        drinkCalculation: {
          totalDrinksNeeded: 48,
          alcoholicDrinks: 36,
          nonAlcoholicDrinks: 16,
          iceBagsLbs: 30,
          breakdown: [
            '10 Drinkers over 4 hours: ~3.5 drinks each = ~35 margaritas/beers',
            '4 Non-drinkers & Kids: 1 drink/hr = ~16 sodas & mocktails',
            '30 lbs ice (1 bag for shaker/dispenser, 2 bags for drink tub)'
          ]
        },
        tablewareBufferMultiplier: 1.3
      },
      budgetSummary: {
        targetBudget: 240,
        estimatedTotal: 224.85,
        purchasedTotal: 0,
        categoryTotals: {
          food: 111.85,
          beverages: 88.00,
          decor: 11.50,
          tableware: 19.50,
          activities_favors: 0,
          prep_supplies: 7.50
        },
        savingsOpportunities: [
          'Pre-batch the Margarita Mix (fresh lime juice + simple syrup) instead of expensive store bottled mixes to save $15 and improve taste.',
          'Buy pork shoulder in bulk and slow-braise at home instead of buying pre-cooked carnitas.'
        ]
      },
      timeline: [
        {
          id: 'tf-1',
          timeframe: 'T-3 Days',
          title: 'Stock Liquors & Non-Perishables',
          tasks: ['Buy Tequila, Cerveza, Sodas, and Tortilla Chips', 'Confirm playlist and taco bar serving platters'],
          completed: false
        },
        {
          id: 'tf-2',
          timeframe: 'T-1 Day',
          title: 'Batch Margarita Base & Marinate Meat',
          tasks: ['Squeeze 20 fresh limes for margarita mix', 'Season pork shoulder with citrus, garlic, and cumin', 'Hang Papel Picado banner'],
          completed: false
        },
        {
          id: 'tf-3',
          timeframe: 'Day-Of Morning',
          title: 'Slow Cooker On & Ice Pick-Up',
          tasks: ['Start carnitas in slow cooker at 8:00 AM', 'Pick up 3 bags of ice', 'Dice tomatoes, onions, and cilantro for pico de gallo'],
          completed: false
        },
        {
          id: 'tf-4',
          timeframe: '1 Hour Before',
          title: 'Taco Bar Layout & Pitcher Filling',
          tasks: ['Warm tortillas and place in warmer', 'Pour ice and batched Margaritas into drink dispenser', 'Turn on Latin acoustic playlist'],
          completed: false
        }
      ],
      signatureIdeas: [
        {
          id: 'sig-taco-1',
          type: 'cocktail_mocktail',
          title: 'Smoky Hibiscus & Lime Pitcher Margarita',
          description: 'Hibiscus tea brew sweetened with agave, shaken with blanco tequila, fresh lime juice, and a Tajín chili-lime rim.',
          ingredientsOrMaterials: ['Tequila Blanco', 'Hibiscus brew', 'Fresh Lime Juice', 'Agave Nectar', 'Tajín rim seasoning'],
          prepTime: '8 mins (Batch)',
          estimatedCost: 16
        },
        {
          id: 'sig-taco-2',
          type: 'budget_hack',
          title: 'DIY Street Corn (Elote) Cup Station',
          description: 'Serve warm sweet corn in cups with mayo, cotija cheese, lime, and chili powder for a high-end street food experience on a budget.',
          ingredientsOrMaterials: ['Canned sweet corn', 'Cotija cheese', 'Mayonnaise', 'Chili powder', 'Lime wedges'],
          prepTime: '10 mins',
          estimatedCost: 8
        }
      ],
      agentAdvice: [
        'Place the tortilla station at the beginning of the buffet, proteins in the middle, and salsas/toppings at the end to keep the guest line moving fast.',
        'Rim half the glasses with Tajín and half with kosher salt so guests have a choice!'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    brief: {
      id: 'template-kids-superhero',
      name: "Super Leo's 7th Hero Training Academy",
      eventType: 'kids',
      theme: 'Superhero Comic Book & Training Camp',
      adultCount: 8,
      kidCount: 12,
      drinkersCount: 4,
      durationHours: 3,
      budget: 200,
      currency: '$',
      dietaryRestrictions: ['Nut-Free (Strict School Policy)'],
      vibe: 'high_energy',
      venueType: 'backyard',
      prepTimeAvailable: 'medium',
      specialRequests: 'Obstacle course props, kid-friendly finger foods, capes/masks favors'
    },
    plan: {
      id: 'plan-kids-superhero',
      brief: {
        id: 'template-kids-superhero',
        name: "Super Leo's 7th Hero Training Academy",
        eventType: 'kids',
        theme: 'Superhero Comic Book & Training Camp',
        adultCount: 8,
        kidCount: 12,
        drinkersCount: 4,
        durationHours: 3,
        budget: 200,
        currency: '$',
        dietaryRestrictions: ['Nut-Free (Strict School Policy)'],
        vibe: 'high_energy',
        venueType: 'backyard',
        prepTimeAvailable: 'medium',
        specialRequests: 'Obstacle course props, kid-friendly finger foods, capes/masks favors'
      },
      tagline: 'High-Flying Hero Obstacle Course, Power Snacks & Superhero Capes',
      overview: 'An action-packed 3-hour birthday celebration featuring 12 mini-heroes. Structured activities and grab-and-go finger foods keep energy high and cleanup effortless.',
      items: [
        {
          id: 'k-1',
          name: 'Mini Corn Dog Nuggets & Baked Chicken Tenders',
          category: 'food',
          quantity: '2 bulk bags (48 ct)',
          numericQty: 2,
          unit: 'bags',
          estimatedUnitPrice: 11.50,
          estimatedTotalPrice: 23.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'wholesale_bulk',
          aisle: 'Frozen Foods',
          dietaryTags: ['Nut-Free'],
          buyingTip: 'Bake on parchment-lined sheet pans in 12 minutes for quick batch replenishment.'
        },
        {
          id: 'k-2',
          name: 'Hero Fruit Shield Skewers (Watermelon, Blueberry, Grape)',
          category: 'food',
          quantity: '3 lbs fruit + skewers',
          numericQty: 1,
          unit: 'bundle',
          estimatedUnitPrice: 12.00,
          estimatedTotalPrice: 12.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Produce',
          dietaryTags: ['Nut-Free', 'Vegan', 'Gluten-Free'],
          buyingTip: 'Arrange red watermelon star slices and blueberries to resemble Captain America shields.'
        },
        {
          id: 'k-3',
          name: 'Custom Superhero Cupcakes with Power Rings',
          category: 'food',
          quantity: '20 cupcakes',
          numericQty: 20,
          unit: 'pieces',
          estimatedUnitPrice: 1.25,
          estimatedTotalPrice: 25.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'bakery_local',
          aisle: 'Bakery Counter',
          buyingTip: 'Cupcakes are 10x faster to serve to kids than cutting a layered cake with no knife mess.'
        },
        {
          id: 'k-b1',
          name: '100% Apple & Fruit Juice Pouches (Nut-Free Facility)',
          category: 'beverages',
          quantity: '2 x 10-packs',
          numericQty: 2,
          unit: 'packs',
          estimatedUnitPrice: 4.50,
          estimatedTotalPrice: 9.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Juice & Beverages',
          dietaryTags: ['Nut-Free', '100% Juice'],
          buyingTip: 'Pouches eliminate accidental table spills during active play.'
        },
        {
          id: 'k-b2',
          name: 'Adult Refreshment Cooler (Sparkling Seltzers & Light Beer)',
          category: 'beverages',
          quantity: '1 x 12-pack seltzer + 1 x 6-pack beer',
          numericQty: 2,
          unit: 'packs',
          estimatedUnitPrice: 12.00,
          estimatedTotalPrice: 24.00,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'liquor_store',
          aisle: 'Cooler',
          buyingTip: 'Parents staying for the party will appreciate cold seltzers and iced coffees.'
        },
        {
          id: 'k-d1',
          name: 'Comic Book Action Word Cutouts (POW! BAM! ZAP!)',
          category: 'decor',
          quantity: '12 wall cutouts',
          numericQty: 1,
          unit: 'set',
          estimatedUnitPrice: 8.50,
          estimatedTotalPrice: 8.50,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Kids Theme Decor',
          buyingTip: 'Tape onto fences and obstacle course stations for photo ops.'
        },
        {
          id: 'k-a1',
          name: 'Satin Superhero Capes & Felt Masks Pack (12 Set)',
          category: 'activities_favors',
          quantity: '12-piece pack',
          numericQty: 1,
          unit: 'pack',
          estimatedUnitPrice: 24.00,
          estimatedTotalPrice: 24.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'specialty_amazon',
          aisle: 'Costumes & Favors',
          buyingTip: 'Hand out upon arrival so kids wear them during the party and take them home as favors!'
        },
        {
          id: 'k-a2',
          name: 'Agility Cones & Laser Yarn for Obstacle Course',
          category: 'activities_favors',
          quantity: '1 pack cones + red yarn roll',
          numericQty: 1,
          unit: 'kit',
          estimatedUnitPrice: 11.00,
          estimatedTotalPrice: 11.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Party Games',
          buyingTip: 'Create a "Lava Jump" and "Laser Beam Maze" in the backyard.'
        },
        {
          id: 'k-t1',
          name: 'Heavy Superhero Plates, Napkins & Table Cover',
          category: 'tableware',
          quantity: '1 party bundle (24 ct)',
          numericQty: 1,
          unit: 'bundle',
          estimatedUnitPrice: 14.00,
          estimatedTotalPrice: 14.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Tableware',
          buyingTip: 'Fitted plastic table covers prevent grass/wind blowaways.'
        }
      ],
      portionBreakdown: {
        foodCalculation: {
          label: 'Kids Party Portion Formula (12 Kids + 8 Adults)',
          formula: 'Kids: 3-4 finger foods + fruit cup + cupcake; Adults: 4 finger foods',
          recommendedTotal: '48 chicken nuggets, 24 mini corn dogs, 20 fruit skewers, 20 cupcakes',
          breakdown: [
            'Kids focus on fast finger foods between activities rather than sit-down meals',
            'Nut-Free certification checked across all items',
            '1.5 cupcakes allocated per kid to accommodate seconds or parent tastes'
          ]
        },
        drinkCalculation: {
          totalDrinksNeeded: 40,
          alcoholicDrinks: 8,
          nonAlcoholicDrinks: 32,
          iceBagsLbs: 15,
          breakdown: [
            'Kids: 2 juice pouches/water boxes each = 24 drinks',
            'Adults: 2 drinks each = 16 drinks (iced coffee, seltzer, light beer)',
            'Ice: 15 lbs for juice tub chilling'
          ]
        },
        tablewareBufferMultiplier: 1.25
      },
      budgetSummary: {
        targetBudget: 200,
        estimatedTotal: 170.50,
        purchasedTotal: 0,
        categoryTotals: {
          food: 74.40,
          beverages: 33.00,
          decor: 8.50,
          tableware: 14.00,
          activities_favors: 35.00,
          prep_supplies: 5.60
        },
        savingsOpportunities: [
          'DIY obstacle course with pool noodles and cardboard boxes instead of renting equipment.',
          'Bake box-mix superhero cupcakes at home to cut dessert costs in half.'
        ]
      },
      timeline: [
        {
          id: 'tk-1',
          timeframe: 'T-7 Days',
          title: 'Order Capes & Cones',
          tasks: ['Order cape & mask 12-pack online', 'Confirm RSVPs and dietary allergies'],
          completed: false
        },
        {
          id: 'tk-2',
          timeframe: 'T-1 Day',
          title: 'Course Prep & Snack Prep',
          tasks: ['Wash and assemble fruit skewers', 'Set up backyard obstacle course course checkpoints'],
          completed: false
        },
        {
          id: 'tk-3',
          timeframe: 'Day-Of Morning',
          title: 'Capes Out & Food Warming',
          tasks: ['Lay out superhero capes at welcome table', 'Pre-heat oven for chicken tenders and nuggets', 'Ice the drink tubs'],
          completed: false
        }
      ],
      signatureIdeas: [
        {
          id: 'sig-k-1',
          type: 'party_game',
          title: 'Kryptonite Laser Obstacle Course',
          description: 'Kids crawl under red yarn "lasers" and jump over green pool noodle "kryptonite" to earn their Hero Certificate.',
          ingredientsOrMaterials: ['Red yarn', '2 green pool noodles', 'Printable superhero certificates'],
          prepTime: '20 mins setup',
          estimatedCost: 6
        }
      ],
      agentAdvice: [
        'Serve food immediately after the high-energy obstacle course while kids are catching their breath.',
        'Label juice pouches with kids names using a bold marker to avoid half-empty abandoned drinks.'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  },
  {
    brief: {
      id: 'template-wine-charcuterie',
      name: 'Chic Wine & Artisanal Charcuterie Night',
      eventType: 'cocktail',
      theme: 'Tuscan Vineyard & Artisanal Grazing',
      adultCount: 10,
      kidCount: 0,
      drinkersCount: 10,
      durationHours: 4,
      budget: 220,
      currency: '$',
      dietaryRestrictions: ['Gluten-Free Crackers Included'],
      vibe: 'luxe',
      venueType: 'home_indoor',
      prepTimeAvailable: 'low',
      specialRequests: 'Curated cheese board pairings, cured meats, artisan jams, and sommelier wine picks'
    },
    plan: {
      id: 'plan-wine-charcuterie',
      brief: {
        id: 'template-wine-charcuterie',
        name: 'Chic Wine & Artisanal Charcuterie Night',
        eventType: 'cocktail',
        theme: 'Tuscan Vineyard & Artisanal Grazing',
        adultCount: 10,
        kidCount: 0,
        drinkersCount: 10,
        durationHours: 4,
        budget: 220,
        currency: '$',
        dietaryRestrictions: ['Gluten-Free Crackers Included'],
        vibe: 'luxe',
        venueType: 'home_indoor',
        prepTimeAvailable: 'low',
        specialRequests: 'Curated cheese board pairings, cured meats, artisan jams, and sommelier wine picks'
      },
      tagline: 'Sommelier-Matched Vintages, European Fromagerie & Ambient Jazz',
      overview: 'An elegant, zero-cooking soirée. A lavish grazing table paired with 4 curated wine selections allows the host to mingle all evening with zero kitchen rush.',
      items: [
        {
          id: 'wc-1',
          name: 'Artisan Cheese Flight (Truffle Gouda, Aged Manchego, Creamy Brie, Gorgonzola)',
          category: 'food',
          quantity: '2.5 lbs total',
          numericQty: 1,
          unit: 'flight',
          estimatedUnitPrice: 38.00,
          estimatedTotalPrice: 38.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'wholesale_bulk',
          aisle: 'Specialty Cheese Case',
          dietaryTags: ['Vegetarian'],
          buyingTip: 'Bring cheese to room temperature 45 minutes before guests arrive for full aromatic flavor.'
        },
        {
          id: 'wc-2',
          name: 'Prosciutto di Parma, Genoa Salami & Bresaola',
          category: 'food',
          quantity: '1.5 lbs sliced',
          numericQty: 1,
          unit: 'pack',
          estimatedUnitPrice: 22.00,
          estimatedTotalPrice: 22.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Deli Counter',
          buyingTip: 'Fold prosciutto into loose ribbons for an effortless restaurant-grade presentation.'
        },
        {
          id: 'wc-3',
          name: 'Fig Jam, Honeycomb, Marcona Almonds & Castelvetrano Olives',
          category: 'food',
          quantity: '1 grazing jar kit',
          numericQty: 1,
          unit: 'kit',
          estimatedUnitPrice: 16.50,
          estimatedTotalPrice: 16.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Specialty Condiments & Nuts',
          dietaryTags: ['Gluten-Free', 'Vegan'],
          buyingTip: 'Bright green Castelvetrano olives offer a buttery, mild flavor loved even by non-olive eaters.'
        },
        {
          id: 'wc-4',
          name: 'Assorted Seeded Crackers, Sourdough Crisps & GF Crackers',
          category: 'food',
          quantity: '3 boxes',
          numericQty: 3,
          unit: 'boxes',
          estimatedUnitPrice: 4.50,
          estimatedTotalPrice: 13.50,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Cracker & Bread Aisle',
          dietaryTags: ['Includes GF Box'],
          buyingTip: 'Offer gluten-free crackers in a separate bowl to prevent crumb cross-contamination.'
        },
        {
          id: 'wc-b1',
          name: 'Curated Wine Flight: 2 Crisp Whites (Sauvignon/Pinot Grigio) & 3 Reds (Pinot Noir/Chianti)',
          category: 'beverages',
          quantity: '5 bottles (750ml)',
          numericQty: 5,
          unit: 'bottles',
          estimatedUnitPrice: 16.00,
          estimatedTotalPrice: 80.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'liquor_store',
          aisle: 'Italian & French Wines',
          buyingTip: 'Rule of thumb: 1 bottle per 2 adults for a 4-hour cocktail gathering.'
        },
        {
          id: 'wc-b2',
          name: 'San Pellegrino Sparkling Mineral Water (Glass Bottles)',
          category: 'beverages',
          quantity: '4 x 750ml bottles',
          numericQty: 4,
          unit: 'bottles',
          estimatedUnitPrice: 2.75,
          estimatedTotalPrice: 11.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'grocery',
          aisle: 'Imported Waters',
          dietaryTags: ['Non-Alcoholic'],
          buyingTip: 'Serve chilled with a slice of fresh lemon or cucumber.'
        },
        {
          id: 'wc-d1',
          name: 'Eucalyptus Greenery Runners & Unscented Taper Candles',
          category: 'decor',
          quantity: '2 runners + 6 candles',
          numericQty: 1,
          unit: 'bundle',
          estimatedUnitPrice: 18.00,
          estimatedTotalPrice: 18.00,
          priority: 'recommended',
          purchased: false,
          storeCategory: 'specialty_amazon',
          aisle: 'Floral & Candle Decor',
          buyingTip: 'Always use UNSCENTED candles near food so perfume does not clash with wine aromas.'
        },
        {
          id: 'wc-t1',
          name: 'Bamboo Tasting Cocktail Plates & Linen Feel Napkins',
          category: 'tableware',
          quantity: '30 plates + 40 napkins',
          numericQty: 1,
          unit: 'set',
          estimatedUnitPrice: 14.00,
          estimatedTotalPrice: 14.00,
          priority: 'must_have',
          purchased: false,
          storeCategory: 'party_store',
          aisle: 'Eco-Luxe Tableware',
          buyingTip: 'Lightweight palm or bamboo plates give an eco-luxury feel.'
        }
      ],
      portionBreakdown: {
        foodCalculation: {
          label: 'Cocktail Grazing Portions (10 Adults)',
          formula: '4-5 oz cheese + 2.5 oz charcuterie + 2 oz nuts/fruits per guest',
          recommendedTotal: '2.5 lbs artisan cheese, 1.5 lbs cured meats, 3 boxes crackers, 1 lb fresh berries/grapes',
          breakdown: [
            'Cheese: 4 oz per person ensures abundant boards through late evening',
            'Meats: Thinly sliced prosciutto folds cover large board surface area with high visual impact'
          ]
        },
        drinkCalculation: {
          totalDrinksNeeded: 25,
          alcoholicDrinks: 20,
          nonAlcoholicDrinks: 8,
          iceBagsLbs: 10,
          breakdown: [
            '5 Bottles of wine yield 25 standard 5oz pours (~2.5 glasses per person)',
            'Sparkling water: 1 glass per guest per hour',
            'Ice bucket for chilling white wines'
          ]
        },
        tablewareBufferMultiplier: 1.3
      },
      budgetSummary: {
        targetBudget: 220,
        estimatedTotal: 213.00,
        purchasedTotal: 0,
        categoryTotals: {
          food: 89.50,
          beverages: 91.00,
          decor: 18.00,
          tableware: 14.00,
          activities_favors: 0,
          prep_supplies: 0.50
        },
        savingsOpportunities: [
          'Purchase cheese variety blocks at Costco / Trader Joe’s and hand-cut at home.',
          'Buy wine by the 6-bottle case to receive standard 10-15% retail bottle discounts.'
        ]
      },
      timeline: [
        {
          id: 'tw-1',
          timeframe: 'T-2 Days',
          title: 'Pick Up Wine & Jars',
          tasks: ['Select wine bottles at store with case discount', 'Buy nuts, crackers, and olives'],
          completed: false
        },
        {
          id: 'tw-2',
          timeframe: 'Day-Of Afternoon',
          title: 'Assemble Grazing Board',
          tasks: ['Lay butcher paper or wooden boards across table', 'Arrange cheeses, meats, crackers, and fruit', 'Chill white wines'],
          completed: false
        },
        {
          id: 'tw-3',
          timeframe: '45 Mins Before',
          title: 'Uncork Reds & Light Taper Candles',
          tasks: ['Open red wine to breathe', 'Light unscented candles', 'Queue Bossa Nova / Jazz background playlist'],
          completed: false
        }
      ],
      signatureIdeas: [
        {
          id: 'sig-w-1',
          type: 'cocktail_mocktail',
          title: 'White Peach & Rosemary Bellini Welcome Sip',
          description: 'Greet arriving guests with a chilled flute of Prosecco topped with white peach purée and a fragrant rosemary sprig.',
          ingredientsOrMaterials: ['Prosecco', 'White Peach Puree', 'Fresh Rosemary'],
          prepTime: '2 mins',
          estimatedCost: 12
        }
      ],
      agentAdvice: [
        'Label each cheese on the board with small parchment tags so guests know the flavor profiles and allergens without asking.',
        'Keep extra crackers in an airtight container to refill the board when it gets low.'
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
];
