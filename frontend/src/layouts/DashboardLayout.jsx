import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

// This is a simple wrapper that can be used for nested routes if needed.
// For now it just renders child routes.
const DashboardLayout = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Outlet />
    </Box>
  );
};

export default DashboardLayout;