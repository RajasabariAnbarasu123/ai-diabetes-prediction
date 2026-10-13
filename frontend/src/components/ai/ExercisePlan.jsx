import { Box, Typography, Grid, Paper } from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import PedalBikeIcon from '@mui/icons-material/PedalBike';

const iconMap = {
  walking: <DirectionsWalkIcon fontSize="large" />,
  running: <DirectionsRunIcon fontSize="large" />,
  yoga: <SelfImprovementIcon fontSize="large" />,
  cycling: <PedalBikeIcon fontSize="large" />,
  stretching: <SelfImprovementIcon fontSize="large" />,
};

const ExercisePlan = ({ plan }) => {
  if (!plan) return null;

  return (
    <Paper sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h5" gutterBottom fontWeight={700}>Exercise Recommendations</Typography>
      <Grid container spacing={2}>
        {plan.activities?.map((activity, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {iconMap[activity.type.toLowerCase()] || <DirectionsWalkIcon />}
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>{activity.name}</Typography>
                <Typography variant="body2">Duration: {activity.duration} min</Typography>
                <Typography variant="body2">Calories: {activity.calories}</Typography>
                <Typography variant="body2">Frequency: {activity.frequency}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ExercisePlan;