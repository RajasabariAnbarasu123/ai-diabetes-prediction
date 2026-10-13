import { Button as MuiButton, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const Button = ({ children, loading, disabled, variant = 'contained', color = 'primary', size = 'medium', startIcon, endIcon, onClick, ...props }) => {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <MuiButton
        variant={variant}
        color={color}
        size={size}
        disabled={loading || disabled}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : startIcon}
        endIcon={!loading && endIcon}
        onClick={onClick}
        {...props}
        sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1, ...props.sx }}
      >
        {children}
      </MuiButton>
    </motion.div>
  );
};

export default Button;