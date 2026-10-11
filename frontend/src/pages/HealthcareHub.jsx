import React, { useState, useEffect, useRef } from 'react';
import { healthcareService } from '../services/api';
import {
  HeartPulse,
  Sparkles,
  BookOpen,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Activity,
  Flame,
  Droplet,
  Footprints,
  Calendar,
  Utensils,
  Dumbbell,
  Moon,
  Clock,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Info,
  ShieldCheck,
  ChevronRight,
  Stethoscope,
  Heart,
  Scale,
  User,
  Coffee,
  Sun,
  Sunset,
} from 'lucide-react';

const COMMON_HEALTH_ISSUES = [
  { id: 'Stomach Ulcer / Gastritis / Gas Problem', label: 'Stomach Ulcer / Gas / Acidity', icon: '🍲' },
  { id: 'Type 2 Diabetes / High Blood Sugar', label: 'Type 2 Diabetes / High Sugar', icon: '🩺' },
  { id: 'Hypertension / High Blood Pressure', label: 'Hypertension / High BP', icon: '💓' },
  { id: 'High Cholesterol / Heart Health', label: 'High Cholesterol', icon: '🫀' },
  { id: 'Joint Pain / Arthritis', label: 'Joint Pain / Arthritis', icon: '🦴' },
  { id: 'Asthma / Respiratory Sensitivity', label: 'Asthma / Breathing', icon: '🫁' },
  { id: 'Acid Reflux / GERD', label: 'Acid Reflux / GERD', icon: '⚡' },
  { id: 'Thyroid Disorder', label: 'Thyroid (Hypo/Hyper)', icon: '🦋' },
  { id: 'PCOS / Hormonal Imbalance', label: 'PCOS / Hormonal', icon: '🩸' },
  { id: 'Chronic Stress / Insomnia', label: 'Stress / Insomnia', icon: '🌿' },
  { id: 'Fatty Liver / Digestion Sluggishness', label: 'Fatty Liver / Digestion', icon: '🫘' },
  { id: 'Anemia / Low Hemoglobin', label: 'Anemia / Low Iron', icon: '🍷' },
  { id: 'Migraine / Headaches', label: 'Migraine / Headaches', icon: '🧠' },
  { id: 'None / Generally Healthy', label: 'None / Healthy (General)', icon: '🛡️' },
];

const PRESET_PROFILES = [
  {
    name: 'Sample 1: 20yo Female, 154cm, 42kg (Underweight & Stomach Ulcer)',
    data: {
      height: 154,
      weight: 42,
      age: 20,
      gender: 'female',
      activityLevel: 'sedentary',
      healthIssues: ['Stomach Ulcer / Gastritis / Gas Problem'],
      otherNotes: 'Stomach pain after meals, frequent bloating and gas problem, no exercise',
      goal: 'healthy_lifestyle',
    },
  },
  {
    name: 'Sample 2: 45yo Male, 172cm, 84kg (Overweight & High BP)',
    data: {
      height: 172,
      weight: 84,
      age: 45,
      gender: 'male',
      activityLevel: 'sedentary',
      healthIssues: ['Hypertension / High Blood Pressure'],
      otherNotes: 'Mild fatigue in the afternoons, working desk job',
      goal: 'weight_loss',
    },
  },
  {
    name: 'Sample 3: 52yo Female, 162cm, 76kg (Obesity & Diabetes)',
    data: {
      height: 162,
      weight: 76,
      age: 52,
      gender: 'female',
      activityLevel: 'light',
      healthIssues: ['Type 2 Diabetes / High Blood Sugar', 'Joint Pain / Arthritis'],
      otherNotes: 'Knee stiffness during morning stairs, taking Metformin',
      goal: 'blood_sugar',
    },
  },
  {
    name: 'Sample 4: 26yo Male, 178cm, 71kg (Normal Healthy Weight Fitness)',
    data: {
      height: 178,
      weight: 71,
      age: 26,
      gender: 'male',
      activityLevel: 'moderate',
      healthIssues: ['None / Generally Healthy'],
      otherNotes: 'Looking to optimize lean muscle tone and clean daily energy',
      goal: 'muscle_gain',
    },
  },
];

