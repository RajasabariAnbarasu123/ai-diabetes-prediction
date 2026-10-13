import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { MonitorHeartOutlined, ShieldOutlined, ScienceOutlined } from '@mui/icons-material';

const FEATURES = [
  { icon: <MonitorHeartOutlined sx={{ fontSize: 22 }} />, text: 'AI-Powered Risk Assessment' },
  { icon: <ShieldOutlined sx={{ fontSize: 22 }} />, text: 'Clinical Decision Support' },
  { icon: <ScienceOutlined sx={{ fontSize: 22 }} />, text: 'Evidence-Based Insights' },
];

const AuthLayout = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
      }}
    >
      {/* ── Left Panel (hidden on mobile) ── */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: '45%',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          background: isDark
            ? 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 40%, #0c4a6e 100%)'
            : 'linear-gradient(145deg, #4f46e5 0%, #6366f1 40%, #0ea5e9 100%)',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
        }}>
          <Box sx={{
            position: 'absolute', width: 400, height: 400, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent)',
            top: -100, left: -100,
            animation: 'float 6s ease-in-out infinite',
          }} />
          <Box sx={{
            position: 'absolute', width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.4), transparent)',
            bottom: -80, right: -80,
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s',
          }} />
          <Box sx={{
            position: 'absolute', width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.4), transparent)',
            top: '40%', right: '10%',
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '4s',
          }} />
        </Box>

        {/* Grid pattern overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }} />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', maxWidth: 380 }}>
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Box sx={{
              width: 80, height: 80, borderRadius: 4, mx: 'auto', mb: 3,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}>
              <MonitorHeartOutlined sx={{ fontSize: 40, color: '#fff' }} />
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Typography variant="h3" fontWeight={800} sx={{ color: '#fff', mb: 1, letterSpacing: '-0.02em' }}>
              Diabetes CDSS
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4, lineHeight: 1.6 }}>
              AI-Powered Clinical Decision Support System for comprehensive diabetes management
            </Typography>
          </motion.div>

          {/* Feature pills */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, alignItems: 'flex-start' }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                style={{ width: '100%' }}
              >
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  px: 2.5, py: 1.5, borderRadius: 3,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  textAlign: 'left',
                }}>
                  <Box sx={{
                    width: 36, height: 36, borderRadius: 2,
                    background: 'rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {f.icon}
                  </Box>
                  <Typography variant="body2" fontWeight={600}>{f.text}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Bottom tagline */}
          <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#4ade80' }} />
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
              Trusted by clinicians worldwide
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Right Panel (Form) ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 4 },
          overflowY: 'auto',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="sm">
          {/* Mobile brand (only visible on small screens) */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', alignItems: 'center', mb: 4, gap: 1 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: 3,
              background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MonitorHeartOutlined sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" fontWeight={800}
              sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Diabetes CDSS
            </Typography>
          </Box>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4.5 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                boxShadow: isDark
                  ? '0 24px 64px rgba(0,0,0,0.5)'
                  : '0 24px 64px rgba(15,23,42,0.08)',
              }}
            >
              <Outlet />
            </Paper>
          </motion.div>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 3 }}>
            © 2025 Diabetes CDSS — All rights reserved
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default AuthLayout;