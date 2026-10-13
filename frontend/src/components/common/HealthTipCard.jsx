import Card from './Card';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

const HealthTipCard = ({ tip, source }) => {
  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        color: 'text.primary',
      }}
    >
      <motion.div initial={{ rotate: -5 }} animate={{ rotate: 0 }} transition={{ duration: 0.5 }}>
        <LightbulbIcon sx={{ fontSize: 40, color: '#2e7d32', mb: 1 }} />
      </motion.div>
      <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
        {tip}
      </Typography>
      {source && (
        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
          — {source}
        </Typography>
      )}
    </Card>
  );
};

export default HealthTipCard;