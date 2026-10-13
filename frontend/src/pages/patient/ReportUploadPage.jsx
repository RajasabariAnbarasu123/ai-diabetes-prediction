import { Box, Typography } from '@mui/material';
import MedicalReportUpload from '../../components/forms/MedicalReportUpload';

const ReportUploadPage = () => {
  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Upload Medical Report
      </Typography>
      <MedicalReportUpload />
    </Box>
  );
};

export default ReportUploadPage;