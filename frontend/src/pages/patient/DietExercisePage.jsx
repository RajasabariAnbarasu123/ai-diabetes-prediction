import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Button,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GrainIcon from '@mui/icons-material/Grain';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import PoolIcon from '@mui/icons-material/Pool';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RepeatIcon from '@mui/icons-material/Repeat';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import predictionService from '../../services/predictionService';
import aiService from '../../services/aiService';

const MEAL_ICONS = {
  breakfast: <WbSunnyIcon />,
  lunch: <LunchDiningIcon />,
  dinner: <DinnerDiningIcon />,
  snacks: <LocalCafeIcon />,
};

const MEAL_COLORS = {
  breakfast: { bg: '#f59e0b15', border: '#f59e0b30', color: '#f59e0b', grad: 'linear-gradient(135deg, #f59e0b20, #fbbf2410)' },
  lunch: { bg: '#22c55e15', border: '#22c55e30', color: '#22c55e', grad: 'linear-gradient(135deg, #22c55e20, #4ade8010)' },
  dinner: { bg: '#6366f115', border: '#6366f130', color: '#6366f1', grad: 'linear-gradient(135deg, #6366f120, #818cf810)' },
  snacks: { bg: '#ef444415', border: '#ef444430', color: '#ef4444', grad: 'linear-gradient(135deg, #ef444420, #f8717110)' },
};

const ACTIVITY_CONFIG = {
  walking: { icon: <DirectionsWalkIcon />, color: '#22c55e', grad: 'linear-gradient(135deg, #22c55e20, #4ade8010)' },
  running: { icon: <DirectionsRunIcon />, color: '#ef4444', grad: 'linear-gradient(135deg, #ef444420, #f8717110)' },
  yoga: { icon: <SelfImprovementIcon />, color: '#8b5cf6', grad: 'linear-gradient(135deg, #8b5cf620, #a78bfa10)' },
  cycling: { icon: <PedalBikeIcon />, color: '#06b6d4', grad: 'linear-gradient(135deg, #06b6d420, #22d3ee10)' },
  swimming: { icon: <PoolIcon />, color: '#3b82f6', grad: 'linear-gradient(135deg, #3b82f620, #60a5fa10)' },
  stretching: { icon: <SelfImprovementIcon />, color: '#f59e0b', grad: 'linear-gradient(135deg, #f59e0b20, #fbbf2410)' },
  strength: { icon: <FitnessCenterIcon />, color: '#6366f1', grad: 'linear-gradient(135deg, #6366f120, #818cf810)' },
};

const getActivityConfig = (type) => ACTIVITY_CONFIG[type?.toLowerCase()] || ACTIVITY_CONFIG.walking;

