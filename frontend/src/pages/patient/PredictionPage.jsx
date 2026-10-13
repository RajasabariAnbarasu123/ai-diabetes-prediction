import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PredictionForm from '../../components/forms/PredictionForm';
import PredictionResult from '../../components/prediction/PredictionResult';
import MedicalReportUpload from '../../components/forms/MedicalReportUpload';
import { clearCurrentPrediction } from '../../store/slices/predictionSlice';

const PredictionPage = () => {
  const [reportOpen, setReportOpen] = useState(false);
  const [reportData, setReportData] = useState(null);
  const dispatch = useDispatch();
  const { currentPrediction, loading } = useSelector((state) => state.prediction);

  const resultOpen = !!currentPrediction || loading;

  const handleCloseResult = () => {
    dispatch(clearCurrentPrediction());
  };

  const handleAutoFill = (extractedData, shouldSubmit) => {
    setReportData({ data: extractedData, autoSubmit: shouldSubmit, timestamp: Date.now() });
    setReportOpen(false);
  };

  return (
    <Box>
      {/* ── Page Header ── */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}
            sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Diabetes Risk Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Fill in your health data for an AI-powered diabetes risk assessment.
          </Typography>
        </Box>

        {/* Upload Report button */}
        <Button
          variant="outlined"
          startIcon={<UploadFileOutlinedIcon />}
          onClick={() => setReportOpen(true)}
          sx={{
            borderRadius: 2.5, textTransform: 'none', fontWeight: 700,
            px: 2.5, py: 1, borderWidth: 1.5,
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { borderWidth: 1.5, bgcolor: 'primary.main' + '08', transform: 'translateY(-1px)' },
            whiteSpace: 'nowrap', alignSelf: 'center',
            transition: 'all 0.2s ease',
          }}
        >
          Upload Medical Report
        </Button>
      </Box>

      {/* ── Prediction Form ── */}
      <PredictionForm reportData={reportData} />

      {/* ── AI Prediction Result Modal ── */}
      <Dialog
        open={resultOpen}
        onClose={handleCloseResult}
        maxWidth="lg"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle
          component="div"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 1,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              AI Prediction Result
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your personalised diabetes risk assessment
            </Typography>
          </Box>
          <IconButton onClick={handleCloseResult} size="small" aria-label="close prediction result">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          <PredictionResult />
        </DialogContent>
      </Dialog>

      {/* ── Report Upload Dialog ── */}
      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Upload Medical Report (PDF)</Typography>
            <Typography variant="body2" color="text.secondary">
              Upload a medical report for AI-powered analysis & automatic form fill
            </Typography>
          </Box>
          <IconButton onClick={() => setReportOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <MedicalReportUpload onAutoFill={handleAutoFill} onClose={() => setReportOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PredictionPage;