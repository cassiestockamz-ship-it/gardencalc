"use client";

import { useState, useMemo } from "react";
import CalculatorLayout from "@/components/CalculatorLayout";
import SelectInput from "@/components/SelectInput";
import CalculatorSchema from "@/components/CalculatorSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RelatedCalculators from "@/components/RelatedCalculators";
import EmailCapture from "@/components/EmailCapture";
import { VEGETABLES } from "@/data/vegetables";

/* ────────── Symptom options ────────── */

const SYMPTOMS = [
  { value: "holes", label: "Holes in leaves" },
  { value: "yellowing", label: "Yellowing leaves" },
  { value: "wilting", label: "Wilting" },
  { value: "stunted", label: "Stunted growth" },
  { value: "fruit", label: "Fruit damage" },
  { value: "rootdamage", label: "Root damage" },
  { value: "powder", label: "White powder on leaves" },
  { value: "sticky", label: "Sticky residue" },
];

/* ────────── Pest database ────────── */

interface PestEntry {
  name: string;
  symptom: string;
  affectsAll: boolean;
  plants: string[]; // matched against vegetable names (lowercase partial match)
  description: string;
  organicSolution: string;
  prevention: string;
  companionTip?: string;
}

const PEST_DATABASE: PestEntry[] = [
  // Holes in leaves
  {
    name: "Cabbage Worms",
    symptom: "holes",
    affectsAll: false,
    plants: ["broccoli", "cabbage", "cauliflower", "kale", "brussels sprouts"],
    description:
      "Green caterpillars (larvae of white butterflies) that chew large, irregular holes in brassica leaves. They hide on the undersides of leaves and can defoliate plants quickly.",
    organicSolution:
      "Apply Bt (Bacillus thuringiensis) spray every 7 to 10 days. Hand-pick caterpillars daily. Use neem oil as a deterrent.",
    prevention:
      "Cover plants with floating row covers immediately after transplanting. Inspect leaves weekly, especially undersides.",
    companionTip:
      "Plant dill, thyme, or mint nearby to attract parasitic wasps that prey on cabbage worms.",
  },
  {
    name: "Flea Beetles",
    symptom: "holes",
    affectsAll: true,
    plants: [],
    description:
      "Tiny, dark, jumping beetles that create small, round \"shothole\" patterns in leaves. They are especially damaging to seedlings and young transplants.",
    organicSolution:
      "Dust leaves with diatomaceous earth after every rain. Spray with neem oil or kaolin clay. Sticky traps help monitor populations.",
    prevention:
      "Use row covers on newly planted seedlings. Keep the garden free of debris where adults overwinter. Delay planting until soil warms.",
    companionTip:
      "Interplant with basil or catnip, which can help repel flea beetles.",
  },
  {
    name: "Slugs",
    symptom: "holes",
    affectsAll: false,
    plants: ["lettuce", "spinach", "kale", "swiss chard", "arugula", "cabbage"],
    description:
      "Soft-bodied mollusks that feed at night, leaving large ragged holes and silvery slime trails on leaves. They thrive in moist, shady conditions.",
    organicSolution:
      "Set beer traps (shallow dishes of beer) near affected plants. Sprinkle iron-phosphate slug bait around beds. Hand-pick slugs after dark.",
    prevention:
      "Water in the morning so soil dries by evening. Remove mulch from directly around stems. Copper tape around bed edges creates a barrier.",
  },
  {
    name: "Japanese Beetles",
    symptom: "holes",
    affectsAll: false,
    plants: ["green bean (bush)", "green bean (pole)", "basil"],
    description:
      "Metallic green and copper beetles that skeletonize leaves by eating tissue between veins. They feed in groups and are most active on warm, sunny days.",
    organicSolution:
      "Hand-pick beetles into a bucket of soapy water in the morning when they are sluggish. Apply milky spore to lawns to kill grubs. Neem oil spray deters feeding.",
    prevention:
      "Avoid Japanese beetle traps near the garden (they attract more beetles than they catch). Apply beneficial nematodes to soil in late summer to target grubs.",
    companionTip:
      "Plant garlic or chives near susceptible plants to help repel Japanese beetles.",
  },
  // Yellowing leaves
  {
    name: "Aphids",
    symptom: "yellowing",
    affectsAll: true,
    plants: [],
    description:
      "Tiny, soft-bodied insects (green, black, or white) that cluster on new growth and leaf undersides, sucking plant sap. They reproduce extremely fast in warm weather.",
    organicSolution:
      "Blast plants with a strong stream of water to knock aphids off. Spray insecticidal soap or neem oil. Release ladybugs or lacewings as biological control.",
    prevention:
      "Avoid over-fertilizing with nitrogen, which produces the tender growth aphids prefer. Inspect plants weekly throughout the growing season.",
    companionTip:
      "Plant marigolds, nasturtiums, or dill nearby. Marigolds repel aphids, while nasturtiums act as a trap crop, luring aphids away from your vegetables.",
  },
  {
    name: "Whiteflies",
    symptom: "yellowing",
    affectsAll: false,
    plants: ["tomato", "pepper", "eggplant"],
    description:
      "Tiny white flying insects that gather on leaf undersides and scatter when disturbed. They suck plant sap and excrete sticky honeydew, often leading to sooty mold.",
    organicSolution:
      "Use yellow sticky traps near plants. Spray neem oil or insecticidal soap, targeting the undersides of leaves. Introduce Encarsia formosa parasitic wasps.",
    prevention:
      "Inspect transplants carefully before introducing them to your garden. Remove heavily infested leaves promptly. Maintain good air circulation.",
  },
  {
    name: "Nutrient Deficiency",
    symptom: "yellowing",
    affectsAll: true,
    plants: [],
    description:
      "Yellowing leaves are often caused by lack of nitrogen (older leaves yellow first) or iron (new leaves yellow while veins stay green). This is not a pest but a common misdiagnosis.",
    organicSolution:
      "Test your soil pH and nutrient levels. Amend with compost, blood meal (nitrogen), or chelated iron as needed. Side-dress with balanced organic fertilizer.",
    prevention:
      "Maintain soil organic matter by adding compost annually. Ensure proper soil pH (6.0 to 7.0 for most vegetables). Use our fertilizer calculator for custom recommendations.",
  },
  {
    name: "Spider Mites",
    symptom: "yellowing",
    affectsAll: false,
    plants: ["green bean (bush)", "green bean (pole)", "cucumber", "eggplant"],
    description:
      "Microscopic mites that create fine webbing on leaf undersides and cause stippled, yellowed leaves. They thrive in hot, dry conditions and can explode in population quickly.",
    organicSolution:
      "Spray plants with water to increase humidity and dislodge mites. Apply neem oil or insecticidal soap every 5 to 7 days. Release predatory mites (Phytoseiulus persimilis).",
    prevention:
      "Keep plants well-watered during dry spells. Avoid dusty conditions near the garden. Remove and destroy heavily infested plant material.",
  },
  // Wilting
  {
    name: "Squash Vine Borers",
    symptom: "wilting",
    affectsAll: false,
    plants: ["zucchini", "squash (winter)", "pumpkin"],
    description:
      "Moth larvae that bore into squash stems at the base, causing sudden wilting of individual vines. You may see sawdust-like frass at the entry hole.",
    organicSolution:
      "Slit the stem lengthwise with a razor to find and remove the larva, then bury the damaged stem in moist soil to encourage re-rooting. Inject Bt directly into stems with a syringe.",
    prevention:
      "Wrap the base of stems with aluminum foil or nylon stockings to block egg-laying. Use row covers until flowering. Plant a second succession in mid-summer to replace damaged plants.",
    companionTip:
      "Interplant with radishes or nasturtiums, which may help deter egg-laying adults.",
  },
  {
    name: "Root Rot (Overwatering)",
    symptom: "wilting",
    affectsAll: true,
    plants: [],
    description:
      "A fungal condition caused by waterlogged soil. Plants wilt despite having moist soil, and roots turn brown and mushy. It is not an insect pest but often mistaken for one.",
    organicSolution:
      "Reduce watering immediately. Improve soil drainage by adding perlite or coarse compost. Remove severely affected plants to prevent spread. Treat soil with a mycorrhizal inoculant.",
    prevention:
      "Use raised beds with well-draining soil. Water deeply but infrequently rather than giving shallow daily waterings. Ensure containers have adequate drainage holes.",
  },
  {
    name: "Bacterial Wilt",
    symptom: "wilting",
    affectsAll: false,
    plants: ["cucumber", "watermelon", "zucchini"],
    description:
      "Spread by cucumber beetles, this bacterial disease causes rapid, irreversible wilting. Cut a wilted stem and touch the sap; if it is stringy and milky, bacterial wilt is the cause.",
    organicSolution:
      "There is no cure for infected plants. Remove and destroy them immediately. Control cucumber beetles with neem oil, kaolin clay, or hand-picking.",
    prevention:
      "Use row covers to exclude cucumber beetles until plants flower. Choose resistant varieties when available. Rotate crops yearly.",
    companionTip:
      "Plant tansy or catnip near cucurbits to help repel cucumber beetles.",
  },
  {
    name: "Tomato Hornworm",
    symptom: "wilting",
    affectsAll: false,
    plants: ["tomato", "pepper", "eggplant"],
    description:
      "Large green caterpillars (up to 4 inches) with white diagonal stripes and a horn on the rear. They can strip a tomato plant of leaves and damage fruit in just a few days.",
    organicSolution:
      "Hand-pick hornworms (check in early morning). Apply Bt spray to foliage. If you find a hornworm covered in white cocoons, leave it: those are parasitic wasp eggs that will kill it.",
    prevention:
      "Till soil in fall to destroy overwintering pupae. Rotate nightshade crops annually. Use a black light at night to spot hornworms (they glow under UV).",
    companionTip:
      "Plant borage or dill near tomatoes to attract parasitic wasps that prey on hornworms.",
  },
  // Stunted growth
  {
    name: "Nematodes",
    symptom: "stunted",
    affectsAll: false,
    plants: ["carrot", "beet", "radish", "potato", "turnip", "parsnip", "sweet potato"],
    description:
      "Microscopic roundworms that attack plant roots, causing galls, knots, and stunted growth above ground. Affected roots look lumpy and misshapen.",
    organicSolution:
      "Solarize soil by covering it with clear plastic for 4 to 6 weeks in summer. Plant resistant varieties. Add chitin-based amendments to encourage nematode-eating fungi.",
    prevention:
      "Rotate root crops on a 3 to 4 year cycle. Incorporate lots of organic matter to support beneficial soil organisms that prey on nematodes.",
    companionTip:
      "Plant marigolds (especially French marigolds) as a cover crop or border. Their roots release compounds toxic to root-knot nematodes.",
  },
  {
    name: "Poor Soil",
    symptom: "stunted",
    affectsAll: true,
    plants: [],
    description:
      "Compacted, nutrient-depleted, or poorly draining soil is one of the most common causes of stunted growth. It is often mistaken for pest or disease damage.",
    organicSolution:
      "Amend soil with 2 to 4 inches of compost. Aerate compacted beds with a broadfork. Get a soil test to identify specific deficiencies and correct pH.",
    prevention:
      "Add compost every spring. Use cover crops in the off-season. Avoid walking on garden beds, which compacts soil. Mulch to maintain soil structure.",
  },
  {
    name: "Cutworms",
    symptom: "stunted",
    affectsAll: true,
    plants: [],
    description:
      "Fat, gray-brown caterpillars that curl around and sever seedling stems at the soil line, typically at night. Entire young plants are cut down overnight.",
    organicSolution:
      "Place cardboard or toilet paper tube collars around seedling stems, pushed 1 inch into soil. Sprinkle diatomaceous earth around plant bases. Hand-pick cutworms from soil at dusk.",
    prevention:
      "Clear garden beds of weeds and debris in early spring before planting. Till soil to expose overwintering larvae to predators. Apply beneficial nematodes (Steinernema spp.) to soil.",
    companionTip:
      "Interplant with tansy or plant sunflowers at bed edges to attract ground beetles that eat cutworms.",
  },
  // Fruit damage
  {
    name: "Tomato Hornworm (Fruit)",
    symptom: "fruit",
    affectsAll: false,
    plants: ["tomato"],
    description:
      "In addition to defoliating plants, hornworms chew large, deep holes in ripening tomatoes. Damage often appears on the shoulder or top of the fruit.",
    organicSolution:
      "Hand-pick hornworms daily. Apply Bt spray to foliage and fruit. Harvest tomatoes as soon as they begin to color and ripen indoors.",
    prevention:
      "Till soil in fall to destroy pupae. Use row covers until plants are established. Inspect plants every morning during peak season (July through August).",
    companionTip:
      "Plant basil alongside tomatoes. Some gardeners report that basil helps repel hornworm moths.",
  },
  {
    name: "Corn Earworm",
    symptom: "fruit",
    affectsAll: false,
    plants: ["sweet corn", "tomato", "pepper"],
    description:
      "Caterpillars that enter through the silk of corn ears, feeding on kernels from the tip downward. They also bore into tomatoes and peppers. Look for frass at entry holes.",
    organicSolution:
      "Apply a few drops of mineral oil or Bt to corn silk tips 3 to 5 days after silk appears. Use Trichogramma wasp releases for biological control.",
    prevention:
      "Plant corn varieties with tight husks. Time plantings to avoid peak moth flights (mid-summer in most areas). Remove and destroy affected ears promptly.",
  },
  {
    name: "Stink Bugs",
    symptom: "fruit",
    affectsAll: false,
    plants: ["tomato", "pepper", "green bean (bush)", "green bean (pole)"],
    description:
      "Shield-shaped bugs that pierce fruit and inject enzymes, causing pale, spongy spots on tomatoes and dimpled, discolored areas on peppers and beans.",
    organicSolution:
      "Hand-pick into soapy water (handle gently to avoid the stink). Spray kaolin clay on fruit as a physical barrier. Use trap crops like sunflowers to lure them away.",
    prevention:
      "Keep garden edges mowed and free of weeds where stink bugs overwinter. Row covers on smaller plantings can exclude them. Remove garden debris in fall.",
    companionTip:
      "Plant marigolds or lavender near susceptible crops. Their strong scent may help mask the plants stink bugs are seeking.",
  },
  // Root damage
  {
    name: "Root Maggots",
    symptom: "rootdamage",
    affectsAll: false,
    plants: ["carrot", "radish", "turnip", "onion", "cabbage", "broccoli"],
    description:
      "Small white larvae of root flies that tunnel into root crops, causing brown channels and making roots inedible. Plants may wilt or yellow above ground.",
    organicSolution:
      "Apply beneficial nematodes (Steinernema feltiae) to soil. Sprinkle diatomaceous earth around plant bases. Remove and destroy infested roots immediately.",
    prevention:
      "Use lightweight row covers from planting through harvest. Rotate root crops yearly. Delay planting carrots until late May to avoid the first generation of root fly.",
    companionTip:
      "Interplant with onions or garlic when growing carrots. The strong scent confuses carrot rust flies looking for host plants.",
  },
  {
    name: "Wireworms",
    symptom: "rootdamage",
    affectsAll: false,
    plants: ["potato", "carrot", "beet", "sweet potato", "onion", "sweet corn"],
    description:
      "Hard, shiny, orange-brown larvae of click beetles that bore into roots, tubers, and seeds underground. Infestations are worst in newly broken ground or former grassland.",
    organicSolution:
      "Set bait traps by burying chunks of potato or carrot on a stick. Check every few days, destroy collected wireworms. Apply beneficial nematodes to soil.",
    prevention:
      "Rotate crops and till frequently to expose larvae to birds and weather. Avoid planting root crops in the first year of converting lawn or pasture to garden.",
  },
  {
    name: "Grubs (White Grubs)",
    symptom: "rootdamage",
    affectsAll: true,
    plants: [],
    description:
      "C-shaped white larvae of various beetles (Japanese beetle, June bug, chafer) that feed on roots in soil. Plants yellow, wilt, or die despite adequate watering.",
    organicSolution:
      "Apply milky spore (for Japanese beetle grubs) or beneficial nematodes (Heterorhabditis bacteriophora) to soil. Hand-remove grubs found during digging.",
    prevention:
      "Keep lawn areas around the garden treated with milky spore or nematodes. Avoid outdoor lighting near the garden at night, which attracts egg-laying beetles.",
  },
  // White powder
  {
    name: "Powdery Mildew",
    symptom: "powder",
    affectsAll: false,
    plants: ["zucchini", "squash (winter)", "cucumber", "pea", "pumpkin"],
    description:
      "A fungal disease that appears as white, powdery patches on leaf surfaces. It reduces photosynthesis and weakens plants but rarely kills them outright.",
    organicSolution:
      "Spray a solution of 1 tablespoon baking soda + 1 teaspoon liquid soap per gallon of water. Apply neem oil weekly. Remove and destroy heavily infected leaves.",
    prevention:
      "Plant resistant varieties. Space plants for good air circulation. Water at the base of plants, not overhead. Avoid working among wet foliage.",
    companionTip:
      "Plant garlic or chives near susceptible crops. Garlic spray (blended garlic in water, strained) can also be applied directly as a preventive.",
  },
  // Sticky residue
  {
    name: "Aphids (Sticky)",
    symptom: "sticky",
    affectsAll: true,
    plants: [],
    description:
      "Aphids excrete honeydew, a sweet, sticky substance that coats leaves and attracts ants and sooty mold. Sticky residue on leaves is one of the first signs of an aphid infestation.",
    organicSolution:
      "Spray with insecticidal soap or neem oil. Blast plants with a strong stream of water. Release ladybugs or lacewing larvae for biological control.",
    prevention:
      "Check new transplants and starts for aphids before planting. Encourage beneficial insects by planting alyssum, fennel, and yarrow nearby.",
    companionTip:
      "Marigolds and nasturtiums planted throughout the garden help deter or trap aphids. Dill and fennel attract hoverflies that eat aphids.",
  },
  {
    name: "Scale Insects",
    symptom: "sticky",
    affectsAll: false,
    plants: ["citrus", "basil", "pepper", "eggplant"],
    description:
      "Small, immobile insects that attach to stems and leaves under waxy, shell-like coverings. They suck plant sap and produce honeydew, leading to sticky leaves and sooty mold.",
    organicSolution:
      "Scrape off visible scale with a soft brush or cloth. Apply horticultural oil or neem oil to smother them. For severe infestations, prune and destroy affected branches.",
    prevention:
      "Inspect plants regularly, especially along stems and leaf joints. Avoid over-fertilizing, which promotes the soft growth scale insects prefer.",
  },
  {
    name: "Whiteflies (Sticky)",
    symptom: "sticky",
    affectsAll: false,
    plants: ["tomato", "pepper", "eggplant", "cucumber"],
    description:
      "Whiteflies produce large amounts of sticky honeydew that coats leaves below feeding sites. Shake the plant gently: if tiny white flies scatter, whiteflies are the cause.",
    organicSolution:
      "Hang yellow sticky traps above plant canopy. Spray neem oil or insecticidal soap weekly, targeting leaf undersides. Vacuum adults off plants in early morning.",
    prevention:
      "Use reflective mulch (aluminum foil or silver plastic) around plants to confuse whiteflies. Introduce Encarsia formosa parasitic wasps in greenhouses.",
  },
];

