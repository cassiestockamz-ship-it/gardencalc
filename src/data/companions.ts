export interface CompanionPlant {
  name: string;
  icon: string;
  type: "vegetable" | "herb" | "flower";
  companions: string[];
  foes: string[];
  notes: string;
}

export const COMPANION_PLANTS: CompanionPlant[] = [
  { name: "Tomato", icon: "🍅", type: "vegetable", companions: ["Basil", "Carrot", "Parsley", "Marigold", "Borage", "Chives", "Garlic", "Celery", "Pepper"], foes: ["Cabbage", "Fennel", "Potato", "Corn", "Dill", "Kohlrabi"], notes: "Basil repels aphids and improves flavor" },
  { name: "Pepper", icon: "🌶️", type: "vegetable", companions: ["Tomato", "Basil", "Carrot", "Onion", "Parsley", "Marigold", "Spinach"], foes: ["Fennel", "Kohlrabi", "Bean"], notes: "Benefits from same companions as tomato" },
  { name: "Cucumber", icon: "🥒", type: "vegetable", companions: ["Bean", "Corn", "Pea", "Radish", "Sunflower", "Lettuce", "Dill", "Marigold"], foes: ["Potato", "Sage", "Mint", "Melon"], notes: "Beans fix nitrogen cucumbers need" },
  { name: "Carrot", icon: "🥕", type: "vegetable", companions: ["Tomato", "Lettuce", "Chives", "Onion", "Leek", "Rosemary", "Sage", "Pea"], foes: ["Dill", "Parsnip", "Celery"], notes: "Onions repel carrot fly" },
  { name: "Lettuce", icon: "🥬", type: "vegetable", companions: ["Carrot", "Radish", "Strawberry", "Chives", "Garlic", "Bean", "Beet", "Onion"], foes: ["Celery", "Parsley"], notes: "Good living mulch under tall plants" },
  { name: "Bean", icon: "🫘", type: "vegetable", companions: ["Corn", "Squash", "Cucumber", "Celery", "Potato", "Carrot", "Lettuce", "Marigold", "Radish"], foes: ["Onion", "Garlic", "Chives", "Leek", "Pepper", "Fennel"], notes: "Fixes nitrogen for neighboring plants" },
  { name: "Corn", icon: "🌽", type: "vegetable", companions: ["Bean", "Squash", "Pumpkin", "Cucumber", "Pea", "Melon", "Sunflower"], foes: ["Tomato", "Celery"], notes: "Three Sisters: corn + bean + squash" },
  { name: "Squash", icon: "🎃", type: "vegetable", companions: ["Corn", "Bean", "Marigold", "Nasturtium", "Radish", "Borage"], foes: ["Potato", "Fennel"], notes: "Large leaves shade out weeds" },
  { name: "Potato", icon: "🥔", type: "vegetable", companions: ["Bean", "Corn", "Cabbage", "Horseradish", "Marigold", "Pea"], foes: ["Tomato", "Cucumber", "Squash", "Sunflower", "Raspberry"], notes: "Keep away from tomato family (blight)" },
  { name: "Onion", icon: "🧅", type: "vegetable", companions: ["Carrot", "Lettuce", "Tomato", "Beet", "Pepper", "Strawberry", "Chamomile"], foes: ["Bean", "Pea", "Asparagus", "Sage"], notes: "Strong scent deters many pests" },
  { name: "Garlic", icon: "🧄", type: "vegetable", companions: ["Tomato", "Pepper", "Carrot", "Beet", "Rose", "Fruit Trees", "Lettuce"], foes: ["Bean", "Pea", "Asparagus", "Sage", "Strawberry"], notes: "Natural fungicide, deters aphids" },
  { name: "Broccoli", icon: "🥦", type: "vegetable", companions: ["Beet", "Celery", "Chamomile", "Dill", "Mint", "Onion", "Oregano", "Potato", "Rosemary", "Sage"], foes: ["Strawberry", "Tomato", "Pepper", "Bean"], notes: "Brassicas benefit from aromatic herbs" },
  { name: "Cabbage", icon: "🥬", type: "vegetable", companions: ["Beet", "Celery", "Dill", "Onion", "Potato", "Chamomile", "Thyme", "Mint"], foes: ["Strawberry", "Tomato", "Grape", "Bean"], notes: "Thyme and mint repel cabbage moth" },
  { name: "Pea", icon: "🟢", type: "vegetable", companions: ["Carrot", "Corn", "Cucumber", "Radish", "Turnip", "Bean", "Potato", "Mint"], foes: ["Onion", "Garlic", "Leek", "Chives"], notes: "Fixes nitrogen, good predecessor crop" },
  { name: "Radish", icon: "🔴", type: "vegetable", companions: ["Carrot", "Lettuce", "Pea", "Cucumber", "Spinach", "Bean", "Nasturtium"], foes: ["Hyssop", "Grape"], notes: "Fast trap crop for flea beetles" },
  { name: "Spinach", icon: "🥬", type: "vegetable", companions: ["Strawberry", "Pea", "Bean", "Celery", "Cauliflower", "Radish"], foes: ["Fennel"], notes: "Grows well in partial shade of taller plants" },
  { name: "Beet", icon: "🟣", type: "vegetable", companions: ["Onion", "Lettuce", "Cabbage", "Garlic", "Mint", "Catnip"], foes: ["Bean", "Mustard"], notes: "Leaves are edible too — harvest both" },
  { name: "Eggplant", icon: "🍆", type: "vegetable", companions: ["Bean", "Pepper", "Spinach", "Marigold", "Thyme", "Tarragon"], foes: ["Fennel", "Walnut"], notes: "Benefits from same companions as pepper" },
  { name: "Kale", icon: "🥬", type: "vegetable", companions: ["Beet", "Celery", "Cucumber", "Dill", "Garlic", "Onion", "Lettuce", "Potato"], foes: ["Strawberry", "Tomato", "Bean"], notes: "Aromatic herbs deter pests" },
  { name: "Zucchini", icon: "🥒", type: "vegetable", companions: ["Corn", "Bean", "Nasturtium", "Marigold", "Radish", "Borage", "Dill"], foes: ["Potato", "Fennel"], notes: "Nasturtiums trap aphids away" },

  // Herbs
  { name: "Basil", icon: "🌿", type: "herb", companions: ["Tomato", "Pepper", "Oregano", "Asparagus", "Marigold"], foes: ["Sage", "Rue", "Thyme"], notes: "Repels flies and mosquitoes" },
  { name: "Dill", icon: "🌿", type: "herb", companions: ["Cabbage", "Lettuce", "Onion", "Cucumber", "Broccoli"], foes: ["Carrot", "Tomato"], notes: "Attracts beneficial insects" },
  { name: "Cilantro", icon: "🌿", type: "herb", companions: ["Tomato", "Spinach", "Pea", "Bean", "Anise"], foes: ["Fennel", "Dill"], notes: "Attracts hoverflies that eat aphids" },
  { name: "Parsley", icon: "🌿", type: "herb", companions: ["Tomato", "Asparagus", "Corn", "Rose", "Carrot"], foes: ["Lettuce", "Mint"], notes: "Attracts beneficial wasps" },
  { name: "Mint", icon: "🌿", type: "herb", companions: ["Cabbage", "Tomato", "Pea", "Beet"], foes: ["Parsley", "Chamomile"], notes: "ALWAYS grow in containers — very invasive" },
  { name: "Rosemary", icon: "🌿", type: "herb", companions: ["Carrot", "Cabbage", "Bean", "Sage", "Broccoli"], foes: ["Cucumber", "Pumpkin"], notes: "Repels cabbage moth and carrot fly" },
  { name: "Thyme", icon: "🌿", type: "herb", companions: ["Cabbage", "Tomato", "Eggplant", "Strawberry", "Rose"], foes: ["Basil"], notes: "Deters cabbage worm" },
  { name: "Sage", icon: "🌿", type: "herb", companions: ["Rosemary", "Cabbage", "Carrot", "Tomato", "Strawberry"], foes: ["Cucumber", "Onion", "Basil", "Rue"], notes: "Repels cabbage moth and carrot fly" },
  { name: "Chives", icon: "🌿", type: "herb", companions: ["Carrot", "Tomato", "Rose", "Apple", "Lettuce"], foes: ["Bean", "Pea"], notes: "Deters aphids and Japanese beetles" },

  // Flowers
  { name: "Marigold", icon: "🌼", type: "flower", companions: ["Tomato", "Pepper", "Cucumber", "Squash", "Bean", "Potato", "Rose"], foes: ["Cabbage"], notes: "Repels nematodes, whiteflies, and aphids" },
  { name: "Nasturtium", icon: "🌸", type: "flower", companions: ["Squash", "Cucumber", "Radish", "Cabbage", "Bean", "Tomato"], foes: [], notes: "Excellent trap crop for aphids" },
  { name: "Sunflower", icon: "🌻", type: "flower", companions: ["Cucumber", "Corn", "Bean", "Lettuce", "Squash"], foes: ["Potato", "Bean"], notes: "Attracts pollinators, provides support for vines" },
  { name: "Borage", icon: "🌸", type: "flower", companions: ["Tomato", "Squash", "Strawberry", "Cabbage"], foes: [], notes: "Attracts pollinators, deters tomato hornworm" },
];
