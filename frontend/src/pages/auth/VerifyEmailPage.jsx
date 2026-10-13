import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Alert } from '@mui/material';
import authService from '../../services/authService';
import Button from '../../components/common/Button';
import { showToast } from '../../components/common/Toast';

const processedTokens = new Set();

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    if (processedTokens.has(token)) {
      setStatus('success');
      return;
    }
    processedTokens.add(token);

    authService.verifyEmail(token)
      .then(() => {
        setStatus('success');
        showToast.success('Email verified successfully!');
      })
      .catch((err) => {
        processedTokens.delete(token);
        setStatus('error');
        showToast.error(err.response?.data?.message || 'Email verification failed or token expired.');
      });
  }, [token]);

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {status === 'loading' && <Typography>Verifying your email...</Typography>}
      {status === 'success' && (
        <>
          <Alert severity="success" sx={{ mb: 2 }}>Email verified successfully!</Alert>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </>
      )}
      {status === 'error' && (
        <Alert severity="error">Invalid or expired verification token.</Alert>
      )}
    </Box>
  );
};

export default VerifyEmailPage;