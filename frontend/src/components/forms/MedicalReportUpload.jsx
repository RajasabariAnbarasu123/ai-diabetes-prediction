import { useState } from 'react';
import { Box, Typography, Paper, LinearProgress, Chip } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '../common/Button';
import useFileUpload from '../../hooks/useFileUpload';
import { uploadReport } from '../../store/slices/reportSlice';
import { showToast } from '../common/Toast';

const MedicalReportUpload = ({ onAutoFill, onClose }) => {
  const dispatch = useDispatch();
  const { loading, currentUpload, error } = useSelector((state) => state.report);
  const [extractedPreview, setExtractedPreview] = useState(null);

  const handleFileSelected = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      showToast.info('Uploading and analyzing PDF report with AI...');
      const result = await dispatch(uploadReport(formData)).unwrap();
      setExtractedPreview(result.extractedData);
      showToast.success('Medical report analyzed successfully by AI!');
    } catch (err) {
      showToast.error(err || 'Failed to upload medical report.');
    }
  };

  const { file, preview, getRootProps, getInputProps, isDragActive, clearFile } = useFileUpload(handleFileSelected);

  const handleApply = (shouldSubmit = false) => {
    if (onAutoFill && extractedPreview) {
      onAutoFill(extractedPreview, shouldSubmit);
      if (onClose) onClose();
    }
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 5,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.400',
          borderRadius: 4,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          mb: 3,
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1.5 }} />
        <Typography variant="h6" fontWeight={700}>
          {isDragActive ? 'Drop PDF report here' : 'Drag & drop your medical report (PDF Document Only)'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Supports PDF files (.pdf) up to 10MB
        </Typography>
      </Paper>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}

      {file && !loading && (
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
          <Typography variant="body2" fontWeight={600}>
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </Typography>
          <Button variant="outlined" size="small" onClick={clearFile}>Remove</Button>
        </Box>
      )}

      {extractedPreview && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'success.main', bgcolor: '#22c55e0a' }}>
          <Typography variant="subtitle1" fontWeight={800} color="success.main" mb={1.5}>
            ✨ AI Extracted Medical Lab Metrics
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {extractedPreview.hba1c != null && <Chip label={`HbA1c: ${extractedPreview.hba1c}%`} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />}
            {(extractedPreview.fastingBloodSugar != null || extractedPreview.bloodSugar != null) && (
              <Chip label={`Fasting Sugar: ${extractedPreview.fastingBloodSugar ?? extractedPreview.bloodSugar} mg/dL`} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />
            )}
            {extractedPreview.randomBloodSugar != null && <Chip label={`Random Sugar: ${extractedPreview.randomBloodSugar} mg/dL`} color="primary" variant="outlined" sx={{ fontWeight: 700 }} />}
            {extractedPreview.cholesterol != null && <Chip label={`Cholesterol: ${extractedPreview.cholesterol} mg/dL`} color="warning" variant="outlined" sx={{ fontWeight: 700 }} />}
            {extractedPreview.hdl != null && <Chip label={`HDL: ${extractedPreview.hdl} mg/dL`} color="info" variant="outlined" sx={{ fontWeight: 700 }} />}
            {extractedPreview.ldl != null && <Chip label={`LDL: ${extractedPreview.ldl} mg/dL`} color="warning" variant="outlined" sx={{ fontWeight: 700 }} />}
            {extractedPreview.triglycerides != null && <Chip label={`Triglycerides: ${extractedPreview.triglycerides} mg/dL`} color="error" variant="outlined" sx={{ fontWeight: 700 }} />}
            {extractedPreview.bloodPressure && <Chip label={`BP: ${extractedPreview.bloodPressure}`} variant="outlined" sx={{ fontWeight: 700 }} />}
          </Box>

          {onAutoFill && (
            <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
              <Button variant="outlined" color="success" size="small" onClick={() => handleApply(false)}>
                Auto-Fill Form Only
              </Button>
              <Button variant="contained" color="success" size="small" onClick={() => handleApply(true)}>
                Auto-Fill & Run AI Prediction 🚀
              </Button>
            </Box>
          )}
        </Paper>
      )}

      {currentUpload?.aiSummary && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3, border: '1px solid #0284c730', bgcolor: '#0284c70a' }}>
          <Typography variant="subtitle2" fontWeight={800} color="#0284c7" mb={0.5}>AI Clinical Summary</Typography>
          <Typography variant="body2" color="text.primary" lineHeight={1.6}>{currentUpload.aiSummary}</Typography>
        </Paper>
      )}

      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default MedicalReportUpload;