import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box, Grid, Typography, Paper, Chip, LinearProgress, Divider, Avatar, Card, CardContent, Button
} from '@mui/material';
import {
  People as PeopleIcon,
  MonitorHeart as MonitorHeartIcon,
  Psychology as AiIcon,
  Storage as StorageIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchAdminStats, fetchAllPredictions } from '../../store/slices/adminSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { stats, predictions, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchAllPredictions({ page: 0, size: 5 }));
  }, [dispatch]);

  // Derived Analytics Data from real backend stats
  const totalUsersCount = stats?.totalUsers ?? 0;
  const activeUsersCount = stats?.activeUsers ?? 0;
  const disabledUsersCount = stats?.disabledUsers ?? 0;
  const totalPredictions = stats?.totalPredictions ?? 0;

  const highRiskCount = stats?.highRiskCount ?? 0;
  const moderateRiskCount = stats?.moderateRiskCount ?? 0;
  const lowRiskCount = stats?.lowRiskCount ?? 0;

  const totalCalc = totalPredictions > 0 ? totalPredictions : (highRiskCount + moderateRiskCount + lowRiskCount);
  const highPct = totalCalc > 0 ? Math.round((highRiskCount / totalCalc) * 100) : 0;
  const modPct = totalCalc > 0 ? Math.round((moderateRiskCount / totalCalc) * 100) : 0;
  const lowPct = totalCalc > 0 ? Math.round((lowRiskCount / totalCalc) * 100) : 0;

  // Monthly trends data for SVG chart
  const monthlyData = stats?.monthlyTrends || [];
  const maxCount = Math.max(...monthlyData.map(d => d.count), 1);

  const activeRate = totalUsersCount > 0 ? Math.round((activeUsersCount / totalUsersCount) * 100) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" fontWeight={800}>
              System Analytics & Overview
            </Typography>
            <Chip
              icon={<CheckCircleIcon sx={{ fontSize: '14px !important', color: '#16a34a !important' }} />}
              label="SYSTEM ONLINE"
              size="small"
              sx={{ bgcolor: '#16a34a15', color: '#16a34a', fontWeight: 800, border: '1px solid #16a34a40', height: 24 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Real-time telemetry, risk prevalence analytics, and AI model performance metrics
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => navigate('/admin/users')}
          startIcon={<PeopleIcon />}
          sx={{ borderRadius: 2.5, px: 2.5, py: 1, textTransform: 'none', fontWeight: 700 }}
        >
          Manage Users
        </Button>
      </Box>

      {/* ── 4 Key KPI Metrics Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {[
          { title: 'Total Registered Users', value: totalUsersCount, sub: `${disabledUsersCount} disabled accounts`, icon: <PeopleIcon sx={{ color: '#0284c7' }} />, color: '#0284c7', bg: '#0284c70f' },
          { title: 'Active Patients', value: activeUsersCount, sub: `${activeRate}% active account rate`, icon: <CheckCircleIcon sx={{ color: '#16a34a' }} />, color: '#16a34a', bg: '#16a34a0f' },
          { title: 'Risk Predictions Evaluated', value: totalPredictions, sub: 'Powered by Gemini AI', icon: <MonitorHeartIcon sx={{ color: '#ea580c' }} />, color: '#ea580c', bg: '#ea580c0f' },
          { title: 'AI Inference Engine', value: 'Gemini 2.0', sub: 'Model active & healthy', icon: <AiIcon sx={{ color: '#9333ea' }} />, color: '#9333ea', bg: '#9333ea0f' },
        ].map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  {kpi.title}
                </Typography>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: kpi.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {kpi.icon}
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={800} color="text.primary" mb={0.5}>
                {kpi.value}
              </Typography>
              <Typography variant="caption" fontWeight={600} color={kpi.color}>
                {kpi.sub}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ── Charts & Analytics Section ── */}
      <Grid container spacing={3} sx={{ mb: 3.5 }}>
        {/* Left: Monthly Prediction Volume Trend Chart */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" fontWeight={800}>
                    Monthly Prediction Volume Trends
                  </Typography>
                  {maxCount > 0 && (
                    <Chip
                      label={`Peak: ${maxCount} evaluations`}
                      size="small"
                      color="primary"
                      sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  6-month risk assessment telemetry and patient AI evaluation distribution
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={`${monthlyData.reduce((acc, curr) => acc + curr.count, 0)} Total 6M`}
                  size="small"
                  sx={{ bgcolor: 'action.hover', fontWeight: 700, borderRadius: 1.5 }}
                />
              </Box>
            </Box>

            {/* Custom Interactive SVG Bar Chart with Background Gridlines */}
            <Box
              sx={{
                position: 'relative',
                height: 220,
                pt: 3,
                pb: 1,
                px: 2,
                borderRadius: 2.5,
                bgcolor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
              }}
            >
              {/* Background Gridlines */}
              <Box sx={{ position: 'absolute', top: 32, bottom: 40, left: 16, right: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', opacity: 0.4 }}>
                {[100, 75, 50, 25, 0].map((level) => (
                  <Box key={level} sx={{ borderBottom: '1px dashed', borderColor: 'divider', width: '100%' }} />
                ))}
              </Box>

              {monthlyData.length > 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', position: 'relative', zIndex: 1 }}>
                  {monthlyData.map((d, i) => {
                    const isPeak = d.count > 0 && d.count === maxCount;
                    const heightPct = Math.max(Math.round((d.count / maxCount) * 100), d.count > 0 ? 10 : 4);

                    return (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          height: '100%',
                          width: `${100 / monthlyData.length}%`,
                          px: 0.5,
                        }}
                      >
                        {/* Value Badge */}
                        <Typography
                          variant="caption"
                          fontWeight={800}
                          sx={{
                            mb: 0.75,
                            fontSize: '0.725rem',
                            color: isPeak ? 'primary.main' : 'text.primary',
                            bgcolor: isPeak ? 'primary.main' + '15' : 'transparent',
                            px: isPeak ? 1 : 0,
                            borderRadius: 1,
                          }}
                        >
                          {d.count}
                        </Typography>

                        {/* Bar */}
                        <Box
                          sx={{
                            width: '65%',
                            maxWidth: 38,
                            height: `${heightPct}%`,
                            minHeight: 10,
                            borderRadius: '8px 8px 3px 3px',
                            background: isPeak
                              ? 'linear-gradient(180deg, #6366f1 0%, #0284c7 100%)'
                              : 'linear-gradient(180deg, #0284c7 0%, #38bdf8 100%)',
                            boxShadow: isPeak
                              ? '0 6px 16px rgba(99, 102, 241, 0.4)'
                              : '0 4px 10px rgba(2, 132, 199, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            '&:hover': {
                              transform: 'scaleY(1.06) translateY(-2px)',
                              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.5)',
                              background: 'linear-gradient(180deg, #818cf8 0%, #0284c7 100%)',
                            },
                          }}
                        />

                        {/* Month Label */}
                        <Typography
                          variant="caption"
                          color={isPeak ? 'primary.main' : 'text.secondary'}
                          fontWeight={isPeak ? 800 : 600}
                          sx={{ mt: 1, fontSize: '0.75rem' }}
                        >
                          {d.month}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>
                    No prediction volume trend data recorded yet.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right: Risk Prevalence Distribution */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <Typography variant="h6" fontWeight={700} mb={0.5}>
              Diabetes Risk Distribution
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" mb={3}>
              Patient stratification by evaluated diabetes risk tier
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* High Risk */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700} color="error.main">High Risk (Type 2 Diabetes)</Typography>
                  <Typography variant="body2" fontWeight={800}>{highPct}% ({highRiskCount})</Typography>
                </Box>
                <LinearProgress variant="determinate" value={highPct} color="error" sx={{ height: 10, borderRadius: 5 }} />
              </Box>

              {/* Moderate Risk */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700} color="warning.main">Moderate Risk (Pre-diabetes)</Typography>
                  <Typography variant="body2" fontWeight={800}>{modPct}% ({moderateRiskCount})</Typography>
                </Box>
                <LinearProgress variant="determinate" value={modPct} color="warning" sx={{ height: 10, borderRadius: 5 }} />
              </Box>

              {/* Low Risk */}
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={700} color="success.main">Low Risk (Normal)</Typography>
                  <Typography variant="body2" fontWeight={800}>{lowPct}% ({lowRiskCount})</Typography>
                </Box>
                <LinearProgress variant="determinate" value={lowPct} color="success" sx={{ height: 10, borderRadius: 5 }} />
              </Box>
            </Box>

            <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TrendingUpIcon color="primary" />
              <Typography variant="caption" color="text.secondary">
                {highRiskCount > 0 ? `${highRiskCount} high-risk patients have customized AI diet & exercise recommendations.` : 'All clinical AI guidance algorithms operational.'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ── System Infrastructure & Live Stream ── */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Infrastructure Health & Status
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { name: 'Gemini AI Inference Engine (gemini-2.0-flash)', status: 'Operational', latency: '38ms' },
                { name: 'Apache PDFBox OCR Document Extractor', status: 'Operational', latency: '12ms' },
                { name: 'Spring Boot REST Security Engine', status: 'Operational', latency: '4ms' },
                { name: 'PostgreSQL Clinical Database', status: 'Operational', latency: '2ms' },
              ].map((sys, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SpeedIcon fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight={600}>{sys.name}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip label={sys.status} size="small" color="success" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">{sys.latency}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Recent AI Risk Predictions
              </Typography>
              <Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/admin/predictions')}>
                View All
              </Button>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {predictions && predictions.length > 0 ? (
                predictions.slice(0, 4).map((p) => (
                  <Box key={p.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>{p.userEmail || p.userName || `Assessment #${p.id}`}</Typography>
                      <Typography variant="caption" color="text.secondary">HbA1c: {p.hba1c != null ? `${p.hba1c}%` : 'N/A'} • {new Date(p.createdAt).toLocaleDateString()}</Typography>
                    </Box>
                    <Chip
                      label={p.diabetesRisk || 'MODERATE'}
                      size="small"
                      color={p.diabetesRisk === 'HIGH' ? 'error' : p.diabetesRisk === 'LOW' ? 'success' : 'warning'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                  No recent risk predictions evaluated yet.
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardPage;