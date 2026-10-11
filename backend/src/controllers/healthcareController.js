import { prisma } from '../config/db.js';
import { MEDICAL_DISCLAIMER } from '../utils/safetyRules.js';

export const getFirstAidArticles = async (req, res, next) => {
  try {
    const articles = await prisma.firstAidContent.findMany({
      where: { published: true },
      orderBy: { title: 'asc' },
    });

    const parsed = articles.map((a) => ({
      ...a,
      steps: JSON.parse(a.stepsJson || '[]'),
      avoid: JSON.parse(a.avoidJson || '[]'),
    }));

    res.json({
      success: true,
      message: 'First-aid guidance articles.',
      disclaimer: MEDICAL_DISCLAIMER,
      data: { articles: parsed },
    });
  } catch (error) {
    next(error);
  }
};

export const getSelfCareArticles = async (req, res, next) => {
  try {
    const articles = await prisma.selfCareContent.findMany({
      where: { published: true },
      orderBy: { title: 'asc' },
    });

    const parsed = articles.map((a) => ({
      ...a,
      tips: JSON.parse(a.tipsJson || '[]'),
      precautions: JSON.parse(a.precautionsJson || '[]'),
    }));

    res.json({
      success: true,
      message: 'Natural self-care guidance articles.',
      disclaimer: MEDICAL_DISCLAIMER,
      data: { articles: parsed },
    });
  } catch (error) {
    next(error);
  }
};

