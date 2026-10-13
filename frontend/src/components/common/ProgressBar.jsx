import { Box, LinearProgress, Typography } from '@mui/material';

const ProgressBar = ({ value = 0, label, color = 'primary', showValue = true }) => {
  const percentValue = value <= 1 ? Math.round(value * 100) : Math.round(value);

  const getColor = () => {
    if (percentValue < 40) return 'error';
    if (percentValue < 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        {showValue && <Typography variant="body2" fontWeight={600}>{percentValue}%</Typography>}
      </Box>
      <LinearProgress
        variant="determinate"
        value={Math.min(percentValue, 100)}
        color={color || getColor()}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default ProgressBar;