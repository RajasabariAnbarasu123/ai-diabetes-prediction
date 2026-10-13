import { Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const DashboardCard = ({ title, value, icon, color = 'primary.main' }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Paper sx={{ p: 3, borderRadius: 4, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
        {icon && <Box sx={{ color }}>{icon}</Box>}
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h5" fontWeight={700}>{value}</Typography>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default DashboardCard;