/* ────────── FAQ data (inline) ────────── */

const pestGuideFAQ = [
  {
    question: "What are the most common garden pests for beginners to watch for?",
    answer:
      "The five most common garden pests are aphids, cabbage worms, slugs, tomato hornworms, and flea beetles. Aphids affect nearly every vegetable and are easy to spot in clusters on new growth. Cabbage worms target all brassicas (broccoli, kale, cabbage). Slugs attack leafy greens, especially in moist conditions. Tomato hornworms can strip tomato plants overnight. Flea beetles create tiny holes in leaves of seedlings across many crops. Regular weekly inspection is the best defense against all of them.",
  },
  {
    question: "Is neem oil safe to use on vegetable gardens?",
    answer:
      "Yes, neem oil is considered safe for vegetable gardens when used as directed. It is derived from the neem tree and works as both a repellent and a growth disruptor for many soft-bodied insects. Apply it in the evening to avoid harming beneficial pollinators (it breaks down in sunlight within a few days). Do not spray neem oil on plants during peak heat or direct sun, as it can burn leaves. Wash produce before eating, though neem oil residues are classified as non-toxic by the EPA.",
  },
  {
    question: "How do I tell the difference between pest damage and disease?",
    answer:
      "Pest damage typically shows physical removal of plant tissue: holes, chewed edges, tunnels, or missing sections. You can often find the pest itself, its eggs, or its frass (droppings). Disease damage tends to show as discoloration (spots, rings, streaks), wilting without visible cause, fuzzy or powdery growth on surfaces, or rotting tissue. Some conditions overlap: for example, aphids spread viral diseases, and slug damage can allow fungal infections to enter. When in doubt, look for the pest first, because pest damage is easier to confirm visually.",
  },
  {
    question: "Do companion plants really help with pest control?",
    answer:
      "Yes, companion planting for pest control has both traditional and scientific support. Marigolds are one of the best-documented examples: French marigolds (Tagetes patula) release alpha-terthienyl from their roots, which is toxic to root-knot nematodes. Basil planted near tomatoes may help repel thrips and whiteflies. Nasturtiums work as trap crops, luring aphids away from vegetables. The effect is usually a reduction in pest pressure rather than complete elimination, so companion planting works best as one layer in an integrated pest management approach.",
  },
  {
    question: "When should I use diatomaceous earth in the garden?",
    answer:
      "Apply food-grade diatomaceous earth (DE) when you see flea beetles, slugs, cutworms, or other crawling insects on or around your plants. Dust it on dry foliage and around the base of plants in the morning after dew has dried. DE works by physically damaging the exoskeletons of insects, causing them to dehydrate. It must be reapplied after rain or heavy watering because it becomes ineffective when wet. Wear a dust mask during application to avoid inhaling the fine particles. DE does not distinguish between pests and beneficials, so avoid applying it to flowers where pollinators are active.",
  },
];

