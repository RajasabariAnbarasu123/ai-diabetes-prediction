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
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PedalBikeIcon from '@mui/icons-material/PedalBike';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import RepeatIcon from '@mui/icons-material/Repeat';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import predictionService from '../../services/predictionService';
import aiService from '../../services/aiService';

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

// Compute exercise plan from prediction history
const computeExercisePlan = (predictions) => {
  if (!predictions || predictions.length === 0) return null;
  const latest = predictions[predictions.length - 1];

  const riskLevel = String(latest.diabetesRisk || 'Low').toLowerCase();
  const hba1c = latest.hba1c || 0;
  const bmi = latest.bmi || (latest.height && latest.weight ? latest.weight / ((latest.height / 100) ** 2) : 0);
  const physActivity = String(latest.physicalActivity || '').toLowerCase();
  const isSedentary = physActivity.includes('sedentary') || physActivity.includes('low') || physActivity === '';

  const isHighRisk = riskLevel === 'high' || hba1c > 6.5;
  const isModerateRisk = riskLevel === 'moderate' || (hba1c > 5.7 && hba1c <= 6.5);
  const isOverweight = bmi > 25;
  const isObese = bmi > 30;

  // Intensity based on risk
  const intensity = isHighRisk ? 'Low to Moderate' : isModerateRisk ? 'Moderate' : 'Moderate to High';
  const weeklyMinutes = isHighRisk || isObese ? 150 : isModerateRisk ? 180 : 210;

  // Activities tailored to profile
  const activities = [];

  activities.push({
    name: 'Brisk Walking',
    type: 'walking',
    duration: isHighRisk ? 20 : isOverweight ? 30 : 25,
    frequency: 'Daily',
    calories: isHighRisk ? '80-100' : isOverweight ? '120-150' : '100-130',
    intensity: 'Low–Moderate',
    description: 'Easiest way to lower post-meal blood sugar. Walk 15–20 min after each meal.',
    benefit: 'Reduces fasting blood glucose by 3–5%',
  });

  if (!isHighRisk || hba1c < 7) {
    activities.push({
      name: isOverweight ? 'Cycling' : 'Light Jogging',
      type: isOverweight ? 'cycling' : 'running',
      duration: isHighRisk ? 15 : 25,
      frequency: '3–4 days/week',
      calories: isOverweight ? '200-250' : '180-220',
      intensity: 'Moderate',
      description: isOverweight
        ? 'Low-impact cardio — ideal for weight management with reduced joint stress.'
        : 'Boosts cardiovascular health and insulin sensitivity.',
      benefit: 'Improves insulin sensitivity by up to 20%',
    });
  }

  activities.push({
    name: 'Yoga & Meditation',
    type: 'yoga',
    duration: 20,
    frequency: '4–5 days/week',
    calories: '60-80',
    intensity: 'Low',
    description: 'Reduces cortisol levels which directly impacts blood sugar control. Also improves flexibility.',
    benefit: 'Lowers HbA1c by reducing stress hormones',
  });

  activities.push({
    name: 'Strength Training',
    type: 'strength',
    duration: isHighRisk ? 20 : 30,
    frequency: '2–3 days/week',
    calories: isHighRisk ? '100-130' : '150-200',
    intensity: isHighRisk ? 'Light–Moderate' : 'Moderate',
    description: 'Builds muscle mass which acts as glucose storage. Resistance training is highly effective for T2D.',
    benefit: 'Increases glucose uptake into muscles',
  });

  if (!isHighRisk) {
    activities.push({
      name: 'Swimming',
      type: 'swimming',
      duration: 30,
      frequency: '2 days/week',
      calories: '200-250',
      intensity: 'Moderate',
      description: 'Full-body workout with zero joint impact. Excellent for overweight individuals or those with joint pain.',
      benefit: 'Burns calories efficiently without joint stress',
    });
  }

  activities.push({
    name: 'Stretching & Cool-down',
    type: 'stretching',
    duration: 10,
    frequency: 'After every session',
    calories: '20-30',
    intensity: 'Very Low',
    description: 'Essential for recovery, flexibility, and injury prevention. Do after every workout session.',
    benefit: 'Prevents muscle soreness and improves flexibility',
  });

  const weeklySchedule = [
    { day: 'Monday', activities: ['Brisk Walking (25 min)', 'Stretching (10 min)'] },
    { day: 'Tuesday', activities: ['Yoga & Meditation (20 min)', 'Strength Training (20 min)'] },
    { day: 'Wednesday', activities: ['Brisk Walking (30 min)', isOverweight ? 'Cycling (20 min)' : 'Light Jogging (20 min)'] },
    { day: 'Thursday', activities: ['Rest / Light Stretching'] },
    { day: 'Friday', activities: ['Yoga & Meditation (20 min)', 'Strength Training (25 min)'] },
    { day: 'Saturday', activities: ['Swimming / Long Walk (35 min)', 'Stretching (10 min)'] },
    { day: 'Sunday', activities: ['Active Rest — gentle walk, nature time'] },
  ];

  const warnings = [];
  if (isHighRisk) warnings.push('Always check blood sugar before and after exercise.');
  if (isHighRisk) warnings.push('Carry fast-acting glucose (e.g., glucose tablets) during workouts.');
  if (isObese) warnings.push('Avoid high-impact activities. Start slow and build up gradually.');
  warnings.push('Consult your doctor before starting any new exercise regimen.');
  warnings.push('Stay hydrated during exercise — dehydration raises blood sugar.');

  return {
    riskLevel,
    isHighRisk,
    isModerateRisk,
    intensity,
    weeklyMinutes,
    activities,
    weeklySchedule,
    warnings,
    bmi: parseFloat((bmi || 0).toFixed(1)),
    hba1c,
    assessmentsUsed: predictions.length,
    generalAdvice: isHighRisk
      ? 'Due to your high diabetes risk, start with low-intensity exercise and gradually increase. Regular movement is crucial — even short walks help regulate blood sugar significantly.'
      : isModerateRisk
      ? 'Your pre-diabetic indicators can be improved significantly with consistent moderate exercise. Aim for at least 150 minutes of moderate activity per week.'
      : 'Maintain your current activity level and challenge yourself with moderate-to-vigorous exercise. Regular physical activity keeps diabetes risk low.',
  };
};

