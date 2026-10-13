import { Box, Typography } from '@mui/material';
import HistoryTable from '../../components/prediction/HistoryTable';

const HistoryPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Prediction History
      </Typography>
      <HistoryTable />
    </Box>
  );
};

export default HistoryPage;