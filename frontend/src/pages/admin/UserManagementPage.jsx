import { Box, Typography } from '@mui/material';
import UserTable from '../../components/admin/UserTable';

const UserManagementPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        User Management
      </Typography>
      <UserTable />
    </Box>
  );
};

export default UserManagementPage;