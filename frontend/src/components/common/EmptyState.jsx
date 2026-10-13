import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import emptyStateImg from '../../assets/images/empty-state.svg';

const EmptyState = ({ message = 'No data found', icon }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        textAlign: 'center',
      }}
    >
      <motion.img
        src={icon || emptyStateImg}
        alt="Empty"
        style={{ width: 200, marginBottom: 24 }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;