export const generateHealthcarePlan = async (req, res, next) => {
  try {
    const {
      height, // in cm
      weight, // in kg
      age, // in years
      gender = 'male',
      activityLevel = 'sedentary',
      healthIssues = [],
      otherNotes = '',
      goal = 'healthy_lifestyle',
    } = req.body;

    const numHeight = parseFloat(height);
    const numWeight = parseFloat(weight);
    const numAge = parseInt(age, 10);

    if (!numHeight || !numWeight || !numAge || numHeight <= 0 || numWeight <= 0 || numAge <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid height (cm), weight (kg), and age are required.',
        data: null,
      });
    }

    // 1. Biometric calculations
    const heightInMeters = numHeight / 100;
    const bmi = parseFloat((numWeight / (heightInMeters * heightInMeters)).toFixed(1));

    let bmiCategory = 'Normal weight';
    let bmiColor = 'emerald';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'blue';
    } else if (bmi >= 18.5 && bmi < 25) {
      bmiCategory = 'Normal healthy weight';
      bmiColor = 'emerald';
    } else if (bmi >= 25 && bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'amber';
    } else {
      bmiCategory = 'Obesity range';
      bmiColor = 'rose';
    }

    const minHealthyWeight = parseFloat((18.5 * heightInMeters * heightInMeters).toFixed(1));
    const maxHealthyWeight = parseFloat((24.9 * heightInMeters * heightInMeters).toFixed(1));

    // BMR using Mifflin-St Jeor equation
    let bmr = 10 * numWeight + 6.25 * numHeight - 5 * numAge;
    if (gender === 'female') {
      bmr -= 161;
    } else if (gender === 'other') {
      bmr -= 78;
    } else {
      bmr += 5;
    }
    bmr = Math.round(bmr);

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
    };
    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const tdee = Math.round(bmr * multiplier);

    let targetCalories = tdee;
    if (goal === 'weight_loss' || (bmi >= 25 && goal !== 'muscle_gain')) {
      targetCalories = Math.max(Math.round(tdee - 450), bmr);
    } else if (goal === 'muscle_gain' || bmi < 18.5) {
      targetCalories = Math.round(tdee + 350);
    }

    const dailyWaterLiters = parseFloat((numWeight * 0.035).toFixed(1));

    // Normalize health issues
    const issuesArray = Array.isArray(healthIssues)
      ? healthIssues
      : typeof healthIssues === 'string'
      ? healthIssues.split(',').map((s) => s.trim())
      : [];

    const issuesString = (issuesArray.join(' ') + ' ' + (otherNotes || '')).toLowerCase();
    const hasDiabetes = issuesString.includes('diabet') || issuesString.includes('sugar') || issuesString.includes('glucose');
    const hasHypertension = issuesString.includes('hypertens') || issuesString.includes('blood pressure') || issuesString.includes('bp');
    const hasCholesterol = issuesString.includes('cholesterol') || issuesString.includes('cardio') || issuesString.includes('heart');
    const hasJointPain = issuesString.includes('joint') || issuesString.includes('arthrit') || issuesString.includes('knee') || issuesString.includes('osteopor');
    const hasAsthma = issuesString.includes('asthma') || issuesString.includes('respirat') || issuesString.includes('breath');
    const hasGERD = issuesString.includes('gerd') || issuesString.includes('reflux') || issuesString.includes('acid') || issuesString.includes('gastrit');
    const hasThyroid = issuesString.includes('thyroid') || issuesString.includes('hypothyroid');
    const hasPCOS = issuesString.includes('pcos') || issuesString.includes('pcod') || issuesString.includes('hormon');

    // 2. Personalized Food & Nutrition Strategy
    let dietStrategyTitle = 'Balanced Whole-Food Mediterranean Wellness Diet';
    let dietStrategyDesc = 'Emphasizes nutrient-dense unprocessed whole foods, lean proteins, high fiber, and antioxidant rich produce.';

    if (hasDiabetes && hasHypertension) {
      dietStrategyTitle = 'Cardio-Metabolic DASH & Low-Glycemic Protocol';
      dietStrategyDesc = 'Sodium-restricted under 1,500mg daily, high potassium, rich in soluble fiber and low glycemic carbohydrates to optimize both insulin sensitivity and arterial pressure.';
    } else if (hasDiabetes) {
      dietStrategyTitle = 'Low-Glycemic Stabilizing Nutrition Plan';
      dietStrategyDesc = 'Focuses on complex carbohydrates with high soluble fiber, steady insulin release, and eliminating refined sugars and starch spikes.';
    } else if (hasHypertension) {
      dietStrategyTitle = 'Cardiovascular DASH Dietary Protocol';
      dietStrategyDesc = 'Focused on potassium, magnesium, and calcium-dense whole foods with sodium strictly restricted to protect vascular endothelium.';
    } else if (hasJointPain) {
      dietStrategyTitle = 'Anti-Inflammatory Joint & Cartilage Recovery Plan';
      dietStrategyDesc = 'High in omega-3 fatty acids, polyphenols, turmeric, ginger, and collagen co-factors while eliminating inflammatory pro-inflammatory seed oils.';
    } else if (hasGERD) {
      dietStrategyTitle = 'Alkaline & Gut-Soothing Digestive Plan';
      dietStrategyDesc = 'Low-acid, non-citrus, small portioned meals that prevent acid reflux and reduce gastric mucosal irritation.';
    }

    // Meal by meal schedule
    const mealPlan = {
      morningWakeup: {
        time: '07:00 AM',
        title: 'Morning Awakening & Metabolic Ignition',
        suggestion: hasDiabetes
          ? 'Warm water (300ml) with 1 tsp soaked fenugreek seeds or cinnamon stick infusion.'
          : hasHypertension
          ? 'Warm lemon-garlic or hibiscus water (300ml) to promote vascular relaxation.'
          : hasGERD
          ? 'Room-temperature water with 1 tbsp soaked chia seeds or fennel infusion (no lemon).'
          : 'Warm water (350ml) with freshly squeezed lemon and 1 tsp chia seeds.',
        benefit: 'Rehydrates tissues after sleep and stimulates digestive motility.',
      },
      breakfast: {
        time: '08:30 AM',
        title: 'Nutrient-Dense Breakfast',
        suggestion: hasDiabetes
          ? 'Vegetable omelet (2 eggs or tofu scramble) with spinach, bell peppers, and 1 slice 100% sprouted grain toast, topped with 1/4 avocado.'
          : hasHypertension
          ? 'Steel-cut oatmeal prepared with unsweetened almond milk, topped with sliced banana (potassium), ground flaxseeds, and blueberries.'
          : hasGERD
          ? 'Warm rolled oatmeal cooked with oat milk, sliced banana, and a drizzle of pure maple syrup, paired with boiled egg whites.'
          : 'High-protein Greek yogurt bowl (or oatmeal) topped with chia seeds, raw walnuts, and mixed berries.',
        benefit: 'Balances morning cortisol and delivers sustained low-glycemic fuel.',
      },
      midDayHydration: {
        time: '11:00 AM',
        title: 'Mid-Morning Hydration & Vitality',
        suggestion: hasAsthma
          ? 'Warm ginger-honey infusion with 5 soaked almonds.'
          : hasHypertension
          ? 'Fresh celery-cucumber-beetroot cold pressed shot (natural nitric oxide).'
          : 'Green tea or chamomile infusion accompanied by a handful of raw pumpkin seeds and walnuts.',
        benefit: 'Sustains cognitive focus and supports cellular fluid balance.',
      },
      lunch: {
        time: '01:30 PM',
        title: 'Balanced Power Lunch Plate (50% Veggies, 25% Lean Protein, 25% Fiber Carbs)',
        suggestion: hasJointPain
          ? 'Grilled wild salmon or lentil stew, steamed broccoli and turmeric roasted cauliflower, with quinoa and olive oil dressing.'
          : hasDiabetes
          ? 'Grilled chicken breast or tofu steak with a large salad of dark leafy greens, chickpeas, and olive oil vinaigrette.'
          : 'Grilled lean protein (chicken/fish/tofu/paneer), rainbow stir-fried vegetables, and a side of brown rice or quinoa.',
        benefit: 'Maintains steady postprandial glucose and provides clean building blocks.',
      },
      eveningSnack: {
        time: '05:00 PM',
        title: 'Afternoon Rejuvenator Snack',
        suggestion: hasDiabetes
          ? 'Handful of roasted chickpeas or cucumber slices with 2 tbsp hummus.'
          : hasGERD
          ? 'Ripe papaya slices or a small banana with coconut water.'
          : 'Handful of unsalted raw almonds and walnuts with a cup of soothing herbal tea.',
        benefit: 'Prevents late-afternoon energy crashes and binge-eating at dinner.',
      },
      dinner: {
        time: '07:30 PM',
        title: 'Restorative & Light Evening Meal',
        suggestion: hasGERD
          ? 'Steamed zucchini, carrots, and poached chicken or tofu in light vegetable broth (finish at least 3 hours before sleeping).'
          : hasHypertension
          ? 'Baked white fish or roasted paneer with garlic sautéed spinach, steamed asparagus, and sweet potato mash (low sodium).'
          : 'Vegetable and lentil soup or grilled protein with a bowl of warm sautéed seasonal greens.',
        benefit: 'Easy on the digestive tract to ensure deep regenerative slow-wave sleep.',
      },
      nightRoutine: {
        time: '09:30 PM',
        title: 'Evening Calming Tonic',
        suggestion: 'Warm chamomile or golden turmeric almond milk (with a pinch of black pepper) 45 minutes before bedtime.',
        benefit: 'Lowers systemic inflammation and triggers natural melatonin secretion.',
      },
    };

    // Condition-tailored Superfoods
    const superfoods = [];
    const foodsToAvoid = [];

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

    if (hasCholesterol) {
      superfoods.push(
        { name: 'Oats & Barley (Beta-Glucan)', reason: 'Soluble viscous fiber binds to bile acids in the gut and flushes out excess LDL cholesterol.' },
        { name: 'Raw Walnuts & Flaxseeds', reason: 'Plant omega-3 (ALA) protects against endothelial inflammation and prevents plaque.' }
      );
      foodsToAvoid.push(
        { name: 'Palm Oil & Trans-Fat Fried Foods', reason: 'Elevates circulating atherogenic LDL particles and promotes arterial stiffness.' },
        { name: 'Commercial Bakery Shortenings', reason: 'Hydrogenated fats severely deplete protective HDL while spiking LDL.' }
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

    if (hasGERD) {
      superfoods.push(
        { name: 'Oatmeal, Papaya & Bananas', reason: 'Alkaline whole foods that coat the esophageal lining without triggering acid production.' },
        { name: 'Fennel & Chamomile Tea', reason: 'Relaxes smooth gastrointestinal muscles and calms digestive spasms.' }
      );
      foodsToAvoid.push(
        { name: 'Citrus, Tomatoes & Vinegar', reason: 'Directly irritates inflamed esophageal tissues due to low pH.' },
        { name: 'Deep Fried Greasy Meals', reason: 'Delays gastric emptying and weakens the lower esophageal sphincter valve.' },
        { name: 'Chocolate, Mint & Carbonated Sodas', reason: 'Relaxes the esophageal sphincter and creates gas pressure.' }
      );
    }

    // Default healthy additions if few or no conditions
    if (superfoods.length < 3) {
      superfoods.push(
        { name: 'Rainbow Vegetables & Berries', reason: 'Packed with polyphenol antioxidants that combat cellular aging.' },
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

    // 3. Personalized Exercise & Activity Plan
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

    // Weekly workout breakdown
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

    // Safe recommendations and avoids
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
    } else if (hasAsthma) {
      recommendedExercises.push('Swimming in indoor humid environments', 'Walking and cycling with 10-minute progressive warm-up', 'Yoga and diaphragmatic pranayama breathing');
      exerciseCautions.push('Avoid exercising in dry, cold outdoor air without a protective face covering', 'Avoid sudden explosive sprints without a thorough warm-up', 'Always keep rescue inhaler within arm\'s reach');
    } else {
      recommendedExercises.push('Brisk walking and interval jogging', 'Compound strength training (squats, pushups, rows)', 'Swimming, cycling, and jump roping', 'Yoga and mobility drills');
      exerciseCautions.push('Always perform a 5-minute dynamic warm-up and 5-minute cool-down', 'Do not push through sharp joint pain', 'Stay hydrated throughout every session');
    }

    // 4. Lifestyle & Habit Prescriptions
    const lifestyleProtocols = [
      {
        title: 'Hydration Schedule',
        detail: `Drink ${dailyWaterLiters} liters of clean water daily. Drink 2 glasses upon waking, 1 glass 30 minutes before each meal, and avoid heavy drinking during meals.`,
      },
      {
        title: 'Restorative Sleep Architecture',
        detail: 'Aim for 7 to 8.5 hours of uninterrupted sleep. Keep the bedroom dark and cool (18-20°C). Turn off blue-light screens 60 minutes before bed.',
      },
      {
        title: '4-7-8 Breathing for Stress Reduction',
        detail: 'Inhale through nose for 4 seconds, hold breath for 7 seconds, exhale slowly through mouth for 8 seconds. Perform 4 rounds twice daily to lower cortisol.',
      },
    ];

    res.json({
      success: true,
      message: 'Personalized Healthcare Assistance Plan generated successfully.',
      disclaimer: MEDICAL_DISCLAIMER,
      data: {
        userInput: {
          height: numHeight,
          weight: numWeight,
          age: numAge,
          gender,
          activityLevel,
          healthIssues: issuesArray,
          otherNotes,
          goal,
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
      },
    });
  } catch (error) {
    next(error);
  }
};

