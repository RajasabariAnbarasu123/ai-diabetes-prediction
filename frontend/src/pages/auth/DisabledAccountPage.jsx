import { Box, Paper, Typography, Button, Avatar, Chip, Container, useTheme } from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';
import ShieldAlertIcon from '@mui/icons-material/Security';
import { logoutUser } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DisabledAccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => { dispatch(logoutUser()); navigate('/login'); };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: 2,
      background: isDark
        ? 'linear-gradient(145deg, #0f172a 0%, #1c0a0a 100%)'
        : 'linear-gradient(145deg, #fef2f2 0%, #fff5f5 100%)',
    }}>
      <Container maxWidth="sm">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper elevation={0} sx={{
            p: { xs: 3, sm: 5 }, borderRadius: 4, textAlign: 'center',
            border: '1px solid', borderColor: isDark ? '#7f1d1d50' : '#fecaca',
            boxShadow: isDark ? '0 24px 64px rgba(239,68,68,0.15)' : '0 24px 64px rgba(239,68,68,0.10)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Top bar */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg, #ef4444, #f97316)' }} />

            {/* Background glow */}
            <Box sx={{
              position: 'absolute', width: 300, height: 300, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(239,68,68,0.08), transparent)',
              top: -100, left: '50%', transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }} />

            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
              <Avatar sx={{
                width: 80, height: 80, mx: 'auto', mb: 2.5,
                background: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2',
                color: 'error.main',
                border: '2px solid', borderColor: isDark ? 'rgba(239,68,68,0.3)' : '#fecaca',
                boxShadow: '0 0 0 8px rgba(239,68,68,0.08)',
              }}>
                <BlockIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </motion.div>

            <Chip
              icon={<ShieldAlertIcon sx={{ fontSize: '16px !important', color: '#ef4444 !important' }} />}
              label="ACCOUNT DEACTIVATED"
              color="error" variant="outlined"
              sx={{ fontWeight: 800, letterSpacing: 1, mb: 2.5, px: 1, borderRadius: 2 }}
            />

            <Typography variant="h4" fontWeight={800} gutterBottom>
              Account Suspended
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              Hello <strong>{user?.name || user?.email || 'User'}</strong>, your account has been disabled by a system administrator.
              Access to clinical tools, predictions, and health data is currently restricted.
            </Typography>

            {/* Details card */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider', textAlign: 'left' }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: 0.5, display: 'block', mb: 2, textTransform: 'uppercase' }}>
                Account Details
              </Typography>
              {[
                { label: 'Email', value: user?.email || 'N/A' },
                { label: 'Role', value: user?.role || 'PATIENT' },
                { label: 'Status', value: <Chip label="DISABLED" size="small" color="error" sx={{ fontWeight: 800, height: 20, fontSize: '0.7rem' }} /> },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
                  <Typography variant="body2" color="text.secondary">{row.label}</Typography>
                  {typeof row.value === 'string'
                    ? <Typography variant="body2" fontWeight={700}>{row.value}</Typography>
                    : row.value}
                </Box>
              ))}
            </Paper>

            {/* Support hint */}
            <Box sx={{ mb: 3, p: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(14,165,233,0.08)' : '#f0f9ff', border: '1px solid', borderColor: isDark ? 'rgba(14,165,233,0.2)' : '#bae6fd', display: 'flex', alignItems: 'flex-start', gap: 1.5, textAlign: 'left' }}>
              <EmailIcon sx={{ color: 'info.main', mt: 0.25, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                To restore access, contact your system administrator or clinical support team.
              </Typography>
            </Box>

            <Button
              variant="contained" color="error" size="large" fullWidth
              onClick={handleLogout} startIcon={<LogoutIcon />}
              sx={{ py: 1.5, borderRadius: 2.5, fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', '&:hover': { boxShadow: '0 6px 20px rgba(239,68,68,0.4)' } }}
            >
              Sign Out
            </Button>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default DisabledAccountPage;
