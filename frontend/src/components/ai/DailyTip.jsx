import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import aiService from '../../services/aiService';

const STATIC_TIPS = [
  {
    tip: 'Monitor your blood sugar regularly — consistency is key to managing diabetes effectively.',
    category: 'Monitoring',
    icon: <MonitorHeartIcon />,
    gradient: 'linear-gradient(135deg, #6366f115 0%, #818cf815 100%)',
    iconColor: '#6366f1',
    border: '#6366f130',
  },
  {
    tip: 'Stay well hydrated — aim for 8 glasses of water daily. Dehydration can spike blood sugar levels.',
    category: 'Hydration',
    icon: <WaterDropIcon />,
    gradient: 'linear-gradient(135deg, #06b6d415 0%, #0891b215 100%)',
    iconColor: '#06b6d4',
    border: '#06b6d430',
  },
  {
    tip: 'Include 30 minutes of moderate exercise daily. Walking after meals helps reduce post-meal glucose spikes.',
    category: 'Exercise',
    icon: <DirectionsRunIcon />,
    gradient: 'linear-gradient(135deg, #22c55e15 0%, #16a34a15 100%)',
    iconColor: '#22c55e',
    border: '#22c55e30',
  },
  {
    tip: 'Choose low-glycemic foods like whole grains, legumes, and non-starchy vegetables to maintain steady blood sugar.',
    category: 'Nutrition',
    icon: <LocalDiningIcon />,
    gradient: 'linear-gradient(135deg, #f59e0b15 0%, #d9770615 100%)',
    iconColor: '#f59e0b',
    border: '#f59e0b30',
  },
  {
    tip: 'Aim for 7–9 hours of quality sleep. Poor sleep increases cortisol, which raises blood sugar levels.',
    category: 'Sleep',
    icon: <NightsStayIcon />,
    gradient: 'linear-gradient(135deg, #8b5cf615 0%, #7c3aed15 100%)',
    iconColor: '#8b5cf6',
    border: '#8b5cf630',
  },
  {
    tip: 'Manage stress through mindfulness or deep breathing. Chronic stress significantly worsens insulin resistance.',
    category: 'Wellness',
    icon: <FavoriteIcon />,
    gradient: 'linear-gradient(135deg, #ef444415 0%, #dc262615 100%)',
    iconColor: '#ef4444',
    border: '#ef444430',
  },
];

const DailyTip = () => {
  const theme = useTheme();
  const [aiTip, setAiTip] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    aiService
      .getDailyTip()
      .then((data) => setAiTip(data.tip))
      .catch(() => {});

    // Auto-rotate tips
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % STATIC_TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allTips = aiTip
    ? [
        {
          tip: aiTip,
          category: 'AI Tip',
          icon: <LightbulbIcon />,
          gradient: 'linear-gradient(135deg, #22c55e20 0%, #16a34a10 100%)',
          iconColor: '#22c55e',
          border: '#22c55e40',
        },
        ...STATIC_TIPS,
      ]
    : STATIC_TIPS;

  const current = allTips[activeIdx % allTips.length];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          pt: 2,
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon sx={{ fontSize: 20, color: '#f59e0b' }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Daily Health Tips
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={() =>
              setActiveIdx((prev) => (prev - 1 + allTips.length) % allTips.length)
            }
            sx={{ p: 0.5 }}
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 36, textAlign: 'center' }}>
            {(activeIdx % allTips.length) + 1}/{allTips.length}
          </Typography>
          <IconButton
            size="small"
            onClick={() =>
              setActiveIdx((prev) => (prev + 1) % allTips.length)
            }
            sx={{ p: 0.5 }}
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Active Tip */}
      <Box
        key={activeIdx}
        sx={{
          px: 2.5,
          py: 2,
          background: current.gradient,
          borderBottom: '1px solid',
          borderColor: current.border,
          minHeight: 110,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: current.iconColor, display: 'flex', alignItems: 'center' }}>
            {current.icon}
          </Box>
          <Chip
            label={current.category}
            size="small"
            sx={{
              bgcolor: current.iconColor + '20',
              color: current.iconColor,
              fontWeight: 700,
              fontSize: 11,
              height: 22,
              border: `1px solid ${current.iconColor}30`,
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontStyle: 'italic',
            lineHeight: 1.6,
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          "{current.tip}"
        </Typography>
      </Box>

      {/* Mini tip dots scroll indicator */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          gap: 0.5,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {allTips.map((t, i) => (
          <Box
            key={i}
            onClick={() => setActiveIdx(i)}
            sx={{
              width: i === activeIdx % allTips.length ? 20 : 8,
              height: 8,
              borderRadius: 4,
              bgcolor:
                i === activeIdx % allTips.length
                  ? allTips[i].iconColor
                  : 'divider',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flexShrink: 0,
            }}
          />
        ))}
      </Box>

      {/* Quick Tips Grid */}
      <Box sx={{ px: 2.5, pb: 2 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
          MORE TIPS
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {allTips
            .filter((_, i) => i !== activeIdx % allTips.length)
            .slice(0, 4)
            .map((t, i) => (
              <Chip
                key={i}
                icon={<Box sx={{ color: t.iconColor + ' !important', display: 'flex', '& svg': { fontSize: '14px !important' } }}>{t.icon}</Box>}
                label={t.category}
                size="small"
                onClick={() => {
                  const idx = allTips.findIndex((tip) => tip.category === t.category);
                  setActiveIdx(idx >= 0 ? idx : 0);
                }}
                sx={{
                  bgcolor: t.iconColor + '12',
                  color: 'text.secondary',
                  fontSize: 11,
                  height: 24,
                  border: `1px solid ${t.iconColor}20`,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: t.iconColor + '22' },
                }}
              />
            ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default DailyTip;