export const HealthcareHub = () => {
  const [tab, setTab] = useState('ASSISTANCE'); // 'ASSISTANCE' | 'FIRST_AID' | 'SELF_CARE'
  const [firstAidArticles, setFirstAidArticles] = useState([]);
  const [selfCareArticles, setSelfCareArticles] = useState([]);
  const [disclaimer, setDisclaimer] = useState('');
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Healthcare Assistance Form State
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [selectedIssues, setSelectedIssues] = useState(['Hypertension / High Blood Pressure']);
  const [otherNotes, setOtherNotes] = useState('');
  const [goal, setGoal] = useState('weight_loss');

  const [generating, setGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [copied, setCopied] = useState(false);

  const planRef = useRef(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoadingArticles(true);
    try {
      const [faRes, scRes] = await Promise.all([
        healthcareService.getFirstAid(),
        healthcareService.getSelfCare(),
      ]);
      if (faRes?.success) {
        setFirstAidArticles(faRes.data.articles || []);
        setDisclaimer(faRes.disclaimer || '');
      }
      if (scRes?.success) {
        setSelfCareArticles(scRes.data.articles || []);
      }
    } catch (e) {
      console.error('Error fetching healthcare articles:', e);
    } finally {
      setLoadingArticles(false);
    }
  };

  const toggleIssue = (issueId) => {
    if (issueId === 'None / Generally Healthy') {
      setSelectedIssues(['None / Generally Healthy']);
      return;
    }
    const filtered = selectedIssues.filter((i) => i !== 'None / Generally Healthy');
    if (filtered.includes(issueId)) {
      const next = filtered.filter((i) => i !== issueId);
      setSelectedIssues(next.length === 0 ? ['None / Generally Healthy'] : next);
    } else {
      setSelectedIssues([...filtered, issueId]);
    }
  };

  const loadPreset = (presetData) => {
    setHeight(String(presetData.height));
    setWeight(String(presetData.weight));
    setAge(String(presetData.age));
    setGender(presetData.gender);
    setActivityLevel(presetData.activityLevel);
    setSelectedIssues(presetData.healthIssues);
    setOtherNotes(presetData.otherNotes || '');
    setGoal(presetData.goal || 'weight_loss');
  };

  // Client-side fallback generator to ensure instant, zero-failure user experience
  const generatePlanLocally = (payload) => {
    const numHeight = parseFloat(payload.height);
    const numWeight = parseFloat(payload.weight);
    const numAge = parseInt(payload.age, 10);
    const heightInMeters = numHeight / 100;
    const bmi = parseFloat((numWeight / (heightInMeters * heightInMeters)).toFixed(1));

    let bmiCategory = 'Normal Healthy Weight (Ideal)';
    let bmiColor = 'emerald';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight (Below Ideal Weight)';
      bmiColor = 'blue';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal Healthy Weight (Ideal)';
      bmiColor = 'emerald';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight (Above Ideal Weight)';
      bmiColor = 'amber';
    } else {
      bmiCategory = 'Obesity Range (High Body Mass)';
      bmiColor = 'rose';
    }

    const minHealthyWeight = parseFloat((18.5 * heightInMeters * heightInMeters).toFixed(1));
    const maxHealthyWeight = parseFloat((24.9 * heightInMeters * heightInMeters).toFixed(1));

    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    if (payload.gender === 'female') bmr -= 161;
    else if (payload.gender === 'other') bmr -= 78;
    else bmr += 5;
    bmr = Math.round(bmr);

    const mults = { sedentary: 1.2, light: 1.375, moderate: 1.55, very_active: 1.725 };
    const tdee = Math.round(bmr * (mults[payload.activityLevel] || 1.2));
    let targetCalories = tdee;
    if (payload.goal === 'weight_loss' || (bmi >= 25 && payload.goal !== 'muscle_gain')) {
      targetCalories = Math.max(Math.round(tdee - 450), bmr);
    } else if (payload.goal === 'muscle_gain' || bmi < 18.5) {
      targetCalories = Math.round(tdee + 350);
    }

    const dailyWaterLiters = parseFloat((numWeight * 0.035).toFixed(1));

    const issuesStr = (payload.healthIssues.join(' ') + ' ' + (payload.otherNotes || '')).toLowerCase();
    const hasUlcer = issuesStr.includes('ulcer') || issuesStr.includes('gastrit') || issuesStr.includes('stomach') || issuesStr.includes('gas');
    const hasDiabetes = issuesStr.includes('diabet') || issuesStr.includes('sugar');
    const hasHypertension = issuesStr.includes('hypertens') || issuesStr.includes('bp') || issuesStr.includes('pressure');
    const hasCholesterol = issuesStr.includes('cholesterol') || issuesStr.includes('heart');
    const hasJointPain = issuesStr.includes('joint') || issuesStr.includes('arthrit') || issuesStr.includes('knee');
    const hasAsthma = issuesStr.includes('asthma') || issuesStr.includes('breath');
    const hasGERD = issuesStr.includes('gerd') || issuesStr.includes('reflux') || issuesStr.includes('acid');

    let dietStrategyTitle = 'Cardio-Protective Whole-Food Mediterranean Plan';
    let dietStrategyDesc = 'Emphasis on low-glycemic complex carbohydrates, lean protein, anti-inflammatory polyphenols, and fiber-rich greens.';
    if (hasUlcer) {
      dietStrategyTitle = 'Ulcer-Soothing & Anti-Gas Gastrointestinal Protocol';
      dietStrategyDesc = 'Gentle, non-acidic, easy-to-digest nutrition focused on natural mucosal healing, gas alleviation, and gastric ulcer protection.';
    } else if (hasDiabetes && hasHypertension) {
      dietStrategyTitle = 'DASH & Glycemic-Stabilizing Metabolic Protocol';
      dietStrategyDesc = 'Sodium restricted under 1,500mg, potassium-rich whole foods, and low-glycemic complexes to protect vascular walls and stabilize insulin.';
    } else if (hasDiabetes) {
      dietStrategyTitle = 'Low-Glycemic Insulin-Sensitivity Nutrition Plan';
      dietStrategyDesc = 'Prioritizes high soluble fiber, healthy fats, and unrefined grains to eliminate sharp post-meal blood glucose spikes.';
    } else if (hasHypertension) {
      dietStrategyTitle = 'Cardiovascular DASH Dietary Protocol';
      dietStrategyDesc = 'Elevates dietary potassium, magnesium, and nitric oxide precursors while reducing sodium to lower systemic arterial stiffness.';
    } else if (hasJointPain) {
      dietStrategyTitle = 'Anti-Inflammatory Joint & Cartilage Recovery Diet';
      dietStrategyDesc = 'High in omega-3 fatty acids, turmeric curcumin, collagen co-factors, and antioxidants that soothe synovial inflammation.';
    } else if (hasGERD) {
      dietStrategyTitle = 'Alkaline Gut-Soothing Digestive Blueprint';
      dietStrategyDesc = 'Low-acid, non-citrus, nutrient-dense meals that support gastric mucosa without relaxing the lower esophageal sphincter.';
    }

    const mealPlan = {
      morningWakeup: {
        time: '07:00 AM',
        title: 'Morning Awakening & Natural Remedy',
        suggestion: hasUlcer
          ? 'Warm Jeera Water (Cumin infusion) or Saunf (Fennel) Tea (250ml) on empty stomach.'
          : hasDiabetes
          ? 'Warm water (300ml) with 1 tsp soaked fenugreek seeds or cinnamon bark infusion.'
          : hasHypertension
          ? 'Warm hibiscus or lemon-infused water (300ml) to promote vascular relaxation.'
          : hasGERD
          ? 'Warm water with 1 tbsp soaked chia seeds or fennel seed infusion (gentle on stomach).'
          : 'Warm water (350ml) with a fresh lemon squeeze and 1 tsp chia seeds.',
        benefit: hasUlcer
          ? 'Jeera water neutralizes stomach acid, relieves gas & bloating, and shields ulcerated stomach lining.'
          : 'Rehydrates cellular tissues and stimulates natural digestive peristalsis.',
      },
      breakfast: {
        time: '08:30 AM',
        title: 'Nutrient-Dense Power Breakfast',
        suggestion: hasDiabetes
          ? 'Spinach & bell pepper egg-white scramble (or spiced tofu) with 1 slice sprouted whole grain toast and 1/4 avocado.'
          : hasHypertension
          ? 'Steel-cut oats cooked in unsweetened almond milk, topped with sliced banana (potassium), ground flaxseeds, and blueberries.'
          : hasGERD
          ? 'Warm rolled oatmeal cooked with oat milk, sliced ripe banana, and 2 boiled egg whites.'
          : 'High-protein Greek yogurt bowl (or oatmeal) with chia seeds, raw walnuts, and mixed antioxidant berries.',
        benefit: 'Provides sustained low-glycemic energy and stabilizes morning cortisol.',
      },
      midDayHydration: {
        time: '11:00 AM',
        title: 'Mid-Morning Hydration & Vitality',
        suggestion: hasAsthma
          ? 'Warm ginger-honey tea with 5 soaked almonds.'
          : hasHypertension
          ? 'Cold-pressed celery, cucumber, and beetroot shot (natural nitric oxide vasodilators).'
          : 'Green tea or chamomile tea with a small handful of raw pumpkin seeds and walnuts.',
        benefit: 'Enhances cognitive focus and sustains healthy cellular hydration.',
      },
      lunch: {
        time: '01:30 PM',
        title: 'Balanced Power Lunch Plate (50% Veggies, 25% Lean Protein, 25% Complex Fiber)',
        suggestion: hasJointPain
          ? 'Grilled wild salmon or lentil stew, steamed broccoli, turmeric-roasted cauliflower, and cooked quinoa with extra virgin olive oil.'
          : hasDiabetes
          ? 'Grilled chicken breast or tofu steak, giant Mediterranean salad (cucumbers, spinach, chickpeas), dressed with olive oil & herbs.'
          : 'Grilled lean protein (chicken/fish/tofu/paneer), rainbow stir-fried vegetables, and a side of brown rice or quinoa.',
        benefit: 'Maintains steady postprandial glucose and supports lean muscle repair.',
      },
      eveningSnack: {
        time: '05:00 PM',
        title: 'Afternoon Rejuvenator Snack',
        suggestion: hasDiabetes
          ? 'Handful of roasted chickpeas or cucumber slices with 2 tbsp hummus.'
          : hasGERD
          ? 'Fresh ripe papaya slices or coconut water with 4-5 soaked walnuts.'
          : 'Handful of unsalted raw almonds and walnuts paired with herbal mint tea.',
        benefit: 'Prevents late-afternoon energy crashes and binge-eating at dinner.',
      },
      dinner: {
        time: '07:30 PM',
        title: 'Restorative & Light Evening Meal',
        suggestion: hasGERD
          ? 'Steamed zucchini, carrots, and poached chicken/tofu in mild vegetable broth (finish at least 3 hours before sleep).'
          : hasHypertension
          ? 'Baked white fish or roasted paneer with garlic sautéed spinach, steamed asparagus, and sweet potato mash (low sodium).'
          : 'Vegetable lentil soup or grilled protein with a bowl of warm sautéed seasonal greens.',
        benefit: 'Easy on digestive organs to promote deep restorative slow-wave sleep.',
      },
      nightRoutine: {
        time: '09:30 PM',
        title: 'Evening Calming Elixir',
        suggestion: 'Warm chamomile tea or golden turmeric milk (with a pinch of black pepper) 45 minutes before sleep.',
        benefit: 'Lowers systemic inflammation and triggers natural melatonin release.',
      },
    };

    if (hasUlcer) {
      superfoods.push(
        { name: 'Jeera Water (Cumin) & Fennel Tea', reason: 'Soothes gastric mucosal lining, neutralizes excess acidity, and prevents gas buildup.' },
        { name: 'Ripe Bananas & Tender Coconut Water', reason: 'Acts as a natural antacid layer to protect ulcerated stomach lining.' },
        { name: 'Warm Oatmeal & Steamed Vegetables', reason: 'Soluble fiber absorbs stomach acid and provides non-irritating, gentle energy.' }
      );
      foodsToAvoid.push(
        { name: 'Hot Chili & Spicy Masalas', reason: 'Directly irritates open gastric mucosal ulcers and causes sharp pain.' },
        { name: 'Citrus Fruits & Raw Tomatoes', reason: 'High natural acidity exacerbates gastric acid erosion.' },
        { name: 'Carbonated Drinks & Coffee', reason: 'Triggers excess gastric juice secretion and relaxes sphincter causing gas & reflux.' }
      );
    }

    if (hasDiabetes) {
      superfoods.push(
        { name: 'Fenugreek & Bitter Gourd (Karela)', reason: 'Contains polypeptide-p and charantin that mimic insulin and lower blood sugar naturally.' },
        { name: 'Cinnamon & Chia Seeds', reason: 'High soluble fiber slows digestion and enhances cellular insulin receptor sensitivity.' },
        { name: 'Dark Leafy Greens (Spinach, Kale)', reason: 'Rich in magnesium and alpha-lipoic acid, which fights diabetic oxidative neuropathy.' }
      );
      foodsToAvoid.push(
        { name: 'Refined White Sugars & Pastries', reason: 'Causes dangerous rapid spikes in blood glucose and exhausts pancreatic beta-cells.' },
        { name: 'Sweetened Fruit Juices & Sodas', reason: 'Liquid sugar lacks fiber and rushes fructose straight to the liver, fueling insulin resistance.' },
        { name: 'White Rice, White Bread & Cornstarch', reason: 'High glycemic index foods that convert to bloodstream glucose almost instantly.' }
      );
    }

    if (hasHypertension) {
      superfoods.push(
        { name: 'Beetroot & Celery Juice', reason: 'Rich in dietary nitrates that dilate vascular walls and lower systolic pressure.' },
        { name: 'Bananas & Avocados', reason: 'High potassium counteracts excess sodium retention and eases arterial wall tension.' },
        { name: 'Raw Garlic (Allicin)', reason: 'Stimulates nitric oxide production and inhibits ACE (angiotensin-converting enzyme).' }
      );
      foodsToAvoid.push(
        { name: 'Canned Soups & Processed Deli Meats', reason: 'Extreme sodium levels cause heavy fluid retention and arterial strain.' },
        { name: 'Salty Pickles & Commercial Condiments', reason: 'Concentrated sodium sources that directly elevate systemic blood pressure.' },
        { name: 'Excessive Caffeine & Energy Drinks', reason: 'Stimulates vasoconstriction and surges adrenaline.' }
      );
    }

    if (hasJointPain) {
      superfoods.push(
        { name: 'Turmeric with Black Pepper', reason: 'Curcumin combined with piperine reduces inflammatory cytokines comparable to mild NSAIDs.' },
        { name: 'Fatty Fish (Salmon, Sardines) / Walnuts', reason: 'High EPA/DHA omega-3 fatty acids lubricate synovial joints and dampen cartilage breakdown.' },
        { name: 'Tart Cherries & Dark Berries', reason: 'Anthocyanins neutralize free radicals in inflamed joint capsules.' }
      );
      foodsToAvoid.push(
        { name: 'Industrial Refined Seed Oils (Corn, Soybean)', reason: 'High omega-6 to omega-3 ratio generates inflammatory arachidonic acid cascades.' },
        { name: 'Excess Red Meat & High-Purine Foods', reason: 'Increases systemic inflammation and elevates uric acid crystallization in joints.' }
      );
    }

    if (superfoods.length < 3) {
      superfoods.push(
        { name: 'Rainbow Vegetables & Berries', reason: 'Packed with polyphenol antioxidants that combat cellular oxidative aging.' },
        { name: 'Extra Virgin Olive Oil', reason: 'Heart-healthy monounsaturated oleic acid that shields cellular membranes.' },
        { name: 'Sprouted Legumes & Chia Seeds', reason: 'Complete amino acids and prebiotics that nurture beneficial gut microbiome.' }
      );
    }

    if (foodsToAvoid.length < 3) {
      foodsToAvoid.push(
        { name: 'Ultra-Processed Packaged Snacks', reason: 'Loaded with chemical emulsifiers, artificial preservatives, and trans fats.' },
        { name: 'Deep Fried Fast Foods', reason: 'Creates high levels of advanced glycation end-products (AGEs) and oxidative stress.' },
        { name: 'Sugary Carbonated Beverages', reason: 'Empty calories that destabilize glucose homeostasis and drain bone minerals.' }
      );
    }

    let exercisePhilosophy = 'Progressive Functional Conditioning & Aerobic Health';
    let safeLevel = 'Moderate';
    let targetSteps = '8,000 - 10,000 steps/day';
    let dailyWorkoutMinutes = '30 - 45 minutes';

    if (hasJointPain || bmi >= 30) {
      exercisePhilosophy = 'Strictly Low-Impact, Joint-Preserving Cardio & Isometric Strength';
      safeLevel = 'Low-to-Moderate (Zero-Impact)';
      targetSteps = '6,000 - 8,000 gentle steps/day';
      dailyWorkoutMinutes = '25 - 35 minutes';
    } else if (hasHypertension) {
      exercisePhilosophy = 'Rhythmic Aerobic Endurance with Continuous Controlled Diaphragmatic Breathing';
      safeLevel = 'Moderate (Zone 2 Cardio)';
      targetSteps = '7,500 - 9,000 steps/day';
      dailyWorkoutMinutes = '30 - 40 minutes';
    } else if (numAge >= 55) {
      exercisePhilosophy = 'Balance, Postural Alignment, Bone Density & Functional Mobility';
      safeLevel = 'Moderate-Gentle';
      targetSteps = '6,500 - 8,500 steps/day';
      dailyWorkoutMinutes = '30 minutes';
    }

    const weeklySchedule = [
      {
        day: 'Monday',
        title: hasJointPain || bmi >= 30 ? 'Low-Impact Aerobic & Joint Mobility' : 'Cardiovascular Conditioning & Core',
        duration: '35 mins',
        exercises: hasJointPain || bmi >= 30
          ? '10 min warm-up walking on flat ground, 20 min stationary recumbent cycle (low resistance), 5 min gentle hamstring & calf stretches.'
          : hasHypertension
          ? '5 min warm-up, 25 min brisk outdoor walking or flat cycling at conversation pace (Zone 2), 5 min cooling breathwork.'
          : '8 min warm-up jog/walk, 20 min interval power walk/light run, 7 min core planks and bird-dogs.',
        benefit: 'Kickstarts weekly metabolic rate and boosts oxygen circulation.',
      },
      {
        day: 'Tuesday',
        title: 'Functional Resistance & Muscle Tone',
        duration: '30 mins',
        exercises: hasJointPain
          ? 'Seated leg extensions, wall push-ups, resistance band rows, glute bridges on mat. Avoid deep weighted squats.'
          : hasHypertension
          ? 'Light dumbbell rows, bodyweight squats to chair, resistance band chest press. (Strictly no breath holding / Valsalva).'
          : 'Bodyweight squats, push-ups (or incline), lunges, dumbbell shoulder press, resistance band pulls.',
        benefit: 'Increases lean muscle mass to improve glucose uptake and basal metabolism.',
      },
      {
        day: 'Wednesday',
        title: hasJointPain ? 'Aquatic Therapy or Gentle Elliptical' : 'Active Aerobic Stamina',
        duration: '35 mins',
        exercises: hasJointPain
          ? 'Water aerobics or continuous smooth elliptical striding with zero knee pounding.'
          : hasDiabetes
          ? 'Post-lunch 20 min brisk walking plus 15 min evening rhythmic cycling to deplete muscular glycogen.'
          : 'Moderate continuous cardio: cycling, swimming, brisk trail walking, or rowing machine.',
        benefit: 'Enhances stroke volume and vascular elasticity.',
      },
      {
        day: 'Thursday',
        title: 'Mobility, Flexibility & Spinal Decompression',
        duration: '25 mins',
        exercises: 'Gentle yoga flow, cat-cow stretches, thoracic spine openers, piriformis stretch, and 5 min deep diaphragmatic box breathing.',
        benefit: 'Relieves myofascial tension and reduces circulating cortisol.',
      },
      {
        day: 'Friday',
        title: 'Full-Body Functional Strength & Balance',
        duration: '30 mins',
        exercises: numAge >= 50
          ? 'Single-leg balance stands near wall, chair sits-to-stands, resistance band lateral walks, light bicep curls.'
          : 'Step-ups, dumbbell Romanian deadlifts, wall planks, resistance band face-pulls, seated Russian twists.',
        benefit: 'Builds functional stability for joint protection and fall prevention.',
      },
      {
        day: 'Saturday',
        title: 'Recreational Nature Movement & Social Activity',
        duration: '45 mins',
        exercises: 'Pleasant outdoor park walking, gardening, swimming with family, or light leisure cycling in clean fresh air.',
        benefit: 'Mental rejuvenation and natural vitamin D synthesis.',
      },
      {
        day: 'Sunday',
        title: 'Complete Rest & Regenerative Recovery',
        duration: '15 mins',
        exercises: 'Gentle 15-minute evening stroll, light foam rolling or warm Epsom salt bath, restful reading.',
        benefit: 'Enables central nervous system recovery and cellular tissue repair.',
      },
    ];

    const recommendedExercises = [];
    const exerciseCautions = [];

    if (hasJointPain || bmi >= 30) {
      recommendedExercises.push('Swimming and warm-water pool therapy', 'Stationary upright or recumbent cycling', 'Resistance bands and isometric holds', 'Flat-surface brisk walking with cushioned shoes');
      exerciseCautions.push('Avoid jumping rope, box jumps, or high-impact plyometrics', 'Avoid deep heavy squats below 90 degrees', 'Avoid running on asphalt or concrete');
    } else if (hasHypertension) {
      recommendedExercises.push('Brisk walking at a steady conversation pace', 'Low-resistance cycling and elliptical training', 'Light circuit training with high reps and minimal straining', 'Tai Chi and mindful walking');
      exerciseCautions.push('Strictly avoid holding breath during weight lifts (Valsalva maneuver)', 'Avoid heavy overhead presses that cause acute blood pressure spikes', 'Avoid rapid changes from lying down to sudden standing');
    } else if (hasDiabetes) {
      recommendedExercises.push('15 to 20-minute brisk walk within 30 minutes following main meals', 'Moderate resistance training 3x per week to enhance GLUT4 glucose transporter expression', 'Cycling, rowing, and outdoor walking');
      exerciseCautions.push('Always carry fast-acting glucose tablets or fruit in case of sudden hypoglycemia', 'Wear well-fitted athletic socks and inspect feet daily after exercise', 'Avoid strenuous workouts during peak insulin action without carbohydrate check');
    } else {
      recommendedExercises.push('Brisk walking and interval jogging', 'Compound strength training (squats, pushups, rows)', 'Swimming, cycling, and jump roping', 'Yoga and mobility drills');
      exerciseCautions.push('Always perform a 5-minute dynamic warm-up and 5-minute cool-down', 'Do not push through sharp joint pain', 'Stay hydrated throughout every session');
    }

    const lifestyleProtocols = [
      {
        title: 'Targeted Hydration Schedule',
        detail: `Drink ${dailyWaterLiters} liters of clean water daily. Drink 2 glasses upon waking, 1 glass 30 minutes before each meal, and avoid heavy drinking during meals.`,
      },
      {
        title: 'Restorative Sleep Architecture',
        detail: 'Aim for 7 to 8.5 hours of uninterrupted sleep. Keep bedroom pitch-dark and cool (18-20°C). Turn off blue-light devices 60 minutes before bed.',
      },
      {
        title: '4-7-8 Breathing for Blood Pressure & Cortisol',
        detail: 'Inhale through nose for 4 seconds, hold breath for 7 seconds, exhale slowly through mouth for 8 seconds. Perform 4 rounds twice daily.',
      },
    ];

    return {
      userInput: {
        height: numHeight,
        weight: numWeight,
        age: numAge,
        gender: payload.gender,
        activityLevel: payload.activityLevel,
        healthIssues: payload.healthIssues,
        otherNotes: payload.otherNotes,
        goal: payload.goal,
      },
      metrics: {
        bmi,
        bmiCategory,
        bmiColor,
        healthyWeightRange: `${minHealthyWeight} kg - ${maxHealthyWeight} kg`,
        bmrCalories: `${bmr} kcal/day`,
        tdeeCalories: `${tdee} kcal/day`,
        targetDailyCalories: `${targetCalories} kcal/day`,
        dailyWaterLiters: `${dailyWaterLiters} Liters`,
        targetSteps,
        dailyWorkoutMinutes,
      },
      nutritionPlan: {
        strategyTitle: dietStrategyTitle,
        strategyDescription: dietStrategyDesc,
        mealPlan,
        superfoods,
        foodsToAvoid,
      },
      exercisePlan: {
        philosophy: exercisePhilosophy,
        safetyLevel: safeLevel,
        weeklySchedule,
        recommendedExercises,
        exerciseCautions,
      },
      lifestyleProtocols,
    };
  };

  const handleGeneratePlan = async (e) => {
    e?.preventDefault();
    setGenerating(true);

    const payload = {
      height: parseFloat(height) || 170,
      weight: parseFloat(weight) || 70,
      age: parseInt(age, 10) || 30,
      gender,
      activityLevel,
      healthIssues: selectedIssues,
      otherNotes,
      goal,
    };

    try {
      // First try backend API
      const res = await healthcareService.generatePlan(payload);
      if (res?.success && res?.data) {
        setGeneratedPlan(res.data);
      } else {
        // Fallback locally
        const local = generatePlanLocally(payload);
        setGeneratedPlan(local);
      }
    } catch (err) {
      console.warn('Backend call failed, using client generator:', err);
      const local = generatePlanLocally(payload);
      setGeneratedPlan(local);
    } finally {
      setGenerating(false);
      setTimeout(() => {
        planRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  const handleCopyPlan = () => {
    if (!generatedPlan) return;
    const text = `
MediBridge Personalized Healthcare Assistance Plan
------------------------------------------------
Vitals: Age: ${generatedPlan.userInput.age} | Height: ${generatedPlan.userInput.height}cm | Weight: ${generatedPlan.userInput.weight}kg | BMI: ${generatedPlan.metrics.bmi} (${generatedPlan.metrics.bmiCategory})
Daily Calorie Target: ${generatedPlan.metrics.targetDailyCalories} | Daily Hydration: ${generatedPlan.metrics.dailyWaterLiters}
Target Daily Steps: ${generatedPlan.metrics.targetSteps}

DIET & NUTRITION STRATEGY:
${generatedPlan.nutritionPlan.strategyTitle}
${generatedPlan.nutritionPlan.strategyDescription}

RECOMMENDED SUPERFOODS:
${generatedPlan.nutritionPlan.superfoods.map((s) => `• ${s.name}: ${s.reason}`).join('\n')}

FOODS TO AVOID:
${generatedPlan.nutritionPlan.foodsToAvoid.map((f) => `• ${f.name}: ${f.reason}`).join('\n')}

EXERCISE PHILOSOPHY:
${generatedPlan.exercisePlan.philosophy} (${generatedPlan.exercisePlan.safetyLevel})
Daily Workout: ${generatedPlan.metrics.dailyWorkoutMinutes}

7-DAY EXERCISE ROUTINE:
${generatedPlan.exercisePlan.weeklySchedule.map((w) => `${w.day} (${w.duration}): ${w.title} - ${w.exercises}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  // Height conversion helper
  const heightInInches = Math.round((parseFloat(height) || 170) / 2.54);
  const feet = Math.floor(heightInInches / 12);
  const inches = heightInInches % 12;

  // Weight conversion helper
  const weightLbs = Math.round((parseFloat(weight) || 70) * 2.20462);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-blue-100 border border-white/20">
          <Stethoscope className="w-3.5 h-3.5" /> Biometric Clinical Guidance Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Healthcare Assistance & Guidance Hub
        </h1>
        <p className="text-sm sm:text-base text-blue-100 max-w-3xl leading-relaxed">
          Input your biometrics (height, weight, age) and health conditions to generate a personalized health care
          assistance blueprint with a scientifically customized healthy diet, meal plan, and exercise regimen.
        </p>
      </div>

      {/* Mandatory Safety Alert */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">MEDICAL DISCLAIMER: </span>
          {disclaimer ||
            'This assistance plan is formulated for general wellness guidance and evidence-informed educational support. Always consult a licensed medical doctor or registered dietitian for specific medical treatment, prescription interactions, or acute conditions.'}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setTab('ASSISTANCE')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            tab === 'ASSISTANCE'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600" /> Personalized Healthcare Assistance
        </button>

        <button
          onClick={() => setTab('FIRST_AID')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            tab === 'FIRST_AID'
              ? 'border-blue-600 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4 text-blue-600" /> First-Aid Guides
        </button>

        <button
          onClick={() => setTab('SELF_CARE')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 flex items-center gap-2 transition-all shrink-0 ${
            tab === 'SELF_CARE'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-600" /> Natural Self-Care Library
        </button>
      </div>

      {/* TAB 1: PERSONALIZED HEALTHCARE ASSISTANCE GENERATOR */}
      {tab === 'ASSISTANCE' && (
        <div className="space-y-8">
          {/* Preset Profiles Bar */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
            <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>⚡ Quick Load Sample Health Profiles:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROFILES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(preset.data)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-700 transition-all shadow-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Biometrics Input Form */}
          <form
            onSubmit={handleGeneratePlan}
            className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6"
          >
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" /> Step 1: Your Biometric Profile & Demographics
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Accurate height, weight, and age allow exact calculation of your BMI, basal metabolism (BMR), and daily hydration demand.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Height */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Height (cm) *</label>
                  <span className="text-[11px] font-medium text-slate-500">
                    ≈ {feet}'{inches}"
                  </span>
                </div>
                <div className="relative">
                  <Scale className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="100"
                    max="250"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="170"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Weight (kg) *</label>
                  <span className="text-[11px] font-medium text-slate-500">≈ {weightLbs} lbs</span>
                </div>
                <div className="relative">
                  <Scale className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="30"
                    max="300"
                    step="0.5"
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="70"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Age (years) *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="number"
                    min="10"
                    max="110"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="30"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Biological Sex */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Biological Sex</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="male">Male (Mifflin BMR formula)</option>
                  <option value="female">Female (Mifflin BMR formula)</option>
                  <option value="other">Other / Non-binary</option>
                </select>
              </div>
            </div>

            {/* Activity Level & Primary Goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Daily Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="sedentary">Sedentary (Little/no exercise, desk job)</option>
                  <option value="light">Lightly Active (Light exercise 1-3 days/week)</option>
                  <option value="moderate">Moderately Active (Moderate exercise 3-5 days/week)</option>
                  <option value="very_active">Very Active (Hard exercise 6-7 days/week)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Primary Health Target / Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="weight_loss">Healthy Weight Loss & Fat Burning</option>
                  <option value="blood_sugar">Blood Sugar & Insulin Stability</option>
                  <option value="heart_health">Cardiovascular & Blood Pressure Health</option>
                  <option value="joint_mobility">Joint Mobility & Pain Alleviation</option>
                  <option value="muscle_gain">Lean Muscle Conditioning & Strength</option>
                  <option value="healthy_lifestyle">General Vitality & Longevity</option>
                </select>
              </div>
            </div>

            {/* Step 2: Health Issues Selection */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-red-600" /> Step 2: Existing Health Issues & Medical Conditions
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select all that apply. Your nutrition blueprint and exercise intensity will be strictly customized to protect against adverse flare-ups.
                </p>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {COMMON_HEALTH_ISSUES.map((issue) => {
                  const isSelected = selectedIssues.includes(issue.id);
                  return (
                    <button
                      type="button"
                      key={issue.id}
                      onClick={() => toggleIssue(issue.id)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{issue.icon}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                      <span className="text-xs font-bold leading-tight">{issue.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Extra notes textarea */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Additional Symptoms, Allergies, or Medications (Optional)
                </label>
                <textarea
                  rows="2"
                  value={otherNotes}
                  onChange={(e) => setOtherNotes(e.target.value)}
                  placeholder="e.g. Mild lower back stiffness in mornings, peanut sensitivity, taking Metformin or Lisinopril..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% private biometric evaluation based on clinical nutritional guidelines</span>
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" /> Generating Healthcare Assistance Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate My Healthcare Assistance Plan
                  </>
                )}
              </button>
            </div>
          </form>

          {/* GENERATED HEALTHCARE PLAN DISPLAY */}
          {generatedPlan && (
            <div ref={planRef} className="space-y-8 pt-4">
              {/* Plan Action Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Personalized Health Care Assistance Blueprint Ready
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Generated for: {generatedPlan.userInput.age} yrs • {generatedPlan.userInput.height} cm •{' '}
                      {generatedPlan.userInput.weight} kg
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleCopyPlan}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-700 hover:bg-blue-100 flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save PDF</span>
                  </button>
                </div>
              </div>

              {/* 4 BIOMETRIC INTELLIGENCE METRIC CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. BMI Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-blue-600" /> Body Mass Index (BMI)
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        generatedPlan.metrics.bmiColor === 'emerald'
                          ? 'bg-emerald-100 text-emerald-800'
                          : generatedPlan.metrics.bmiColor === 'amber'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {generatedPlan.metrics.bmiCategory}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{generatedPlan.metrics.bmi}</div>
                  <p className="text-[11px] text-slate-500">
                    Healthy weight target: <strong className="text-slate-700">{generatedPlan.metrics.healthyWeightRange}</strong>
                  </p>
                </div>

                {/* 2. Caloric Energy Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-orange-600" /> Daily Caloric Target
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                      BMR: {generatedPlan.metrics.bmrCalories}
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {generatedPlan.metrics.targetDailyCalories}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    TDEE Burn: <strong className="text-slate-700">{generatedPlan.metrics.tdeeCalories}</strong>
                  </p>
                </div>

                {/* 3. Hydration Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-cyan-600" /> Optimal Daily Water
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 text-cyan-800">
                      35ml / kg
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {generatedPlan.metrics.dailyWaterLiters}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Approx <strong className="text-slate-700">10 - 12 glasses</strong> distributed across daytime
                  </p>
                </div>

                {/* 4. Target Activity Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Footprints className="w-4 h-4 text-emerald-600" /> Target Movement
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Daily
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">{generatedPlan.metrics.targetSteps}</div>
                  <p className="text-[11px] text-slate-500">
                    Workout: <strong className="text-slate-700">{generatedPlan.metrics.dailyWorkoutMinutes}</strong>
                  </p>
                </div>
              </div>

              {/* SECTION: HEALTHY FOOD & DIET PLAN */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                      <Utensils className="w-3.5 h-3.5" /> Medical Nutrition Therapy
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {generatedPlan.nutritionPlan.strategyTitle}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 max-w-xs sm:text-right">
                    Tuned for: {generatedPlan.userInput.healthIssues.join(', ')}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  {generatedPlan.nutritionPlan.strategyDescription}
                </p>

                {/* Meal-by-Meal Structured Daily Timeline */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" /> Personalized Daily Meal Schedule
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(generatedPlan.nutritionPlan.mealPlan).map(([key, meal]) => (
                      <div
                        key={key}
                        className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-blue-100 text-blue-800">
                            {meal.time}
                          </span>
                          <span className="text-xs font-bold text-slate-700">{meal.title}</span>
                        </div>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">{meal.suggestion}</p>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 border-t border-slate-200/50">
                          <Info className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{meal.benefit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Superfoods vs Foods to Avoid Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  {/* Superfoods */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Target Superfoods to Prioritize</span>
                    </div>
                    <div className="space-y-2">
                      {generatedPlan.nutritionPlan.superfoods.map((food, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                          <div className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            {food.name}
                          </div>
                          <p className="text-[11px] text-emerald-800 leading-normal pl-3.5">{food.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Foods to Avoid */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>Foods to Strictly Avoid or Minimize</span>
                    </div>
                    <div className="space-y-2">
                      {generatedPlan.nutritionPlan.foodsToAvoid.map((food, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80 space-y-1">
                          <div className="font-bold text-xs text-rose-950 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            {food.name}
                          </div>
                          <p className="text-[11px] text-rose-800 leading-normal pl-3.5">{food.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: PERSONALIZED EXERCISE & PHYSICAL ACTIVITY PLAN */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-2">
                      <Dumbbell className="w-3.5 h-3.5" /> Tailored Physical Activity Prescription
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      {generatedPlan.exercisePlan.philosophy}
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 self-start sm:self-auto">
                    Intensity: {generatedPlan.exercisePlan.safetyLevel}
                  </span>
                </div>

                {/* 7-Day Weekly Breakdown Cards */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" /> 7-Day Structured Workout Regimen
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold">
                      Target: {generatedPlan.metrics.dailyWorkoutMinutes} / session
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generatedPlan.exercisePlan.weeklySchedule.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                          item.day === 'Sunday'
                            ? 'bg-amber-50/50 border-amber-200'
                            : 'bg-slate-50/80 border-slate-200 hover:border-blue-300'
                        } transition-colors`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-blue-700 uppercase tracking-wider">
                              {item.day}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200/70 text-slate-700">
                              {item.duration}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-sm">{item.title}</div>
                          <p className="text-xs text-slate-700 leading-relaxed">{item.exercises}</p>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200/60 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{item.benefit}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Exercise Dos & Don'ts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-3">
                    <div className="font-bold text-sm text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Recommended Safe Exercises
                    </div>
                    <ul className="space-y-2">
                      {generatedPlan.exercisePlan.recommendedExercises.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="font-bold text-sm text-rose-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Movements to Strictly Avoid / Precautions
                    </div>
                    <ul className="space-y-2">
                      {generatedPlan.exercisePlan.exerciseCautions.map((caut, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-rose-50/50 p-2.5 rounded-xl border border-rose-100">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                          <span>{caut}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION: LIFESTYLE, RECOVERY & SLEEP PROTOCOLS */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <Moon className="w-4 h-4" /> Circadian Recovery & Nervous System Optimization
                </div>
                <h3 className="text-xl font-bold">Daily Restorative Lifestyle Habits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  {generatedPlan.lifestyleProtocols.map((proto, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1.5">
                      <div className="font-bold text-sm text-indigo-200">{proto.title}</div>
                      <p className="text-xs text-slate-300 leading-relaxed">{proto.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FIRST-AID GUIDANCE */}
      {tab === 'FIRST_AID' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-6 h-6 text-blue-600" /> Evidence-Based First-Aid Steps
            </h2>
            <p className="text-xs text-slate-500">
              Immediate action steps for common medical emergencies and urgent home treatment protocols.
            </p>
          </div>

          {loadingArticles ? (
            <div className="py-12 text-center text-slate-500 text-xs font-semibold">Loading guides...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {firstAidArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                      {article.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-2">{article.title}</h3>
                    <p className="text-xs text-slate-500">{article.summary}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-800">Immediate Action Steps:</div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {article.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {article.avoid && article.avoid.length > 0 && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 space-y-1 text-xs text-red-900">
                      <div className="font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> What to Avoid:
                      </div>
                      <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                        {article.avoid.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <span className="font-bold">When to seek emergency care: </span>
                    {article.emergencySigns}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NATURAL SELF-CARE */}
      {tab === 'SELF_CARE' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-600" /> Natural Self-Care Practices
            </h2>
            <p className="text-xs text-slate-500">
              Evidence-informed natural self-care, herbal teas, and lifestyle recommendations.
            </p>
          </div>

          {loadingArticles ? (
            <div className="py-12 text-center text-slate-500 text-xs font-semibold">Loading guides...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selfCareArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                      {article.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mt-2">{article.title}</h3>
                    <p className="text-xs text-slate-500">{article.summary}</p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="text-xs font-bold text-slate-800">Self-Care Recommendations:</div>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {article.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
