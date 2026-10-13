import { Box } from '@mui/material';

const statusColors = {
  Good: '#4caf50',
  Moderate: '#ff9800',
  Bad: '#f44336',
};

const ColorIndicator = ({ status = 'Good' }) => {
  return (
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: '50%',
        backgroundColor: statusColors[status] || statusColors.Good,
        display: 'inline-block',
        mr: 1,
      }}
    />
  );
};

export default ColorIndicator;