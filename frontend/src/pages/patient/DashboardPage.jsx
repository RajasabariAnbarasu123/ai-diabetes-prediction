import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  LinearProgress,
  Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import DailyTip from '../../components/ai/DailyTip';
import { setDashboardStats } from '../../store/slices/patientSlice';
import { fetchProfile } from '../../store/slices/authSlice';
import predictionService from '../../services/predictionService';

const RISK_COLORS = { Low: '#22c55e', Moderate: '#f59e0b', High: '#ef4444', 'No Data': '#94a3b8' };

const SYMPTOM_KEYS = [
  { key: 'frequentUrination', label: 'Freq. Urination' },
  { key: 'increasedThirst', label: 'Thirst' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'blurredVision', label: 'Blurred Vision' },
  { key: 'weightLoss', label: 'Weight Loss' },
  { key: 'slowWoundHealing', label: 'Wound Healing' },
  { key: 'tinglingSensation', label: 'Tingling' },
  { key: 'increasedHunger', label: 'Hunger' },
];

const calcHealthScore = (p) => {
  let s = 100;
  if (p.hba1c > 5.7) s -= 10;
  if (p.hba1c > 6.5) s -= 10;
  if (p.bmi < 18.5 || p.bmi > 25) s -= 10;
  if (p.bmi > 30) s -= 10;
  if (p.fastingBloodSugar > 100) s -= 10;
  if (p.fastingBloodSugar > 126) s -= 10;
  if (p.smoking) s -= 5;
  if (p.alcohol) s -= 5;
  if (p.physicalActivity?.toLowerCase().includes('active')) s += 5;
  return Math.max(40, Math.min(100, s));
};

const StatCard = ({ label, value, unit = '', icon, color = '#6366f1', trend, sublabel }) => {
  const TrendIcon = trend > 0 ? TrendingUpIcon : trend < 0 ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor = trend > 0 ? '#ef4444' : trend < 0 ? '#22c55e' : '#94a3b8';
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Avatar sx={{ bgcolor: color + '18', width: 40, height: 40 }}>{icon}</Avatar>
        {trend !== undefined && (
          <Chip icon={<TrendIcon sx={{ fontSize: 14 }} />} label={`${Math.abs(trend)}%`} size="small"
            sx={{ bgcolor: trendColor + '15', color: trendColor, fontWeight: 700, fontSize: 11 }} />
        )}
      </Box>
      <Box>
        <Typography variant="h4" fontWeight={800} sx={{ color, lineHeight: 1.1 }}>{value}{unit}</Typography>
        <Typography variant="body2" color="text.secondary" fontWeight={500} mt={0.5}>{label}</Typography>
        {sublabel && <Typography variant="caption" color="text.disabled">{sublabel}</Typography>}
      </Box>
    </Paper>
  );
};

const ChartCard = ({ title, subtitle, children }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid', borderColor: 'divider', height: '100%' }}>
    <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
    {subtitle && <Typography variant="caption" color="text.secondary" display="block">{subtitle}</Typography>}
    <Box mt={2}>{children}</Box>
  </Paper>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider', fontSize: 12 }}>
      <Typography variant="caption" fontWeight={700} display="block" mb={0.5}>{label}</Typography>
      {payload.map((p) => (
        <Box key={p.dataKey} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: p.color }} />
          <Typography variant="caption">{p.name}: <strong>{p.value}</strong></Typography>
        </Box>
      ))}
    </Paper>
  );
};

const DashboardPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userName = user?.name;
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProfile());
    predictionService
      .getPredictions({ page: 0, size: 100, sort: 'createdAt,asc' })
      .then((data) => {
        const list = (data.content || []).filter((p) => p.createdAt);
        setPredictions(list);
        if (list.length > 0) {
          const latest = list[list.length - 1];
          const prev = list.length > 1 ? list[list.length - 2] : null;
          const score = calcHealthScore(latest);
          const improvement = prev && prev.hba1c
            ? Math.round(((prev.hba1c - latest.hba1c) / prev.hba1c) * 100) : 0;
          let latestBmi = latest.bmi;
          if ((!latestBmi || latestBmi === 0) && latest.height > 0 && latest.weight > 0) {
            latestBmi = latest.weight / ((latest.height / 100) * (latest.height / 100));
          }
          dispatch(setDashboardStats({
            currentRisk: latest.diabetesRisk || 'Low',
            lastHbA1c: latest.hba1c || 0,
            currentBMI: latestBmi ? parseFloat(latestBmi.toFixed(1)) : 0,
            healthScore: score,
            totalPredictions: list.length,
            improvementPercentage: improvement,
          }));
        }
      })
      .catch((err) => console.error('Dashboard fetch error:', err))
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const noData = predictions.length === 0;
  const latest = noData ? null : predictions[predictions.length - 1];
  const prev = predictions.length > 1 ? predictions[predictions.length - 2] : null;
  const healthScore = latest ? calcHealthScore(latest) : null;

  const riskLabel = latest
    ? String(latest.diabetesRisk || 'Low').charAt(0).toUpperCase() + String(latest.diabetesRisk || 'Low').slice(1).toLowerCase()
    : '--';
  const riskColor = RISK_COLORS[riskLabel] || '#94a3b8';

  const trend = prev && latest && prev.hba1c
    ? Math.round(((prev.hba1c - latest.hba1c) / prev.hba1c) * 100) : undefined;

  const timeSeriesData = predictions.map((p, index) => {
    let pBmi = p.bmi;
    let pHeight = p.height;
    let pWeight = p.weight;
    
    // Override the final data point with current profile values to ensure consistency
    if (index === predictions.length - 1 && user && user.height && user.weight) {
      pHeight = user.height;
      pWeight = user.weight;
      pBmi = user.weight / ((user.height / 100) * (user.height / 100));
    } else if ((!pBmi || pBmi === 0) && pHeight > 0 && pWeight > 0) {
      pBmi = pWeight / ((pHeight / 100) * (pHeight / 100));
    }

    return {
      date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      hba1c: p.hba1c ?? null,
      fbs: p.fastingBloodSugar ?? null,
      rbs: p.randomBloodSugar ?? null,
      bmi: pBmi ? parseFloat(pBmi.toFixed(1)) : null,
      cholesterol: p.cholesterol ?? null,
      hdl: p.hdl ?? null,
      ldl: p.ldl ?? null,
      score: calcHealthScore(p),
    };
  });

  const riskDist = predictions.reduce((acc, p) => {
    const r = String(p.diabetesRisk || 'Low');
    const key = r.charAt(0).toUpperCase() + r.slice(1).toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const riskDistData = Object.entries(riskDist).map(([name, value]) => ({ name, value }));

  const symptomData = SYMPTOM_KEYS.map(({ key, label }) => ({
    label,
    pct: predictions.length > 0
      ? Math.round((predictions.filter((p) => p[key]).length / predictions.length) * 100) : 0,
  }));

  const hasLipids = predictions.some((p) => p.cholesterol || p.hdl || p.ldl);

  const bmiLabel = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 24.9) return 'Normal';
    if (bmi <= 29.9) return 'Overweight';
    return 'Obese';
  };

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Welcome back, {userName || 'Patient'} 👋
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </Typography>

      {noData && (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
          No assessments yet. <strong>Run a Prediction</strong> from the nav to see your dashboard populated with real data.
        </Alert>
      )}

      {/* Row 1 – 4 Stat Cards */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Diabetes Risk"
            value={noData ? '--' : riskLabel}
            icon={<MonitorHeartIcon sx={{ fontSize: 20, color: riskColor }} />}
            color={riskColor}
            sublabel={noData ? 'No data yet' : `${predictions.length} assessment${predictions.length !== 1 ? 's' : ''}`}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Latest HbA1c"
            value={noData ? '--' : (latest.hba1c ?? '--')}
            unit={noData ? '' : '%'}
            icon={<BloodtypeIcon sx={{ fontSize: 20, color: '#ef4444' }} />}
            color="#ef4444"
            trend={trend}
            sublabel={latest?.hba1c > 6.5 ? 'Diabetic range' : latest?.hba1c > 5.7 ? 'Pre-diabetic range' : 'Normal range'}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Current BMI"
            value={
              user && user.height && user.weight
                ? parseFloat((user.weight / ((user.height / 100) * (user.height / 100))).toFixed(1))
                : (user?.bmi ? parseFloat(user.bmi.toFixed(1)) : '--')
            }
            icon={<FavoriteIcon sx={{ fontSize: 20, color: '#6366f1' }} />}
            color="#6366f1"
            sublabel={
              user && user.height && user.weight
                ? bmiLabel(user.weight / ((user.height / 100) * (user.height / 100)))
                : (user?.bmi ? bmiLabel(user.bmi) : '')
            }
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard
            label="Health Score"
            value={noData ? '--' : healthScore}
            unit={noData ? '' : '%'}
            icon={<ScienceIcon sx={{ fontSize: 20, color: '#22c55e' }} />}
            color="#22c55e"
            sublabel={healthScore >= 80 ? 'Good' : healthScore >= 60 ? 'Fair' : 'Needs Attention'}
          />
        </Grid>
      </Grid>

      {/* Row 2 – Daily Tip + Risk Distribution */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} md={5}>
          <DailyTip />
        </Grid>
        <Grid item xs={12} md={7}>
          <ChartCard title="Risk Level Distribution" subtitle="Across all your assessments">
            {noData ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>No data yet</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={riskDistData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    outerRadius={80} innerRadius={45} paddingAngle={3}
                    label={({ name }) => name}>
                    {riskDistData.map((entry) => (
                      <Cell key={entry.name} fill={RISK_COLORS[entry.name] || '#94a3b8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} assessment${v !== 1 ? 's' : ''}`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </Grid>
      </Grid>

      {/* Analytics Section Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
        <BarChartOutlinedIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>Analytics</Typography>
        <Divider sx={{ flexGrow: 1, ml: 1 }} />
      </Box>

      {noData ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          No analytics data yet. Complete a prediction assessment first!
        </Alert>
      ) : (
        <>
          {/* Row 3 – HbA1c + Blood Sugar */}
          <Grid container spacing={2.5} mb={2.5}>
            <Grid item xs={12} md={6}>
              <ChartCard title="HbA1c Over Time" subtitle="Glycated haemoglobin (%) — normal < 5.7%">
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={5.7} stroke="#f59e0b" strokeDasharray="4 4"
                      label={{ value: 'Pre-diabetic', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }} />
                    <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="4 4"
                      label={{ value: 'Diabetic', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                    <Line name="HbA1c (%)" type="monotone" dataKey="hba1c" stroke="#6366f1"
                      strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Blood Sugar Levels" subtitle="Fasting (FBS) vs Random (RBS) in mg/dL">
                <ResponsiveContainer width="100%" height={230}>
                  <LineChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4"
                      label={{ value: 'FBS limit', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }} />
                    <ReferenceLine y={126} stroke="#ef4444" strokeDasharray="4 4"
                      label={{ value: 'Diabetic', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                    <Line name="Fasting Sugar" type="monotone" dataKey="fbs" stroke="#ef4444"
                      strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} connectNulls />
                    <Line name="Random Sugar" type="monotone" dataKey="rbs" stroke="#f59e0b"
                      strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 6 }} connectNulls />
                    <Legend iconSize={10} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 4 – BMI area + Health Score area */}
          <Grid container spacing={2.5} mb={2.5}>
            <Grid item xs={12} md={6}>
              <ChartCard title="BMI Trend" subtitle="Body Mass Index over time">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="bmiGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={24.9} stroke="#22c55e" strokeDasharray="4 4"
                      label={{ value: 'Normal upper', position: 'insideTopRight', fontSize: 10, fill: '#22c55e' }} />
                    <ReferenceLine y={29.9} stroke="#ef4444" strokeDasharray="4 4"
                      label={{ value: 'Obese boundary', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                    <Area name="BMI" type="monotone" dataKey="bmi" stroke="#6366f1"
                      fill="url(#bmiGrad)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} connectNulls />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard title="Health Score History" subtitle="Computed from all biomarkers (0–100)">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={80} stroke="#22c55e" strokeDasharray="4 4"
                      label={{ value: 'Good', position: 'insideTopRight', fontSize: 10, fill: '#22c55e' }} />
                    <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="4 4"
                      label={{ value: 'Fair', position: 'insideTopRight', fontSize: 10, fill: '#f59e0b' }} />
                    <Area name="Health Score" type="monotone" dataKey="score" stroke="#22c55e"
                      fill="url(#scoreGrad)" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 5 – Lipid Panel + Symptom Frequency */}
          <Grid container spacing={2.5} mb={2.5}>
            {hasLipids && (
              <Grid item xs={12} md={7}>
                <ChartCard title="Lipid Panel Over Time" subtitle="Cholesterol, HDL & LDL (mg/dL)">
                  <ResponsiveContainer width="100%" height={230}>
                    <LineChart data={timeSeriesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line name="Total Cholesterol" type="monotone" dataKey="cholesterol"
                        stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                      <Line name="HDL (Good)" type="monotone" dataKey="hdl"
                        stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                      <Line name="LDL (Bad)" type="monotone" dataKey="ldl"
                        stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                      <Legend iconSize={10} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </Grid>
            )}
            <Grid item xs={12} md={hasLipids ? 5 : 12}>
              <ChartCard title="Symptom Frequency" subtitle="Occurrence rate across all assessments">
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart data={symptomData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10 }} />
                    <YAxis dataKey="label" type="category" width={90} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v}%`, 'Occurrence rate']} />
                    <Bar dataKey="pct" name="Occurrence %" radius={[0, 4, 4, 0]}>
                      {symptomData.map((entry, i) => (
                        <Cell key={i} fill={entry.pct >= 60 ? '#ef4444' : entry.pct >= 30 ? '#f59e0b' : '#22c55e'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </Grid>
          </Grid>

          {/* Row 6 – Risk Factor Progress bars */}
          {predictions.length >= 2 && (
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <ChartCard title="Risk Factor Prevalence" subtitle="Percentage of assessments flagging each lifestyle risk factor">
                  <Grid container spacing={3} mt={0.5}>
                    {[
                      { key: 'familyHistory', label: 'Family History', color: '#8b5cf6' },
                      { key: 'smoking', label: 'Smoking', color: '#ef4444' },
                      { key: 'alcohol', label: 'Alcohol', color: '#f59e0b' },
                    ].map(({ key, label, color }) => {
                      const pct = Math.round((predictions.filter((p) => p[key]).length / predictions.length) * 100);
                      return (
                        <Grid item xs={12} sm={4} key={key}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="body2" fontWeight={600}>{label}</Typography>
                            <Typography variant="body2" color="text.secondary">{pct}%</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate" value={pct}
                            sx={{ height: 8, borderRadius: 4, bgcolor: color + '20', '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 4 } }}
                          />
                        </Grid>
                      );
                    })}
                  </Grid>
                </ChartCard>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </Box>
  );
};

export default DashboardPage;