const ActivityCard = ({ activity }) => {
  const cfg = getActivityConfig(activity.type);
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 4,
        border: '1px solid',
        borderColor: cfg.color + '30',
        background: cfg.grad,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: cfg.color + '18', color: cfg.color, width: 42, height: 42 }}>
          {cfg.icon}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700}>{activity.name}</Typography>
          <Chip
            label={activity.intensity}
            size="small"
            sx={{ bgcolor: cfg.color + '18', color: cfg.color, fontWeight: 600, fontSize: 10, height: 20, mt: 0.3 }}
          />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
        {activity.description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TimerIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">{activity.duration} min</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <RepeatIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">{activity.frequency}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LocalFireDepartmentIcon sx={{ fontSize: 14, color: '#ef4444' }} />
          <Typography variant="caption" color="text.secondary">{activity.calories} kcal</Typography>
        </Box>
      </Box>

      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
        <FavoriteIcon sx={{ fontSize: 14, color: cfg.color, mt: 0.15, flexShrink: 0 }} />
        <Typography variant="caption" color={cfg.color} fontWeight={600} lineHeight={1.4}>
          {activity.benefit}
        </Typography>
      </Box>
    </Paper>
  );
};

const ExerciseRecommendationPage = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    predictionService
      .getPredictions({ page: 0, size: 100, sort: 'createdAt,asc' })
      .then((data) => {
        const preds = (data.content || []).filter((p) => p.createdAt);
        setPlan(computeExercisePlan(preds));
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

  const riskChipColor = plan?.isHighRisk ? '#ef4444' : plan?.isModerateRisk ? '#f59e0b' : '#22c55e';
  const riskLabel = plan?.isHighRisk ? 'High Risk' : plan?.isModerateRisk ? 'Moderate Risk' : 'Low Risk';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Avatar sx={{ bgcolor: '#6366f118', width: 40, height: 40 }}>
              <FitnessCenterIcon sx={{ color: '#6366f1', fontSize: 22 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={800}>
              Exercise Recommendations
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {plan
              ? `Tailored from ${plan.assessmentsUsed} health assessment${plan.assessmentsUsed !== 1 ? 's' : ''}`
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
          No assessment data found. Please complete a health prediction first to get personalized exercise recommendations.
        </Alert>
      ) : (
        <>
          {/* Advice Banner */}
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
                  Exercise Guidance Based on Your Health Data
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                  {plan.generalAdvice}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Stats */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: 'Intensity Level', value: plan.intensity, color: riskChipColor, icon: <SpeedIcon /> },
              { label: 'Weekly Target', value: `${plan.weeklyMinutes} min`, color: '#6366f1', icon: <TimerIcon /> },
              { label: 'Sessions/Week', value: '5–6', color: '#22c55e', icon: <RepeatIcon /> },
              { label: 'Daily Min Walk', value: '30 min', color: '#f59e0b', icon: <DirectionsWalkIcon /> },
            ].map(({ label, value, color, icon }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: color + '18', color, mx: 'auto', mb: 1, width: 36, height: 36 }}>
                    {icon}
                  </Avatar>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ color }}>{value}</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Activity Cards */}
          <Typography variant="h6" fontWeight={700} mb={2}>🏋️ Recommended Activities</Typography>
          <Grid container spacing={2.5} mb={3}>
            {plan.activities.map((activity, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <ActivityCard activity={activity} />
              </Grid>
            ))}
          </Grid>

          {/* Weekly Schedule + Warnings */}
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={7}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={700} mb={2}>📅 Weekly Exercise Schedule</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.weeklySchedule.map(({ day, activities }) => (
                    <Box
                      key={day}
                      sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'flex-start',
                        p: 1.25,
                        borderRadius: 2,
                        '&:hover': { bgcolor: 'action.hover' },
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontWeight={700}
                        sx={{ minWidth: 72, color: 'text.secondary', pt: 0.15 }}
                      >
                        {day}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {activities.map((a, i) => (
                          <Chip
                            key={i}
                            label={a}
                            size="small"
                            sx={{ fontSize: 11, height: 22, bgcolor: 'action.selected' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: '#f59e0b30',
                  background: 'linear-gradient(135deg, #f59e0b08, #d9770604)',
                  height: '100%',
                }}
              >
                <Typography variant="subtitle1" fontWeight={700} mb={2} color="#f59e0b">
                  ⚠️ Important Safety Tips
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {plan.warnings.map((w, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: 16, color: '#f59e0b', mt: 0.15, flexShrink: 0 }} />
                      <Typography variant="body2" lineHeight={1.5}>{w}</Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75, p: 1.5, borderRadius: 2, bgcolor: '#6366f110', border: '1px solid #6366f120' }}>
                  <InfoOutlinedIcon sx={{ fontSize: 16, color: '#6366f1', mt: 0.1 }} />
                  <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                    Regular exercise combined with dietary changes can reduce HbA1c by 0.5–1.5% and significantly lower diabetes progression risk.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ExerciseRecommendationPage;