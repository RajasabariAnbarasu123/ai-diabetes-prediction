import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, useTheme } from '@mui/material';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import { motion } from 'framer-motion';

const CLINICAL_MESSAGES = [
  'Accessing clinical decision engine...',
  'Analyzing patient metabolic metrics...',
  'Evaluating diabetes risk predictors...',
  'Preparing healthcare insights...',
  'Loading clinical support tools...',
  'Structuring diagnostic history...',
];

const LoadingScreen = ({ isTransitioning = false }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Pick a random message for the short loading screen transition
    const randomIndex = Math.floor(Math.random() * CLINICAL_MESSAGES.length);
    setMessage(CLINICAL_MESSAGES[randomIndex]);

    // If it takes longer, cycle the messages
    const interval = setInterval(() => {
      setMessage((prev) => {
        const nextIndex = (CLINICAL_MESSAGES.indexOf(prev) + 1) % CLINICAL_MESSAGES.length;
        return CLINICAL_MESSAGES[nextIndex];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: isDarkMode
          ? 'radial-gradient(circle, rgba(30, 30, 30, 0.85) 0%, rgba(18, 18, 18, 0.95) 100%)'
          : 'radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(245, 245, 245, 0.95) 100%)',
        backdropFilter: 'blur(8px)',
        gap: 3,
      }}
    >
      {/* Container for Spinner + Pulse Icon */}
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Glow effect */}
        <Box
          component={motion.div}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            right: -10,
            bottom: -10,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            filter: 'blur(20px)',
            zIndex: 0,
          }}
        />

        {/* Circular Progress */}
        <CircularProgress
          size={96}
          thickness={4}
          sx={{
            color: 'primary.main',
            zIndex: 1,
          }}
        />

        {/* Icon in Center with pulsing animation */}
        <Box
          component={motion.div}
          animate={{
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}
        >
          <MonitorHeartOutlinedIcon
            sx={{
              fontSize: 42,
              color: 'primary.main',
            }}
          />
        </Box>
      </Box>

      {/* Message & Secondary text */}
      <Box
        component={motion.div}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: isDarkMode ? 'grey.100' : 'grey.900',
            letterSpacing: '0.5px',
            textAlign: 'center',
            px: 2,
          }}
        >
          Diabetes CDSS
        </Typography>
        
        <Typography
          component={motion.p}
          key={message}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          variant="body2"
          sx={{
            color: isDarkMode ? 'primary.light' : 'primary.dark',
            fontWeight: 500,
            textAlign: 'center',
            minHeight: '20px',
            px: 2,
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
