import { Box, Typography } from '@mui/material';
import AiHealthCoach from '../../components/ai/AiHealthCoach';

const AiHealthCoachPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        AI Health Coach
      </Typography>
      <AiHealthCoach />
    </Box>
  );
};

export default AiHealthCoachPage;