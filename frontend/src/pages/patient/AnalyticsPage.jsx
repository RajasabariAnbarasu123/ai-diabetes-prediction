import { useState, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress, Alert } from '@mui/material';
import LineChartCard from '../../components/charts/LineChartCard';
import AreaChartCard from '../../components/charts/AreaChartCard';
import MonthlyTrendChart from '../../components/charts/MonthlyTrendChart';
import Card from '../../components/common/Card';
import predictionService from '../../services/predictionService';

const AnalyticsPage = () => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    setLoading(true);
    // Fetch predictions sorted by date ascending for chronological charts
    predictionService.getPredictions({ page: 0, size: 100, sort: 'createdAt,asc' })
      .then((data) => {
        const list = data.content || [];
        setPredictions(list);

        if (list.length > 0) {
          const latest = list[list.length - 1];

          // Compute overall health score dynamically
          let score = 100;
          if (latest.hba1c > 5.7) score -= 10;
          if (latest.hba1c > 6.5) score -= 10;
          if (latest.bmi < 18.5 || latest.bmi > 25) score -= 10;
          if (latest.bmi > 30) score -= 10;
          if (latest.fastingBloodSugar > 100) score -= 10;
          if (latest.fastingBloodSugar > 126) score -= 10;
          if (latest.smoking) score -= 5;
          if (latest.alcohol) score -= 5;
          if (latest.physicalActivity && latest.physicalActivity.toLowerCase().includes('active')) score += 5;
          score = Math.max(40, Math.min(100, score));
          setHealthScore(score);
        }
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getHbA1cData = () => {
    return predictions.map((p) => ({
      month: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: p.hba1c,
    }));
  };

  const getBmiData = () => {
    return predictions.map((p) => ({
      month: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bmi: p.bmi ? parseFloat(p.bmi.toFixed(1)) : 0,
    }));
  };

  const getMonthlyPredictionsData = () => {
    if (predictions.length === 0) {
      return [{ month: 'No Data', predictions: 0 }];
    }
    const counts = predictions.reduce((acc, p) => {
      const month = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((month) => ({
      month,
      predictions: counts[month],
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Analytics
      </Typography>

      {predictions.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2, borderRadius: 3 }}>
          No analytics data available. Perform a diabetes prediction assessment first to see your trends!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LineChartCard title="HbA1c Over Time" data={getHbA1cData()} dataKey="value" xAxisKey="month" />
          </Grid>
          <Grid item xs={12} md={6}>
            <AreaChartCard title="BMI Trend" data={getBmiData()} dataKey="bmi" xAxisKey="month" />
          </Grid>
          <Grid item xs={12} md={6}>
            <MonthlyTrendChart title="Monthly Predictions" data={getMonthlyPredictionsData()} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card title="Overall Health Score">
              <Box sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  {healthScore}%
                </Typography>
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AnalyticsPage;