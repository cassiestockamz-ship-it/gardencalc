/**
 * Fruit variety chill hour requirements.
 * Sources: UC Davis Fruit & Nut Research Center, Dave Wilson Nursery,
 * Stark Bros, University of Florida IFAS Extension, Rutgers NJAES.
 *
 * Chill hour definition used here: hours <= 45°F between Nov 1 and Feb 28.
 * (The "0-45 model" — the most widely published and permissive standard.)
 */
export interface Variety {
  name: string;
  fruit: string;
  minHours: number;
  notes?: string;
}

export const VARIETIES: Variety[] = [
  // Apples — low chill
  { name: "Anna Apple", fruit: "Apple", minHours: 200, notes: "Extreme low-chill, Florida/Southern CA" },
  { name: "Dorsett Golden Apple", fruit: "Apple", minHours: 250 },
  { name: "Tropic Sweet Apple", fruit: "Apple", minHours: 300 },
  { name: "Pink Lady Apple", fruit: "Apple", minHours: 400 },
  { name: "Fuji Apple", fruit: "Apple", minHours: 500 },
  // Apples — medium to high chill
  { name: "Gala Apple", fruit: "Apple", minHours: 600 },
  { name: "Granny Smith Apple", fruit: "Apple", minHours: 700 },
  { name: "Red Delicious Apple", fruit: "Apple", minHours: 700 },
  { name: "McIntosh Apple", fruit: "Apple", minHours: 800 },
  { name: "Honeycrisp Apple", fruit: "Apple", minHours: 800, notes: "Needs northern cold" },
  { name: "Braeburn Apple", fruit: "Apple", minHours: 700 },

  // Peaches
  { name: "Florida Prince Peach", fruit: "Peach", minHours: 150 },
  { name: "Tropic Beauty Peach", fruit: "Peach", minHours: 150 },
  { name: "UFGold Peach", fruit: "Peach", minHours: 200 },
  { name: "Mid-Pride Peach", fruit: "Peach", minHours: 250 },
  { name: "Babcock Peach", fruit: "Peach", minHours: 250 },
  { name: "Tropic Snow Peach", fruit: "Peach", minHours: 200 },
  { name: "Elberta Peach", fruit: "Peach", minHours: 800 },
  { name: "Redhaven Peach", fruit: "Peach", minHours: 950 },
  { name: "Belle of Georgia Peach", fruit: "Peach", minHours: 850 },

  // Cherries
  { name: "Minnie Royal Cherry", fruit: "Cherry", minHours: 250, notes: "Low-chill sweet cherry" },
  { name: "Royal Lee Cherry", fruit: "Cherry", minHours: 250 },
  { name: "Bing Cherry", fruit: "Cherry", minHours: 700 },
  { name: "Rainier Cherry", fruit: "Cherry", minHours: 700 },
  { name: "Stella Cherry", fruit: "Cherry", minHours: 400 },
  { name: "Montmorency Tart Cherry", fruit: "Cherry", minHours: 1000 },

  // Pears
  { name: "Bartlett Pear", fruit: "Pear", minHours: 800 },
  { name: "Anjou Pear", fruit: "Pear", minHours: 800 },
  { name: "Hood Pear", fruit: "Pear", minHours: 200, notes: "Low-chill" },
  { name: "Flordahome Pear", fruit: "Pear", minHours: 150 },

  // Plums
  { name: "Santa Rosa Plum", fruit: "Plum", minHours: 300 },
  { name: "Methley Plum", fruit: "Plum", minHours: 250 },
  { name: "Stanley Plum", fruit: "Plum", minHours: 800 },

  // Apricots
  { name: "Blenheim Apricot", fruit: "Apricot", minHours: 500 },
  { name: "Gold Kist Apricot", fruit: "Apricot", minHours: 300 },

  // Blueberries
  { name: "Southern Highbush Blueberry", fruit: "Blueberry", minHours: 250 },
  { name: "Rabbiteye Blueberry", fruit: "Blueberry", minHours: 350 },
  { name: "Northern Highbush Blueberry", fruit: "Blueberry", minHours: 800 },

  // Figs (very low chill)
  { name: "Black Mission Fig", fruit: "Fig", minHours: 100 },
  { name: "Brown Turkey Fig", fruit: "Fig", minHours: 100 },
];

export const FRUITS = Array.from(new Set(VARIETIES.map((v) => v.fruit))).sort();
