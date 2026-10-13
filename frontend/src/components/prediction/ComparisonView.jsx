import { useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper, Chip } from '@mui/material';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ColorIndicator from '../common/ColorIndicator';

const ComparisonView = () => {
  const { comparison, loading } = useSelector((state) => state.prediction);

  if (!comparison && !loading) return null;

  if (loading) return <Typography>Generating comparison...</Typography>;

  const { previous, current, differences, explanation } = comparison;

  const getStatus = (diff, metric) => {
    // diff could be negative (improvement) or positive (worsening) depending on metric
    // For HbA1c, lower is better; for BMI, lower is better; etc.
    const lowerIsBetter = ['hba1c', 'bmi', 'bloodSugar', 'cholesterol'];
    if (lowerIsBetter.includes(metric)) return diff <= 0 ? 'Good' : 'Bad';
    return diff >= 0 ? 'Good' : 'Bad'; // for weight if patient wants to gain?
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>Comparison</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Previous ({previous.date})</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            {Object.entries(previous.values).map(([key, val]) => (
              <Typography key={key}><strong>{key}:</strong> {val}</Typography>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1">Current ({current.date})</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
            {Object.entries(current.values).map(([key, val]) => (
              <Typography key={key}><strong>{key}:</strong> {val}</Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Changes</Typography>
        {Object.entries(differences).map(([metric, diff]) => {
          const status = getStatus(diff, metric);
          return (
            <Box key={metric} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <ColorIndicator status={status} />
              <Typography>
                {metric}: {diff > 0 ? `+${diff}` : diff} {status === 'Good' ? <TrendingDownIcon fontSize="small" color="success" /> : <TrendingUpIcon fontSize="small" color="error" />}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 3, p: 2, backgroundColor: 'info.light', borderRadius: 2 }}>
        <Typography variant="subtitle1">AI Explanation</Typography>
        <Typography>{explanation}</Typography>
      </Box>
    </Paper>
  );
};

export default ComparisonView;