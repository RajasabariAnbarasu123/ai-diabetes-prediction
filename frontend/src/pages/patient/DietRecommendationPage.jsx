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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
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
import { useSelector } from 'react-redux';
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

// Compute diet recommendations from prediction history
const computeDietRecommendations = (predictions) => {
  if (!predictions || predictions.length === 0) return null;
  const latest = predictions[predictions.length - 1];

  const riskLevel = String(latest.diabetesRisk || 'Low').toLowerCase();
  const hba1c = latest.hba1c || 0;
  const bmi = latest.bmi || (latest.height && latest.weight ? latest.weight / ((latest.height / 100) ** 2) : 0);
  const fbs = latest.fastingBloodSugar || 0;
  const cholesterol = latest.cholesterol || 0;

  const isHighRisk = riskLevel === 'high' || hba1c > 6.5;
  const isModerateRisk = riskLevel === 'moderate' || (hba1c > 5.7 && hba1c <= 6.5);
  const isOverweight = bmi > 25;
  const hasHighCholesterol = cholesterol > 200;
  const hasHighSugar = fbs > 100;

  // Dynamic meal plans based on health profile
  const breakfastOptions = isHighRisk
    ? ['Steel-cut oats with cinnamon & berries', 'Whole wheat toast with avocado & eggs', 'Greek yogurt with flaxseeds & walnuts', 'Vegetable upma (no added sugar)']
    : isModerateRisk
    ? ['Oatmeal with banana & almonds', 'Multigrain toast with peanut butter', 'Fruit smoothie with chia seeds', 'Idli with sambar (low-oil)']
    : ['Whole grain cereal with low-fat milk', 'Scrambled eggs with whole wheat bread', 'Mixed fruit bowl', 'Poha with vegetables'];

  const lunchOptions = isHighRisk || hasHighSugar
    ? ['Grilled chicken salad with olive oil dressing', 'Brown rice with dal & mixed vegetables', 'Quinoa bowl with tofu & leafy greens', 'Whole wheat roti with palak paneer']
    : isOverweight
    ? ['Large green salad with lean protein', 'Lentil soup with whole grain bread', 'Grilled fish with steamed broccoli', 'Bean and vegetable stir-fry']
    : ['Brown rice with mixed vegetable curry', 'Whole wheat roti with dal & salad', 'Pasta with tomato sauce & vegetables', 'Sandwich with lean turkey & salad'];

  const dinnerOptions = isHighRisk
    ? ['Grilled salmon with steamed asparagus', 'Lentil soup with a side salad', 'Tofu stir-fry with cauliflower rice', 'Baked chicken with roasted vegetables']
    : isOverweight
    ? ['Light vegetable soup with whole grain bread', 'Grilled fish with green salad', 'Stir-fried tofu with broccoli', 'Mixed vegetable curry with small roti']
    : ['Whole wheat roti with vegetable curry', 'Rice with dal & cucumber salad', 'Grilled chicken with sweet potato', 'Mixed vegetables with quinoa'];

  const snackOptions = isHighRisk || hasHighSugar
    ? ['Small handful of mixed nuts (almonds, walnuts)', 'Apple slices with peanut butter', 'Carrot & cucumber sticks with hummus', 'Greek yogurt (unsweetened)']
    : ['Roasted chickpeas', 'Banana with almond butter', 'Rice cakes with cottage cheese', 'Fresh fruit (1 small serving)'];

  const avoidFoods = [
    'Sugary beverages (soda, fruit juices)',
    'White bread, rice & pasta (refined carbs)',
    'Fried & deep-fried foods',
    hasHighCholesterol ? 'Saturated fats & fatty meats' : 'Excessive saturated fats',
    'Processed & packaged snacks',
    'Sweets, pastries & desserts',
  ];

  const goodFoods = [
    'Non-starchy vegetables (spinach, broccoli, peppers)',
    'Whole grains (brown rice, oats, quinoa)',
    'Lean protein (chicken, fish, legumes, tofu)',
    'Healthy fats (avocado, nuts, olive oil)',
    'Low-glycemic fruits (berries, apple, pear)',
    'Low-fat dairy (Greek yogurt, cottage cheese)',
  ];

  const calTarget = isOverweight ? 1600 : isHighRisk ? 1800 : 2000;
  const carbPct = isHighRisk ? 40 : isModerateRisk ? 45 : 50;
  const proteinPct = isHighRisk ? 30 : 25;
  const fatPct = 100 - carbPct - proteinPct;

  return {
    riskLevel,
    hba1c,
    bmi: parseFloat((bmi || 0).toFixed(1)),
    fbs,
    isHighRisk,
    isModerateRisk,
    generalAdvice: isHighRisk
      ? 'Your recent assessments indicate a high diabetes risk. A strict low-glycemic, calorie-conscious diet is recommended. Focus on portion control and eliminate all sugary foods.'
      : isModerateRisk
      ? 'Your data shows pre-diabetic indicators. A balanced, low-GI diet with moderate calorie intake can help reverse pre-diabetes. Prioritize whole foods and reduce refined carbs.'
      : 'Your current metrics are in a healthy range. Maintain a balanced, nutritious diet to keep your health on track and prevent future risk.',
    meals: { breakfast: breakfastOptions, lunch: lunchOptions, dinner: dinnerOptions, snacks: snackOptions },
    avoidFoods,
    goodFoods,
    macros: { carbs: carbPct, protein: proteinPct, fat: fatPct },
    calTarget,
    assessmentsUsed: predictions.length,
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

const DietRecommendationPage = () => {
  const theme = useTheme();
  const [dietPlan, setDietPlan] = useState(null);
  const [smartDiet, setSmartDiet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      predictionService.getPredictions({ page: 0, size: 100, sort: 'createdAt,asc' }).catch(() => ({ content: [] })),
      aiService.getDietPlan().catch(() => null),
    ]).then(([predData, aiDiet]) => {
      const preds = (predData.content || []).filter((p) => p.createdAt);
      setSmartDiet(computeDietRecommendations(preds));
      setDietPlan(aiDiet);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const plan = smartDiet;

  const riskChipColor = plan?.isHighRisk ? '#ef4444' : plan?.isModerateRisk ? '#f59e0b' : '#22c55e';
  const riskLabel = plan?.isHighRisk ? 'High Risk' : plan?.isModerateRisk ? 'Moderate Risk' : 'Low Risk';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar sx={{ bgcolor: '#22c55e18', width: 40, height: 40 }}>
              <RestaurantMenuIcon sx={{ color: '#22c55e', fontSize: 22 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800}>
              Personalized Diet Plan
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {plan
              ? `Generated from ${plan.assessmentsUsed} health assessment${plan.assessmentsUsed !== 1 ? 's' : ''}`
              : 'Based on your health profile'}
          </Typography>
        </Box>
        {plan && (
          <Chip
            label={riskLabel}
            sx={{ bgcolor: riskChipColor + '18', color: riskChipColor, fontWeight: 700, border: `1px solid ${riskChipColor}30`, fontSize: 13, height: 32 }}
          />
        )}
      </Box>

      {!plan ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No assessment data found. Please complete a health prediction first to get personalized diet recommendations.
        </Alert>
      ) : (
        <>
          {/* General Advice Banner */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 4,
              border: '1px solid',
              borderColor: riskChipColor + '30',
              background: `linear-gradient(135deg, ${riskChipColor}08 0%, ${riskChipColor}04 100%)`,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <InfoOutlinedIcon sx={{ color: riskChipColor, mt: 0.2 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5} color={riskChipColor}>
                  Dietary Guidance Based on Your Data
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {plan.generalAdvice}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Stats Row */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: 'HbA1c Level', value: `${plan.hba1c || '--'}%`, color: plan.hba1c > 6.5 ? '#ef4444' : plan.hba1c > 5.7 ? '#f59e0b' : '#22c55e' },
              { label: 'BMI', value: plan.bmi || '--', color: plan.bmi > 30 ? '#ef4444' : plan.bmi > 25 ? '#f59e0b' : '#22c55e' },
              { label: 'Fasting Sugar', value: `${plan.fbs || '--'} mg/dL`, color: plan.fbs > 126 ? '#ef4444' : plan.fbs > 100 ? '#f59e0b' : '#22c55e' },
              { label: 'Daily Calories', value: `~${plan.calTarget} kcal`, color: '#6366f1' },
            ].map(({ label, value, color }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} sx={{ color }}>{value}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Meal Plan */}
          <Typography variant="h6" fontWeight={700} mb={2}>🍽️ Daily Meal Plan</Typography>
          <Grid container spacing={2.5} mb={3}>
            {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
              const mc = MEAL_COLORS[meal];
              return (
                <Grid item xs={12} sm={6} md={3} key={meal}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      borderRadius: 4,
                      border: '1px solid',
                      borderColor: mc.border,
                      background: mc.grad,
                      height: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Avatar sx={{ bgcolor: mc.bg, width: 36, height: 36, color: mc.color }}>
                        {MEAL_ICONS[meal]}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight={700} textTransform="capitalize">
                        {meal}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      {plan.meals[meal]?.map((item, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                          <CheckCircleOutlineIcon sx={{ fontSize: 15, color: mc.color, mt: 0.2, flexShrink: 0 }} />
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

          {/* Foods to Eat & Avoid + Macros */}
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: '#22c55e30', background: 'linear-gradient(135deg, #22c55e08, #16a34a04)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TrendingUpIcon sx={{ color: '#22c55e' }} />
                  <Typography variant="subtitle1" fontWeight={700} color="#22c55e">Recommended Foods</Typography>
                </Box>
                {plan.goodFoods.map((food, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 0.75 }}>
                    <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#22c55e', mt: 0.1, flexShrink: 0 }} />
                    <Typography variant="body2" lineHeight={1.4}>{food}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: '#ef444430', background: 'linear-gradient(135deg, #ef444408, #dc262604)', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TrendingDownIcon sx={{ color: '#ef4444' }} />
                  <Typography variant="subtitle1" fontWeight={700} color="#ef4444">Foods to Avoid</Typography>
                </Box>
                {plan.avoidFoods.map((food, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, mb: 0.75 }}>
                    <CancelOutlinedIcon sx={{ fontSize: 16, color: '#ef4444', mt: 0.1, flexShrink: 0 }} />
                    <Typography variant="body2" lineHeight={1.4}>{food}</Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <GrainIcon sx={{ color: '#6366f1' }} />
                  <Typography variant="subtitle1" fontWeight={700}>Macro Targets</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <MacroBar label="Carbohydrates" value={plan.macros.carbs} color="#f59e0b" />
                  <MacroBar label="Protein" value={plan.macros.protein} color="#6366f1" />
                  <MacroBar label="Healthy Fats" value={plan.macros.fat} color="#22c55e" />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={800} color="#6366f1">~{plan.calTarget}</Typography>
                  <Typography variant="caption" color="text.secondary">Daily calorie target</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* AI Diet Plan if available */}
          {dietPlan && (
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Chip label="AI" size="small" sx={{ bgcolor: '#6366f118', color: '#6366f1', fontWeight: 700, height: 22 }} />
                <Typography variant="subtitle1" fontWeight={700}>AI-Generated Advice</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                {dietPlan.generalAdvice}
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Box>
  );
};

export default DietRecommendationPage;