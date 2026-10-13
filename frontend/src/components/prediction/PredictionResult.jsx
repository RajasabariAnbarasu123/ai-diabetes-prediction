import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import RiskBadge from '../common/RiskBadge';
import ProgressBar from '../common/ProgressBar';

const PredictionResult = () => {
  const { currentPrediction, loading } = useSelector((state) => state.prediction);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
        <CircularProgress size={48} />
        <Typography color="text.secondary" fontWeight={500}>
          Analyzing your data with AI…
        </Typography>
      </Box>
    );
  }

  if (!currentPrediction) return null;

  const {
    diabetesRisk,
    diabetesStage,
    confidenceScore,
    explanation,
    riskFactors,
    clinicalSummary,
    personalizedDiet,
    exercisePlan,
    lifestyleChanges,
    foodsToEat,
    foodsToAvoid,
    medicationReminders,
    warningSigns,
    whenToConsultDoctor,
  } = currentPrediction;

  return (
    <Box>
      {/* Risk summary row */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">Risk Level</Typography>
          <RiskBadge level={diabetesRisk} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" color="text.secondary">Stage</Typography>
          <Chip label={diabetesStage} color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2" color="text.secondary">Confidence</Typography>
          <ProgressBar value={confidenceScore} showValue />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom>Explanation</Typography>
      <Typography paragraph>{explanation}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Risk Factors</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {riskFactors
          ? (Array.isArray(riskFactors) ? riskFactors : riskFactors.split(', ').filter(Boolean))
              .map((factor, i) => <Chip key={i} label={factor} size="small" color="warning" variant="outlined" />)
          : <Typography variant="body2" color="text.secondary">No major risk factors detected.</Typography>
        }
      </Box>

      <Typography variant="h6" gutterBottom>Clinical Summary</Typography>
      <Typography paragraph>{clinicalSummary}</Typography>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Diet Recommendations</Typography>
          <Typography variant="subtitle2" mt={1}>Personalized Diet</Typography>
          <Typography>{personalizedDiet}</Typography>
          <Typography variant="subtitle2" mt={2}>Foods to Eat</Typography>
          <Typography>{foodsToEat}</Typography>
          <Typography variant="subtitle2" mt={2}>Foods to Avoid</Typography>
          <Typography>{foodsToAvoid}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Exercise Plan</Typography>
          <Typography>{exercisePlan}</Typography>
          <Typography variant="h6" mt={2}>Lifestyle Changes</Typography>
          <Typography>{lifestyleChanges}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>Medication Reminders</Typography>
      <Typography>{medicationReminders}</Typography>

      <Typography variant="h6" mt={3} gutterBottom>Warning Signs</Typography>
      <Typography>{warningSigns}</Typography>

      <Typography variant="h6" mt={3} gutterBottom>When to Consult a Doctor</Typography>
      <Typography>{whenToConsultDoctor}</Typography>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block' }}>
        * This information is supportive and not a replacement for a licensed healthcare professional.
      </Typography>
    </Box>
  );
};

export default PredictionResult;