// Compute combined AI recommendations based on historical predictions & AI service responses
const computeAiRecommendations = (predictions, aiDietPlan, aiExercisePlan) => {
  if (!predictions || predictions.length === 0) return null;

  const latest = predictions[predictions.length - 1];
  const totalAssessments = predictions.length;

  const riskLevel = String(latest.diabetesRisk || 'Low').toLowerCase();
  const hba1c = latest.hba1c || 0;
  const bmi = latest.bmi || (latest.height && latest.weight ? latest.weight / ((latest.height / 100) ** 2) : 0);
  const fbs = latest.fastingBloodSugar || 0;
  const cholesterol = latest.cholesterol || 0;

  const isHighRisk = riskLevel === 'high' || hba1c > 6.5;
  const isModerateRisk = riskLevel === 'moderate' || (hba1c > 5.7 && hba1c <= 6.5);
  const isOverweight = bmi > 25;

  // AI Diet Guidance & Meals from AI Service response or Latest Prediction AI output
  const dietAdvice = aiDietPlan?.generalAdvice || latest.personalizedDiet || (
    isHighRisk
      ? 'AI Alert: High risk indicators detected from prediction history. Prioritize strict low-glycemic foods, avoid simple sugars, and maintain portion control.'
      : isModerateRisk
      ? 'AI Insight: Pre-diabetic indicators detected. A balanced low-GI diet with high fiber will help stabilize glucose and reverse risk.'
      : 'AI Advice: Metabolic metrics are in normal range. Maintain current balanced nutrition to ensure long-term health.'
  );

  const breakfastOptions = (aiDietPlan?.breakfast && aiDietPlan.breakfast.length > 0)
    ? aiDietPlan.breakfast
    : (isHighRisk
        ? ['Steel-cut oats with cinnamon & berries', 'Whole wheat toast with avocado & eggs', 'Greek yogurt with flaxseeds']
        : ['Oatmeal with banana & almonds', 'Multigrain toast with peanut butter', 'Fruit smoothie with chia seeds']);

  const lunchOptions = (aiDietPlan?.lunch && aiDietPlan.lunch.length > 0)
    ? aiDietPlan.lunch
    : (isHighRisk
        ? ['Grilled chicken salad with olive oil dressing', 'Brown rice with dal & green veggies', 'Quinoa bowl with tofu & spinach']
        : ['Brown rice with mixed vegetable curry', 'Whole wheat roti with dal & salad', 'Grilled fish with steamed broccoli']);

  const dinnerOptions = (aiDietPlan?.dinner && aiDietPlan.dinner.length > 0)
    ? aiDietPlan.dinner
    : (isHighRisk
        ? ['Grilled salmon with steamed asparagus', 'Lentil soup with side salad', 'Tofu stir-fry with cauliflower rice']
        : ['Whole wheat roti with vegetable curry', 'Rice with dal & cucumber salad', 'Grilled chicken with sweet potato']);

  const snackOptions = (aiDietPlan?.snacks && aiDietPlan.snacks.length > 0)
    ? aiDietPlan.snacks
    : ['Handful of mixed nuts (almonds, walnuts)', 'Apple slices with peanut butter', 'Carrot & cucumber sticks with hummus'];

  // AI Recommended Foods & Foods to Avoid
  const goodFoods = (aiDietPlan?.foodsToEat && aiDietPlan.foodsToEat.length > 0)
    ? aiDietPlan.foodsToEat
    : (latest.foodsToEat
        ? latest.foodsToEat.split(', ').filter(Boolean)
        : ['Non-starchy vegetables (spinach, broccoli, peppers)', 'Whole grains (brown rice, oats, quinoa)', 'Lean protein (fish, poultry, legumes, tofu)', 'Healthy fats (avocado, walnuts, olive oil)', 'Low-glycemic fruits (berries, green apples)']);

  const avoidFoods = (aiDietPlan?.foodsToAvoid && aiDietPlan.foodsToAvoid.length > 0)
    ? aiDietPlan.foodsToAvoid
    : (latest.foodsToAvoid
        ? latest.foodsToAvoid.split(', ').filter(Boolean)
        : ['Sugary beverages (soda, sweetened juices)', 'White bread, white rice & refined pasta', 'Deep-fried & processed fast foods', 'High-saturated-fat meats & butter', 'Packaged bakery sweets & pastries']);

  const calTarget = aiDietPlan?.calTarget || (isOverweight ? 1600 : isHighRisk ? 1800 : 2000);
  const carbPct = aiDietPlan?.carbsPct || (isHighRisk ? 40 : isModerateRisk ? 45 : 50);
  const proteinPct = aiDietPlan?.proteinPct || (isHighRisk ? 30 : 25);
  const fatPct = aiDietPlan?.fatPct || (100 - carbPct - proteinPct);

  // AI Exercise Guidance & Activities from AI Service response or Latest Prediction AI output
  const exerciseAdvice = aiExercisePlan?.generalAdvice || latest.exercisePlan || (
    isHighRisk
      ? 'AI Recommendation: Start with light-to-moderate physical activity. Regular movement post-meals is essential for glycemic control.'
      : 'AI Recommendation: Aim for 150–180 minutes of moderate physical activity weekly, combining cardio and resistance training.'
  );

  const intensity = aiExercisePlan?.intensity || (isHighRisk ? 'Low to Moderate' : isModerateRisk ? 'Moderate' : 'Moderate to High');
  const weeklyMinutes = aiExercisePlan?.weeklyMinutes || (isHighRisk ? 150 : isModerateRisk ? 180 : 210);

  const defaultActivities = [
    {
      name: 'Brisk Walking',
      type: 'walking',
      duration: isHighRisk ? 20 : 30,
      frequency: 'Daily post-meal',
      calories: '100-140 kcal',
      intensity: 'Low–Moderate',
      description: 'Walk 15–20 min after meals to effectively flatten postprandial glucose spikes.',
      benefit: 'Lowers post-meal blood sugar by up to 15%',
    },
    {
      name: isOverweight ? 'Low-impact Cycling' : 'Cardio Training',
      type: isOverweight ? 'cycling' : 'running',
      duration: 25,
      frequency: '3–4 days/week',
      calories: '180-220 kcal',
      intensity: 'Moderate',
      description: 'Cardiovascular exercise designed to improve insulin sensitivity and metabolic output.',
      benefit: 'Enhances muscular insulin sensitivity by 20%',
    },
    {
      name: 'Yoga & Stress Control',
      type: 'yoga',
      duration: 20,
      frequency: '4–5 days/week',
      calories: '60-80 kcal',
      intensity: 'Low',
      description: 'Mindful postures and breathing reduce serum cortisol, preventing stress-induced glucose spikes.',
      benefit: 'Reduces cortisol levels and improves glucose regulation',
    },
    {
      name: 'Resistance Training',
      type: 'strength',
      duration: 25,
      frequency: '2–3 days/week',
      calories: '120-160 kcal',
      intensity: isHighRisk ? 'Light' : 'Moderate',
      description: 'Strengthens skeletal muscle tissue, which acts as the primary reservoir for glucose disposal.',
      benefit: 'Increases muscular glucose uptake and storage capacity',
    },
    {
      name: 'Flexibility & Cool-down',
      type: 'stretching',
      duration: 10,
      frequency: 'Post-workout',
      calories: '20-30 kcal',
      intensity: 'Very Low',
      description: 'Maintains joint flexibility and facilitates rapid metabolic waste clearance after exercise.',
      benefit: 'Prevents stiffness and promotes athletic recovery',
    },
  ];

  const activities = (aiExercisePlan?.activities && aiExercisePlan.activities.length > 0)
    ? aiExercisePlan.activities.map((act) => ({
        name: act.name || 'Exercise Activity',
        type: act.type || 'walking',
        duration: act.duration || 25,
        frequency: act.frequency || '3–4 days/week',
        calories: act.calories || '100-150 kcal',
        intensity: act.intensity || 'Moderate',
        description: act.description || 'AI-prescribed physical activity to optimize glucose clearance and metabolic health.',
        benefit: act.benefit || 'Enhances insulin sensitivity & metabolic control',
      }))
    : defaultActivities;

  const weeklySchedule = [
    { day: 'Monday', diet: breakfastOptions[0] ? `Breakfast: ${breakfastOptions[0]}` : 'Low GI Breakfast & Salad Lunch', exercise: activities[0] ? `${activities[0].name} (${activities[0].duration} min)` : 'Brisk Walking' },
    { day: 'Tuesday', diet: lunchOptions[0] ? `Lunch: ${lunchOptions[0]}` : 'High Protein Meals', exercise: activities[1] ? `${activities[1].name} (${activities[1].duration} min)` : 'Yoga & Resistance' },
    { day: 'Wednesday', diet: dinnerOptions[0] ? `Dinner: ${dinnerOptions[0]}` : 'Lentil Soup & Salad', exercise: activities[2] ? `${activities[2].name} (${activities[2].duration} min)` : 'Cardio Exercise' },
    { day: 'Thursday', diet: breakfastOptions[1] ? `Breakfast: ${breakfastOptions[1]}` : 'Avocado Toast & Greens', exercise: 'Rest & Gentle Stretching (15 min)' },
    { day: 'Friday', diet: lunchOptions[1] ? `Lunch: ${lunchOptions[1]}` : 'Quinoa & Veggie Bowl', exercise: activities[3] ? `${activities[3].name} (${activities[3].duration} min)` : 'Resistance Training' },
    { day: 'Saturday', diet: dinnerOptions[1] ? `Dinner: ${dinnerOptions[1]}` : 'Grilled Fish & Veggies', exercise: activities[0] ? `${activities[0].name} + Stretching` : 'Cardio Walk' },
    { day: 'Sunday', diet: 'Balanced Low-GI Nutrition', exercise: 'Active Relaxation / Nature Walk' },
  ];

  return {
    riskLevel,
    isHighRisk,
    isModerateRisk,
    hba1c,
    bmi: parseFloat((bmi || 0).toFixed(1)),
    fbs,
    totalAssessments,
    dietAdvice,
    exerciseAdvice,
    meals: { breakfast: breakfastOptions, lunch: lunchOptions, dinner: dinnerOptions, snacks: snackOptions },
    goodFoods,
    avoidFoods,
    calTarget,
    macros: { carbs: carbPct, protein: proteinPct, fat: fatPct },
    intensity,
    weeklyMinutes,
    activities,
    weeklySchedule,
  };
};

