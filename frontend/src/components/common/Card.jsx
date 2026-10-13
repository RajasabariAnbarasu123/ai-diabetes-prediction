import { Card as MuiCard, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Card = ({ title, subtitle, children, action, sx, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MuiCard
        sx={{
          borderRadius: 4,
          p: 0,
          backgroundColor: 'background.paper',
          backgroundImage: 'none',
          ...sx,
        }}
        {...props}
      >
        {(title || action) && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pt: 2, pb: 0 }}>
            <Box>
              {title && <Typography variant="h6" fontWeight={600}>{title}</Typography>}
              {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
            </Box>
            {action && <Box>{action}</Box>}
          </Box>
        )}
        <CardContent>{children}</CardContent>
      </MuiCard>
    </motion.div>
  );
};

export default Card;