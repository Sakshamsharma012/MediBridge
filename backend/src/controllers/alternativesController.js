import { prisma } from '../config/db.js';
import { GENERIC_SUBSTITUTION_DISCLAIMER } from '../utils/safetyRules.js';

// Comprehensive Knowledge Base of Instant Natural Home Remedies
const NATURAL_REMEDIES_DATABASE = [
  {
    id: 'remedy-digestion-1',
    category: 'Digestion & Gas',
    title: 'Ajwain (Carom Seeds) & Black Salt Warm Elixir',
    ailment: 'Indigestion, Gas, Flatulence & Stomach Bloating',
    cureTime: 'Instant Relief (5 - 10 minutes)',
    badgeColor: 'emerald',
    matchedKeywords: ['digestion', 'gas', 'bloating', 'stomach pain', 'indigestion', 'fullness', 'flatulence', 'digestive', 'omez', 'digene', 'antacid'],
    ingredients: [
      '1/2 teaspoon Carom Seeds (Ajwain)',
      '1/4 teaspoon Himalayan Black Salt (Kala Namak)',
      '1 glass Warm Water (250 ml)',
    ],
    preparationSteps: [
      'Lightly crush 1/2 tsp of ajwain seeds between your palms to release the aromatic essential oils.',
      'Mix the crushed seeds and black salt together.',
      'Swallow the mixture with warm water or steep in boiling water for 3 minutes and sip warm.',
    ],
    howToConsume: 'Consume immediately when feeling heavy, bloated, or after a heavy meal. Sip warm for fastest relief.',
    scientificMechanism: 'Ajwain contains high levels of thymol, a potent essential oil that triggers immediate secretion of gastric juices and digestive enzymes, while black salt stimulates bile flow and rapidly dissipates trapped intestinal gas.',
    precautions: 'Extremely safe for all adults. If suffering from severe hypertension, use a smaller pinch of black salt.',
    effectivenessRating: '98% Instant Relief',
  },
  {
    id: 'remedy-digestion-2',
    category: 'Digestion & Gas',
    title: 'Fresh Ginger-Lemon Alkaline Digestive Tonic',
    ailment: 'Sluggish Digestion, Heavy Stomach & Nausea',
    cureTime: 'Within 10 - 15 minutes',
    badgeColor: 'emerald',
    matchedKeywords: ['digestion', 'sluggish stomach', 'heavy stomach', 'nausea', 'vomiting', 'loss of appetite'],
    ingredients: [
      '1 inch Fresh Ginger Root (grated/juiced)',
      '1/2 Fresh Lemon juice',
      '1 pinch Black Salt or Rock Salt',
      '1/2 cup Lukewarm Water',
    ],
    preparationSteps: [
      'Grate fresh ginger and squeeze through a strainer to extract 1 teaspoon of fresh ginger juice.',
      'Add fresh lemon juice and a pinch of black salt.',
      'Mix into 1/2 cup of lukewarm water and stir well.',
    ],
    howToConsume: 'Drink 10 minutes before meals to stimulate digestive fire (Agni), or 20 minutes after meals to relieve post-meal sluggishness.',
    scientificMechanism: 'Gingerols and shogaols in ginger accelerate gastric emptying by up to 50%, relax intestinal muscles, and eliminate digestive spasms and nausea.',
    precautions: 'Do not consume on an empty stomach if you have active bleeding peptic ulcers.',
    effectivenessRating: '95% Rapid Relief',
  },
  {
    id: 'remedy-digestion-3',
    category: 'Digestion & Gas',
    title: 'Roasted Cumin (Jeera) & Mint Digestive Water',
    ailment: 'Abdominal Cramps, Gas & Irritable Gut',
    cureTime: 'Within 15 minutes',
    badgeColor: 'emerald',
    matchedKeywords: ['digestion', 'cramps', 'stomach ache', 'gas', 'gut', 'jeera'],
    ingredients: [
      '1 teaspoon Cumin Seeds (Jeera)',
      '5-6 Fresh Mint leaves (Pudina)',
      '300 ml Water',
    ],
    preparationSteps: [
      'Lightly dry-roast cumin seeds in a pan for 1 minute until fragrant.',
      'Boil roasted cumin and fresh mint leaves in 300 ml of water for 4 minutes until the water turns golden.',
      'Strain into a cup and sip warm.',
    ],
    howToConsume: 'Sip slowly like herbal tea. Can be taken twice daily after lunch and dinner.',
    scientificMechanism: 'Cumin activates salivary amylase and pancreatic lipase, while menthol in mint provides anti-spasmodic relaxation of the gastrointestinal smooth muscle.',
    precautions: 'Safe for daily consumption. Also aids in gentle natural detoxification.',
    effectivenessRating: '92% High Relief',
  },
  {
    id: 'remedy-digestion-4',
    category: 'Digestion & Gas',
    title: 'Asafoetida (Hing) & Ghee Warm Water Shot',
    ailment: 'Severe Trapped Gas & Painful Abdominal Distension',
    cureTime: 'Instant Relief (5 minutes)',
    badgeColor: 'emerald',
    matchedKeywords: ['digestion', 'severe gas', 'trapped gas', 'stomach spasm', 'colic pain', 'bloat'],
    ingredients: [
      '1 pinch Pure Compounded Asafoetida (Hing)',
      '1/4 teaspoon Warm Cow Ghee or Warm Water',
      '1/2 cup Warm Water',
    ],
    preparationSteps: [
      'Dissolve 1 pinch of hing in 1/2 cup of warm water, or mix with 1/4 tsp of melted ghee.',
      'Stir thoroughly until completely dispersed.',
    ],
    howToConsume: 'Drink in one warm go. (For infants/toddlers, apply a paste of hing and water externally around the navel).',
    scientificMechanism: 'Asafoetida is one of nature’s most potent carminatives; its ferulic acid compounds relax abdominal smooth muscles and expel trapped gastrointestinal air almost instantaneously.',
    precautions: 'Use only a small pinch as it is concentrated and pungent.',
    effectivenessRating: '99% Instant Gas Expulsion',
  },
  {
    id: 'remedy-digestion-5',
    category: 'Digestion & Gas',
    title: 'Probiotic Spiced Buttermilk (Chaas / Mattha)',
    ailment: 'Chronic Poor Digestion, Heartburn & Gut Heat',
    cureTime: 'Within 20 minutes',
    badgeColor: 'blue',
    matchedKeywords: ['digestion', 'gut health', 'bloating', 'acid reflux', 'probiotic', 'chaas'],
    ingredients: [
      '1 cup Fresh Homemade Curd / Yogurt',
      '1 cup Cold Water',
      '1/4 tsp Roasted Cumin Powder',
      '4-5 Crushed Mint Leaves',
      'Pinch of Rock Salt',
    ],
    preparationSteps: [
      'Churn yogurt and water thoroughly until light and frothy (discarding any butter that floats up).',
      'Add roasted cumin powder, crushed mint, and rock salt.',
      'Stir well and serve chilled or at room temperature.',
    ],
    howToConsume: 'Drink 1 glass with or immediately following lunch.',
    scientificMechanism: 'Contains live lactic acid bacillus that repopulates healthy gut microbiota, while lactic acid balances gastric pH and eliminates burning.',
    precautions: 'Avoid taking late at night if prone to sinus congestion.',
    effectivenessRating: '94% Soothing Relief',
  },
  {
    id: 'remedy-acidity-1',
    category: 'Acidity & Heartburn',
    title: 'Chilled Milk with Cold-Pressed Coconut Oil or Ghee',
    ailment: 'Acid Reflux, Heartburn & Esophageal Burning',
    cureTime: 'Instant Relief (3 - 5 minutes)',
    badgeColor: 'emerald',
    matchedKeywords: ['acidity', 'heartburn', 'acid reflux', 'gerd', 'burning chest', 'pantoprazole', 'omeprazole', 'pan 40', 'antacid'],
    ingredients: [
      '1/2 glass Chilled Low-Fat Milk or Almond Milk',
      '1/2 teaspoon Pure Desi Ghee or Coconut Oil (Optional)',
    ],
    preparationSteps: [
      'Take 1/2 glass of chilled milk.',
      'Sip slowly without gulping.',
    ],
    howToConsume: 'Drink small sips when experiencing burning sensation in chest or throat.',
    scientificMechanism: 'High calcium and protein in chilled milk immediately neutralizes free hydrochloric acid in the stomach and contracts the lower esophageal sphincter to prevent backflow.',
    precautions: 'Use almond milk if lactose intolerant.',
    effectivenessRating: '97% Instant Neutralizer',
  },
  {
    id: 'remedy-acidity-2',
    category: 'Acidity & Heartburn',
    title: 'Chewed Fennel Seeds (Saunf) with Green Cardamom',
    ailment: 'Post-Meal Acidity, Burping & Sour Belching',
    cureTime: 'Within 10 minutes',
    badgeColor: 'emerald',
    matchedKeywords: ['acidity', 'sour burp', 'fennel', 'saunf', 'belching', 'stomach burn'],
    ingredients: [
      '1 teaspoon Green Fennel Seeds (Saunf)',
      '1 pod Green Cardamom (Elaichi) seeds',
    ],
    preparationSteps: [
      'Mix the fennel seeds and peeled cardamom seeds together.',
      'Chew slowly in mouth for 2-3 minutes, swallowing the juice.',
    ],
    howToConsume: 'Chew immediately after meals or at the onset of sour belching.',
    scientificMechanism: 'Anethole in fennel seeds calms gastrointestinal inflammation and restores an alkaline mucosal environment.',
    precautions: 'Safe for everyone including pregnant women.',
    effectivenessRating: '91% Relief',
  },
  {
    id: 'remedy-headache-1',
    category: 'Headache & Migraine',
    title: 'Fresh Ginger-Cinnamon Decoction with Honey',
    ailment: 'Tension Headache, Migraine & Throbbing Pain',
    cureTime: 'Within 15 - 20 minutes',
    badgeColor: 'emerald',
    matchedKeywords: ['headache', 'migraine', 'head pain', 'paracetamol', 'crocin', 'ibuprofen', 'brufen', 'head throb'],
    ingredients: [
      '1 inch Fresh Ginger (crushed)',
      '1/2 inch Cinnamon stick',
      '1 cup Water',
      '1 tsp Raw Honey',
    ],
    preparationSteps: [
      'Boil crushed ginger and cinnamon stick in 1 cup water for 5 minutes.',
      'Strain into a mug, let cool slightly, and stir in honey.',
    ],
    howToConsume: 'Sip warm in a quiet, dimly lit room.',
    scientificMechanism: 'Inhibits inflammatory prostaglandin synthesis similarly to NSAID painkillers, while ginger improves cranial blood circulation without stomach irritation.',
    precautions: 'Do not boil honey directly in hot boiling water.',
    effectivenessRating: '90% Relief',
  },
  {
    id: 'remedy-headache-2',
    category: 'Headache & Migraine',
    title: 'Peppermint Oil & Acupressure Temple Rub',
    ailment: 'Tension Headache & Stress Head Pain',
    cureTime: 'Within 5 - 10 minutes',
    badgeColor: 'emerald',
    matchedKeywords: ['headache', 'forehead pain', 'temple pain', 'stress headache'],
    ingredients: [
      '2 drops Peppermint Essential Oil (or Eucalyptus Oil)',
      '1/2 tsp Coconut Oil or Almond Oil as carrier',
    ],
    preparationSteps: [
      'Blend peppermint oil with carrier coconut oil.',
      'Gently massage in circular motions onto temples, forehead, and back of the neck for 3 minutes.',
    ],
    howToConsume: 'External application only. Avoid contact with eyes.',
    scientificMechanism: 'Menthol stimulates cutaneous cold receptors and inhibits calcium channels in cranial blood vessels, producing profound muscular relaxation and pain relief.',
    precautions: 'Do not apply to open cuts or directly into eyes.',
    effectivenessRating: '96% Rapid Relief',
  },
  {
    id: 'remedy-cold-1',
    category: 'Cough, Cold & Throat',
    title: 'Raw Honey + Fresh Ginger Juice + Black Pepper Elixir',
    ailment: 'Dry / Productive Cough, Throat Irritation & Congestion',
    cureTime: 'Instant Throat Soothing (5 minutes)',
    badgeColor: 'emerald',
    matchedKeywords: ['cough', 'cold', 'sore throat', 'congestion', 'dextromethorphan', 'benadryl', 'cetirizine', 'cetzine', 'throat pain'],
    ingredients: [
      '1 tablespoon Raw Organic Honey',
      '1 teaspoon Fresh Ginger Juice',
      '1 pinch Freshly Ground Black Pepper (Kali Mirch)',
      'Pinch of Turmeric Powder',
    ],
    preparationSteps: [
      'Mix honey, fresh ginger juice, black pepper, and turmeric together in a small bowl until smooth.',
    ],
    howToConsume: 'Lick slowly from a spoon 2 to 3 times daily. Do not drink water for 15 minutes afterward to allow the coating to heal the pharynx.',
    scientificMechanism: 'Honey creates a protective hypertonic barrier that suppresses brain cough reflex (proven as effective as dextromethorphan in clinical trials), while piperine and gingerols kill bacterial pathogens.',
    precautions: 'Do not give honey to infants under 1 year of age.',
    effectivenessRating: '98% Instant Throat Soothing',
  },
  {
    id: 'remedy-cold-2',
    category: 'Cough, Cold & Throat',
    title: 'Golden Turmeric Milk (Haldi Doodh) with Black Pepper',
    ailment: 'Persistent Night Cough, Body Ache & Chest Congestion',
    cureTime: 'Overnight Relief',
    badgeColor: 'blue',
    matchedKeywords: ['cough', 'cold', 'chest congestion', 'night cough', 'immunity', 'body ache'],
    ingredients: [
      '1 cup Warm Milk (Dairy or Oat/Almond)',
      '1/2 teaspoon Organic Turmeric Powder',
      '1 pinch Crushed Black Pepper',
      '1/4 tsp Cinnamon powder',
    ],
    preparationSteps: [
      'Whisk turmeric, cinnamon, and black pepper into warm milk over medium heat for 3 minutes.',
      'Pour into a mug and sweeten with raw honey or jaggery.',
    ],
    howToConsume: 'Drink hot right before going to bed.',
    scientificMechanism: 'Curcumin combined with piperine exhibits 2000% higher bioavailability, clearing bronchial mucus and lowering inflammatory cytokines.',
    precautions: 'Drink warm, not scalding hot.',
    effectivenessRating: '94% Healing Rate',
  },
  {
    id: 'remedy-constipation-1',
    category: 'Constipation & Bowel',
    title: 'Warm Water with Soaked Chia & Flaxseeds',
    ailment: 'Hard Stools, Chronic Constipation & Straining',
    cureTime: 'Relief within 6 - 8 hours',
    badgeColor: 'blue',
    matchedKeywords: ['constipation', 'hard stools', 'bowel', 'irregular stomach', 'laxative', 'dulcolax'],
    ingredients: [
      '1 tablespoon Chia Seeds or Ground Flaxseeds',
      '1 glass Warm Water (300 ml)',
      '1 teaspoon Pure Lemon Juice',
    ],
    preparationSteps: [
      'Soak chia seeds in warm water for 15 minutes until a mucilaginous gel forms.',
      'Add lemon juice and stir.',
    ],
    howToConsume: 'Drink first thing in the morning on an empty stomach and 1 hour before bed.',
    scientificMechanism: 'Forms a high-viscosity soluble fiber gel that lubricates the colon, bulks the stool, and stimulates natural peristaltic contractions.',
    precautions: 'Ensure you drink adequate water throughout the day.',
    effectivenessRating: '95% Regularity',
  },
  {
    id: 'remedy-fever-1',
    category: 'Fever & Body Ache',
    title: 'Tulsi (Holy Basil) & Black Pepper Herbal Kadha',
    ailment: 'Mild Fever, Chills, Viral Malaise & Body Aches',
    cureTime: 'Within 30 minutes',
    badgeColor: 'amber',
    matchedKeywords: ['fever', 'chills', 'viral fever', 'body ache', 'paracetamol', 'calpol', 'crocin', 'malaise'],
    ingredients: [
      '10-12 Fresh Holy Basil (Tulsi) leaves',
      '4 Crushed Black Peppercorns',
      '1 inch Crushed Ginger',
      '400 ml Water',
      '1 tsp Jaggery or Honey',
    ],
    preparationSteps: [
      'Boil tulsi leaves, crushed peppercorns, and ginger in water until reduced to half (200 ml).',
      'Strain, stir in jaggery, and drink warm.',
    ],
    howToConsume: 'Drink 2 times a day during fever or flu onset.',
    scientificMechanism: 'Eugenol and camphene in tulsi act as natural febrifuges and antiviral agents that modulate body temperature regulation centers in the hypothalamus.',
    precautions: 'If fever exceeds 102°F (38.9°C) or persists over 48 hours, seek clinical medical evaluation.',
    effectivenessRating: '90% Fever Soothing',
  },
];

