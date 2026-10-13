import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Alert,
  IconButton,
  Avatar,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { motion, AnimatePresence } from 'framer-motion';

const METRIC_META = {
  hba1c:             { label: 'HbA1c', unit: '%',    lowerIsBetter: true  },
  fastingBloodSugar: { label: 'Fasting Blood Sugar', unit: ' mg/dL', lowerIsBetter: true  },
  randomBloodSugar:  { label: 'Random Blood Sugar',  unit: ' mg/dL', lowerIsBetter: true  },
  bmi:               { label: 'BMI',   unit: '',    lowerIsBetter: true  },
  cholesterol:       { label: 'Cholesterol', unit: ' mg/dL', lowerIsBetter: true  },
  hdl:               { label: 'HDL',   unit: ' mg/dL', lowerIsBetter: false },
  ldl:               { label: 'LDL',   unit: ' mg/dL', lowerIsBetter: true  },
  triglycerides:     { label: 'Triglycerides', unit: ' mg/dL', lowerIsBetter: true  },
};

const RISK_COLORS = {
  LOW:      '#22c55e',
  MODERATE: '#f59e0b',
  HIGH:     '#ef4444',
};

const fmt = (v) => {
  if (v === null || v === undefined) return '—';
  if (typeof v === 'number') return Number.isInteger(v) ? v : parseFloat(v.toFixed(2));
  return v;
};

const DeltaChip = ({ diff, lowerIsBetter }) => {
  if (diff === 0 || diff === undefined) return <TrendingFlatIcon sx={{ color: '#94a3b8', fontSize: 18 }} />;
  const improved = lowerIsBetter ? diff < 0 : diff > 0;
  const Icon = diff > 0 ? TrendingUpIcon : TrendingDownIcon;
  const color = improved ? '#22c55e' : '#ef4444';
  const sign = diff > 0 ? '+' : '';
  return (
    <Chip
      icon={<Icon sx={{ fontSize: 14, color }} />}
      label={`${sign}${parseFloat(diff.toFixed(2))}`}
      size="small"
      sx={{ bgcolor: color + '18', color, fontWeight: 700, fontSize: 11, height: 22 }}
    />
  );
};

const MetricRow = ({ metaKey, label, unit, lowerIsBetter, val1, val2, diff }) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr auto',
      alignItems: 'center',
      gap: 1,
      py: 1,
      px: 1.5,
      borderRadius: 2,
      '&:hover': { bgcolor: 'action.hover' },
    }}
  >
    <Typography variant="body2" fontWeight={600} color="text.secondary">{label}</Typography>
    <Typography variant="body2" fontWeight={700} textAlign="center">
      {fmt(val1)}{val1 !== '—' ? unit : ''}
    </Typography>
    <Typography variant="body2" fontWeight={700} textAlign="center">
      {fmt(val2)}{val2 !== '—' ? unit : ''}
    </Typography>
    <Box sx={{ textAlign: 'right', minWidth: 70 }}>
      {diff !== undefined ? (
        <DeltaChip diff={diff} lowerIsBetter={lowerIsBetter} />
      ) : '—'}
    </Box>
  </Box>
);

const PredictionCard = ({ label, data, index }) => {
  if (!data) return null;
  const date = data.date ? new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  const risk = data.values?.diabetesRisk || 'N/A';
  const stage = data.values?.diabetesStage?.replace(/_/g, ' ') || 'N/A';
  const confidence = data.values?.confidenceScore;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '2px solid',
        borderColor: index === 0 ? 'primary.main' : 'secondary.main',
        background: index === 0
          ? 'linear-gradient(135deg, rgba(25,118,210,0.06) 0%, transparent 100%)'
          : 'linear-gradient(135deg, rgba(233,30,99,0.06) 0%, transparent 100%)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Avatar sx={{ width: 28, height: 28, bgcolor: index === 0 ? 'primary.main' : 'secondary.main', fontSize: 13, fontWeight: 700 }}>
          {index === 0 ? 'A' : 'B'}
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>{label}</Typography>
          <Typography variant="body2" fontWeight={700}>{date}</Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Chip
            label={risk}
            size="small"
            sx={{
              bgcolor: (RISK_COLORS[risk] || '#94a3b8') + '20',
              color: RISK_COLORS[risk] || '#94a3b8',
              fontWeight: 700,
              fontSize: 11,
            }}
          />
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary">
        {stage}
        {confidence ? ` • ${(confidence <= 1 ? confidence * 100 : confidence).toFixed(0)}% confidence` : ''}
      </Typography>
    </Paper>
  );
};