const MacroBar = ({ label, value, color }) => (
  <Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
      <Typography variant="caption" fontWeight={600}>{label}</Typography>
      <Typography variant="caption" color="text.secondary">{value}%</Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={value}
      sx={{
        height: 8,
        borderRadius: 4,
        bgcolor: color + '20',
        '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 },
      }}
    />
  </Box>
);

const DietExercisePage = () => {
  const theme = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      predictionService.getPredictions({ page: 0, size: 100, sort: 'createdAt,asc' }).catch(() => ({ content: [] })),
      aiService.getDietPlan().catch(() => null),
      aiService.getExercisePlan().catch(() => null),
    ])
      .then(([res, aiDietPlan, aiExercisePlan]) => {
        const list = (res?.content || []).filter((p) => p.createdAt);
        setData(computeAiRecommendations(list, aiDietPlan, aiExercisePlan));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const riskColor = data?.isHighRisk ? '#ef4444' : data?.isModerateRisk ? '#f59e0b' : '#22c55e';
  const riskLabel = data?.isHighRisk ? 'High Risk Profile' : data?.isModerateRisk ? 'Moderate Risk Profile' : 'Healthy Risk Profile';

  return (
    <Box>
      {/* Top Main Title & AI Tag */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar sx={{ background: 'linear-gradient(135deg, #22c55e, #6366f1)', width: 42, height: 42 }}>
              <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800}>
              Diet & Exercise Recommendations
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            AI Clinical Decisions derived from your {data?.totalAssessments || 0} historical health prediction assessment records
          </Typography>
        </Box>
        {data && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#6366f1 !important' }} />}
              label="AI Generated"
              sx={{ bgcolor: '#6366f115', color: '#6366f1', fontWeight: 700, border: '1px solid #6366f130' }}
            />
            <Chip
              label={riskLabel}
              sx={{ bgcolor: riskColor + '18', color: riskColor, fontWeight: 700, border: `1px solid ${riskColor}30` }}
            />
          </Box>
        )}
      </Box>

      {!data ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No assessment history found. Please run a prediction first to generate personalized AI Diet & Exercise recommendations!
        </Alert>
      ) : (
        <>
          {/* Quick Stats Banner */}
          <Grid container spacing={2} mb={4}>
            {[
              { label: 'Latest HbA1c', value: `${data.hba1c || '--'}%`, color: data.hba1c > 6.5 ? '#ef4444' : data.hba1c > 5.7 ? '#f59e0b' : '#22c55e' },
              { label: 'Current BMI', value: data.bmi || '--', color: data.bmi > 30 ? '#ef4444' : data.bmi > 25 ? '#f59e0b' : '#22c55e' },
              { label: 'Fasting Sugar', value: `${data.fbs || '--'} mg/dL`, color: data.fbs > 126 ? '#ef4444' : data.fbs > 100 ? '#f59e0b' : '#22c55e' },
              { label: 'Target Cal / Exercise', value: `~${data.calTarget} kcal / ${data.weeklyMinutes}m`, color: '#6366f1' },
            ].map(({ label, value, color }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* ════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 1: TOP — DIET RECOMMENDATIONS */}
          {/* ════════════════════════════════════════════════════════════════════ */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 4,
              border: '1px solid',
              borderColor: '#22c55e40',
              background: 'linear-gradient(180deg, rgba(34, 197, 94, 0.04) 0%, rgba(255,255,255,0) 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#22c55e18', width: 38, height: 38 }}>
                <RestaurantMenuIcon sx={{ color: '#22c55e' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  1. Personalized Diet Recommendations (AI Derived)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Based on glycemic control history & metabolic profile
                </Typography>
              </Box>
            </Box>

            {/* AI Guidance Banner */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: '#22c55e30',
                bgcolor: '#22c55e0a',
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <InfoOutlinedIcon sx={{ color: '#22c55e', mt: 0.2 }} />
              <Typography variant="body2" color="text.primary" lineHeight={1.6}>
                {data.dietAdvice}
              </Typography>
            </Paper>

            {/* Daily Meals Grid */}
            <Typography variant="subtitle1" fontWeight={700} mb={1.5}>🍽️ AI Daily Meal Schedule</Typography>
            <Grid container spacing={2} mb={3}>
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
                const mc = MEAL_COLORS[meal];
                return (
                  <Grid item xs={12} sm={6} md={3} key={meal}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: mc.border,
                        background: mc.grad,
                        height: '100%',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Avatar sx={{ bgcolor: mc.bg, width: 32, height: 32, color: mc.color }}>
                          {MEAL_ICONS[meal]}
                        </Avatar>
                        <Typography variant="subtitle2" fontWeight={700} textTransform="capitalize">
                          {meal}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {data.meals[meal]?.map((item, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                            <CheckCircleOutlineIcon sx={{ fontSize: 14, color: mc.color, mt: 0.2, flexShrink: 0 }} />
                            <Typography variant="caption" lineHeight={1.4} color="text.primary" fontWeight={500}>
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Recommended Foods / Avoid / Macros */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #22c55e30', bgcolor: '#22c55e08', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <TrendingUpIcon sx={{ color: '#22c55e' }} />
                    <Typography variant="subtitle2" fontWeight={700} color="#22c55e">Recommended Foods</Typography>
                  </Box>
                  {data.goodFoods.map((f, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 0.5 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#22c55e', mt: 0.1, flexShrink: 0 }} />
                      <Typography variant="caption" lineHeight={1.4}>{f}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid #ef444430', bgcolor: '#ef444408', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <TrendingDownIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="subtitle2" fontWeight={700} color="#ef4444">Foods to Limit / Avoid</Typography>
                  </Box>
                  {data.avoidFoods.map((f, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 0.5 }}>
                      <CancelOutlinedIcon sx={{ fontSize: 15, color: '#ef4444', mt: 0.1, flexShrink: 0 }} />
                      <Typography variant="caption" lineHeight={1.4}>{f}</Typography>
                    </Box>
                  ))}
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                    <GrainIcon sx={{ color: '#6366f1' }} />
                    <Typography variant="subtitle2" fontWeight={700}>Macro Ratios Target</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <MacroBar label="Carbohydrates" value={data.macros.carbs} color="#f59e0b" />
                    <MacroBar label="Protein" value={data.macros.protein} color="#6366f1" />
                    <MacroBar label="Healthy Fats" value={data.macros.fat} color="#22c55e" />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Divider with Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 3 }}>
            <Divider sx={{ flexGrow: 1 }} />
            <Chip
              icon={<AutoAwesomeIcon sx={{ color: '#6366f1 !important', fontSize: '14px !important' }} />}
              label="AI Exercise Recommendations Below"
              size="small"
              sx={{ bgcolor: '#6366f115', color: '#6366f1', fontWeight: 600 }}
            />
            <Divider sx={{ flexGrow: 1 }} />
          </Box>

          {/* ════════════════════════════════════════════════════════════════════ */}
          {/* SECTION 2: BOTTOM — EXERCISE RECOMMENDATIONS */}
          {/* ════════════════════════════════════════════════════════════════════ */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: '1px solid',
              borderColor: '#6366f140',
              background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.04) 0%, rgba(255,255,255,0) 100%)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Avatar sx={{ bgcolor: '#6366f118', width: 38, height: 38 }}>
                <FitnessCenterIcon sx={{ color: '#6366f1' }} />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  2. Personalized Exercise Recommendations (AI Derived)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Tailored physical routine to optimize glucose uptake & muscular insulin sensitivity
                </Typography>
              </Box>
            </Box>

            {/* AI Exercise Banner */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: '#6366f130',
                bgcolor: '#6366f10a',
                display: 'flex',
                gap: 1.5,
                alignItems: 'flex-start',
              }}
            >
              <InfoOutlinedIcon sx={{ color: '#6366f1', mt: 0.2 }} />
              <Typography variant="body2" color="text.primary" lineHeight={1.6}>
                {data.exerciseAdvice}
              </Typography>
            </Paper>

            {/* Activity Cards */}
            <Typography variant="subtitle1" fontWeight={700} mb={1.5}>🏋️ Recommended Activities</Typography>
            <Grid container spacing={2} mb={3}>
              {data.activities.map((act, idx) => {
                const cfg = getActivityConfig(act.type);
                return (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: cfg.color + '30',
                        background: cfg.grad,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: cfg.color + '18', color: cfg.color, width: 34, height: 34 }}>
                          {cfg.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2" fontWeight={700}>{act.name}</Typography>
                          <Chip label={act.intensity} size="small" sx={{ bgcolor: cfg.color + '18', color: cfg.color, height: 18, fontSize: 9, fontWeight: 700 }} />
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                        {act.description}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 'auto', pt: 1 }}>
                        <Typography variant="caption" color="text.disabled"><TimerIcon sx={{ fontSize: 12, mr: 0.3 }} />{act.duration} m</Typography>
                        <Typography variant="caption" color="text.disabled"><RepeatIcon sx={{ fontSize: 12, mr: 0.3 }} />{act.frequency}</Typography>
                        <Typography variant="caption" color="#ef4444"><LocalFireDepartmentIcon sx={{ fontSize: 12, mr: 0.3 }} />{act.calories}</Typography>
                      </Box>
                      <Divider sx={{ my: 0.5 }} />
                      <Typography variant="caption" color={cfg.color} fontWeight={600}>
                        <FavoriteIcon sx={{ fontSize: 11, mr: 0.3 }} /> {act.benefit}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Weekly Schedule */}
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5}>📅 Combined Weekly Diet & Exercise Plan</Typography>
              <Grid container spacing={1}>
                {data.weeklySchedule.map(({ day, diet, exercise }) => (
                  <Grid item xs={12} sm={6} md={4} key={day}>
                    <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="caption" fontWeight={800} color="primary" display="block" mb={0.5}>{day}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">🥗 {diet}</Typography>
                      <Typography variant="caption" display="block" color="text.secondary">🏃 {exercise}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default DietExercisePage;