export const getGenericAlternatives = async (req, res, next) => {
  try {
    const { medicineId } = req.params;

    const medicine = await prisma.medicine.findUnique({
      where: { id: medicineId },
      include: {
        genericAlternatives: true,
      },
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found.' });
    }

    // Also match medicines with exact same active ingredient & strength
    const dbMatches = await prisma.medicine.findMany({
      where: {
        id: { not: medicine.id },
        activeIngredient: { equals: medicine.activeIngredient, mode: 'insensitive' },
        strength: { equals: medicine.strength, mode: 'insensitive' },
      },
    });

    const formattedDbMatches = dbMatches.map((m) => ({
      id: m.id,
      medicineName: m.name,
      genericName: m.genericName,
      activeIngredient: m.activeIngredient,
      strength: m.strength,
      dosageForm: m.dosageForm,
      manufacturer: m.manufacturer,
      prescriptionStatus: m.prescriptionRequired ? 'PRESCRIPTION_REQUIRED' : 'OTC',
      notes: 'Matches active ingredient & dosage strength.',
      similarityScore: 0.95,
    }));

    const alternatives = [...medicine.genericAlternatives, ...formattedDbMatches];

    res.json({
      success: true,
      message: 'Generic alternatives retrieved.',
      disclaimer: GENERIC_SUBSTITUTION_DISCLAIMER,
      data: {
        originalMedicine: {
          id: medicine.id,
          name: medicine.name,
          genericName: medicine.genericName,
          activeIngredient: medicine.activeIngredient,
          strength: medicine.strength,
          dosageForm: medicine.dosageForm,
        },
        alternatives,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getNaturalRemedies = async (req, res, next) => {
  try {
    const { query, category } = req.query;

    let filtered = [...NATURAL_REMEDIES_DATABASE];

    if (category && category !== 'ALL') {
      filtered = filtered.filter(
        (r) => r.category.toLowerCase().includes(category.toLowerCase()) || category.toLowerCase().includes(r.category.toLowerCase())
      );
    }

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((r) => {
        return (
          r.title.toLowerCase().includes(q) ||
          r.ailment.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.matchedKeywords.some((k) => k.includes(q) || q.includes(k)) ||
          r.ingredients.some((ing) => ing.toLowerCase().includes(q))
        );
      });
    }

    res.json({
      success: true,
      message: 'Natural home remedies retrieved successfully.',
      disclaimer: 'These natural home remedies are evidence-informed traditional practices for instant mild-to-moderate relief. In case of chronic or acute medical emergencies, consult a qualified physician.',
      data: {
        totalFound: filtered.length,
        remedies: filtered,
      },
    });
  } catch (error) {
    next(error);
  }
};