const ComparisonModal = ({ open, onClose, comparison, loading }) => {
  const prev = comparison?.previous;
  const curr = comparison?.current;
  const diffs = comparison?.differences || {};
  const explanation = comparison?.explanation;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, maxHeight: '90vh' },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }} component="div">
        <CompareArrowsIcon color="primary" />
        <Typography variant="h6" component="span" fontWeight={700} sx={{ flexGrow: 1 }}>
          Prediction Comparison
        </Typography>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2.5 }}>
        <AnimatePresence mode="wait">
          {loading ? (
            <Box
              key="loading"
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}
            >
              <CircularProgress size={48} />
              <Typography variant="body2" color="text.secondary">Analyzing predictions with AI...</Typography>
            </Box>
          ) : comparison ? (
            <Box
              key="results"
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Prediction cards */}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={6}>
                  <PredictionCard label="Earlier Prediction" data={prev} index={0} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <PredictionCard label="Later Prediction" data={curr} index={1} />
                </Grid>
              </Grid>

              {/* Metric table */}
              <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', mb: 3 }}>
                {/* Header row */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr auto',
                    gap: 1,
                    py: 1,
                    px: 1.5,
                    bgcolor: 'action.hover',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase">Metric</Typography>
                  <Typography variant="caption" fontWeight={700} color="primary.main" textAlign="center" textTransform="uppercase">Prediction A</Typography>
                  <Typography variant="caption" fontWeight={700} color="secondary.main" textAlign="center" textTransform="uppercase">Prediction B</Typography>
                  <Typography variant="caption" fontWeight={700} color="text.secondary" textAlign="right" textTransform="uppercase" sx={{ minWidth: 70 }}>Change</Typography>
                </Box>

                {Object.entries(METRIC_META).map(([key, meta], i) => (
                  <React.Fragment key={key}>
                    {i > 0 && <Divider />}
                    <MetricRow
                      metaKey={key}
                      label={meta.label}
                      unit={meta.unit}
                      lowerIsBetter={meta.lowerIsBetter}
                      val1={prev?.values?.[key] ?? '—'}
                      val2={curr?.values?.[key] ?? '—'}
                      diff={diffs[key]}
                    />
                  </React.Fragment>
                ))}

                {/* Risk & Stage rows */}
                <Divider />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center', gap: 1, py: 1, px: 1.5 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">Risk Level</Typography>
                  <Chip label={prev?.values?.diabetesRisk || '—'} size="small" sx={{ bgcolor: (RISK_COLORS[prev?.values?.diabetesRisk] || '#94a3b8') + '20', color: RISK_COLORS[prev?.values?.diabetesRisk] || '#94a3b8', fontWeight: 700, fontSize: 11, mx: 'auto' }} />
                  <Chip label={curr?.values?.diabetesRisk || '—'} size="small" sx={{ bgcolor: (RISK_COLORS[curr?.values?.diabetesRisk] || '#94a3b8') + '20', color: RISK_COLORS[curr?.values?.diabetesRisk] || '#94a3b8', fontWeight: 700, fontSize: 11, mx: 'auto' }} />
                  <Box />
                </Box>
              </Paper>

              {/* AI Explanation */}
              {explanation && (
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 100%)',
                    border: '1px solid',
                    borderColor: 'rgba(99,102,241,0.2)',
                  }}
                >
                  <Avatar sx={{ bgcolor: 'rgba(99,102,241,0.15)', width: 34, height: 34, flexShrink: 0 }}>
                    <SmartToyIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" fontWeight={700} color="#6366f1" display="block" mb={0.5}>
                      AI Clinical Analysis
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {explanation}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ) : null}
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Typography variant="caption" color="text.disabled" sx={{ flexGrow: 1 }}>
          Green = improvement &nbsp;·&nbsp; Red = worsening &nbsp;·&nbsp; Arrows show direction of change
        </Typography>
      </DialogActions>
    </Dialog>
  );
};

export default ComparisonModal;
