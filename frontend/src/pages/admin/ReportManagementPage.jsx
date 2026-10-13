import { Box, Typography } from '@mui/material';
import ReportList from '../../components/admin/ReportList';

const ReportManagementPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Report Management
      </Typography>
      <ReportList />
    </Box>
  );
};

export default ReportManagementPage;