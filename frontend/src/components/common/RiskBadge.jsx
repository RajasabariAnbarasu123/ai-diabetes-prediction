import { Chip } from '@mui/material';
import { RISK_LEVELS } from '../../config/constants';

const riskColorMap = {
  [RISK_LEVELS.LOW]: 'success',
  [RISK_LEVELS.MODERATE]: 'warning',
  [RISK_LEVELS.HIGH]: 'error',
  [RISK_LEVELS.CRITICAL]: 'error',
};

const RiskBadge = ({ level, size = 'medium' }) => {
  return (
    <Chip
      label={level}
      color={riskColorMap[level] || 'default'}
      size={size}
      sx={{ fontWeight: 600, borderRadius: 2 }}
    />
  );
};

export default RiskBadge;