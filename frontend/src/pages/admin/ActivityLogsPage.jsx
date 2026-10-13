import { Box, Typography } from '@mui/material';
import ActivityLogTable from '../../components/admin/ActivityLogTable';

const ActivityLogsPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Activity Logs
      </Typography>
      <ActivityLogTable />
    </Box>
  );
};

export default ActivityLogsPage;