/* ────────── Component ────────── */

export default function PestGuidePage() {
  const [selectedPlant, setSelectedPlant] = useState(VEGETABLES[0].name);
  const [selectedSymptom, setSelectedSymptom] = useState("holes");
  const [expandedPest, setExpandedPest] = useState<string | null>(null);

  const plantOptions = VEGETABLES.map((v) => ({
    value: v.name,
    label: `${v.icon} ${v.name}`,
  }));

  const symptomOptions = SYMPTOMS;

  /* Filter pests by symptom + plant */
  const results = useMemo(() => {
    const plantLower = selectedPlant.toLowerCase();
    return PEST_DATABASE.filter((pest) => {
      if (pest.symptom !== selectedSymptom) return false;
      if (pest.affectsAll) return true;
      return pest.plants.some((p) => plantLower.includes(p) || p.includes(plantLower));
    });
  }, [selectedPlant, selectedSymptom]);

  const toggleExpand = (name: string) => {
    setExpandedPest((prev) => (prev === name ? null : name));
  };

  return (
    <CalculatorLayout
      title="Garden Pest Identification Guide"
      description="Identify common garden pests by plant and symptom. Get organic solutions, prevention tips, and companion planting strategies for every pest."
      lastUpdated="March 2026"
      intro="Catching pest problems early is the key to protecting your harvest. Select your plant and the symptom you are seeing, and this guide will show you the most likely culprits along with proven organic solutions and prevention strategies."
    >
      <CalculatorSchema
        name="Garden Pest Identification Guide"
        description="Interactive pest identification tool for vegetable gardens. Select a plant and symptom to find likely pests, organic solutions, and prevention tips."
        url="https://plantingcalc.com/pest-guide"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://plantingcalc.com" },
          { name: "Pest Guide", url: "https://plantingcalc.com/pest-guide" },
        ]}
      />

      {/* Inputs */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <SelectInput
          label="Select Your Plant"
          value={selectedPlant}
          onChange={setSelectedPlant}
          options={plantOptions}
        />
        <SelectInput
          label="What Symptom Are You Seeing?"
          value={selectedSymptom}
          onChange={setSelectedSymptom}
          options={symptomOptions}
        />
      </div>

      {/* Results */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-bold text-[var(--color-text)]">
          {results.length > 0
            ? `${results.length} Likely ${results.length === 1 ? "Cause" : "Causes"} Found`
            : "No Common Pests Match"}
        </h2>

        {results.length === 0 && (
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6 text-center">
            <span className="mb-2 block text-3xl">{"✅"}</span>
            <p className="text-sm text-[var(--color-text-muted)]">
              No common pests match this plant and symptom combination. Try selecting a different symptom, or the issue may be environmental (watering, sunlight, or soil quality).
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((pest) => {
            const isExpanded = expandedPest === pest.name;
            return (
              <div
                key={pest.name}
                className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:border-[var(--color-primary)]/30"
              >
                {/* Card header (always visible) */}
                <button
                  onClick={() => toggleExpand(pest.name)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-lg">
                      {"🐛"}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--color-text)]">
                        {pest.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                        {pest.affectsAll ? "Affects most plants" : `Affects: ${pest.plants.join(", ")}`}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-lg text-[var(--color-text-muted)] transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    {"▼"}
                  </span>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {pest.description}
                    </p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {/* Organic Solution */}
                      <div className="rounded-lg bg-green-50/60 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-green-700">
                          <span>{"🌿"}</span> Organic Solution
                        </h4>
                        <p className="text-sm text-green-800">{pest.organicSolution}</p>
                      </div>

                      {/* Prevention */}
                      <div className="rounded-lg bg-blue-50/60 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700">
                          <span>{"🛡️"}</span> Prevention
                        </h4>
                        <p className="text-sm text-blue-800">{pest.prevention}</p>
                      </div>
                    </div>

                    {/* Companion planting tip */}
                    {pest.companionTip && (
                      <div className="mt-4 rounded-lg bg-amber-50/60 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700">
                          <span>{"🌼"}</span> Companion Planting Tip
                        </h4>
                        <p className="text-sm text-amber-800">{pest.companionTip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <FAQSection questions={pestGuideFAQ} />

      {/* Educational Content */}
      <div className="mt-10 space-y-6">
        <h2 className="text-lg font-bold text-[var(--color-text)]">
          Integrated Pest Management for Home Gardens
        </h2>
        <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
          Integrated Pest Management (IPM) is the approach used by agricultural extension services and organic farms worldwide. It prioritizes prevention first, then monitoring, then the least-toxic intervention. In practice, that means building healthy soil (the foundation of pest resistance), choosing resistant varieties, rotating crops yearly, encouraging beneficial insects, and only reaching for sprays as a last resort. Most home garden pest problems can be solved with hand-picking, row covers, and companion planting before any product is needed.
        </p>
        <h3 className="text-base font-semibold text-[var(--color-text)]">
          Quick Tips for Staying Pest-Free
        </h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-[var(--color-text-muted)]">
          <li>Inspect your garden at least twice a week, checking leaf undersides, stems, and the soil surface around plant bases.</li>
          <li>Water at the base of plants in the morning. Overhead watering in the evening creates the damp conditions that slugs, fungal diseases, and many pests prefer.</li>
          <li>Rotate crop families on a 3 to 4 year cycle. Planting tomatoes in the same spot every year lets soil-borne pests and diseases build up to damaging levels.</li>
          <li>Encourage beneficial insects by planting a border of flowers like alyssum, yarrow, fennel, and dill. Ladybugs, lacewings, and parasitic wasps are your best allies against aphids, caterpillars, and whiteflies.</li>
          <li>Use the <a href="/companion-planting" className="text-[var(--color-primary)] hover:underline">companion planting checker</a> to find pest-repelling plant combinations, and the <a href="/watering" className="text-[var(--color-primary)] hover:underline">watering calculator</a> to avoid the overwatering that leads to root rot and fungal problems.</li>
        </ul>
      </div>

      <EmailCapture variant="inline" context="pest-guide" />
      <RelatedCalculators currentPath="/pest-guide" />
    </CalculatorLayout>
  );
}
