import { Box, Typography } from '@mui/material';
import ComparisonView from '../../components/prediction/ComparisonView';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

const ComparisonPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Compare Predictions
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Button variant="outlined" onClick={() => navigate('/history')}>
          Select records from history
        </Button>
      </Box>
      <ComparisonView />
    </Box>
  );
};

export default ComparisonPage;