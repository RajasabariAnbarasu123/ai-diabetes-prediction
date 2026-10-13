import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link as RouterLink } from 'react-router-dom';
import {
  TextField, Box, Typography, Alert, Link,
  Button, CircularProgress, InputAdornment,
} from '@mui/material';
import { EmailOutlined, ArrowForwardRounded, ArrowBackRounded } from '@mui/icons-material';
import { motion } from 'framer-motion';
import authService from '../../services/authService';
import { showToast } from '../../components/common/Toast';

const schema = z.object({ email: z.string().email('Invalid email address') });

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true); setError(''); setMessage('');
    try {
      await authService.forgotPassword(data.email);
      const msg = 'Password reset link has been sent to your email!';
      setMessage(msg); showToast.success(msg);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg); showToast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom
          sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Reset password
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter your email and we'll send you a reset link
        </Typography>
      </Box>

      {message && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2 }}>{message}</Alert>
        </motion.div>
      )}
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>{error}</Alert>
        </motion.div>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth label="Email address" type="email"
          {...register('email')}
          error={!!errors.email} helperText={errors.email?.message}
          InputProps={{
            startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment>,
          }}
        />
        <Button
          type="submit" fullWidth variant="contained"
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRounded />}
          sx={{
            py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2.5,
            background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
            '&:hover': { background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', boxShadow: '0 8px 25px rgba(99,102,241,0.5)' },
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <Box sx={{ textAlign: 'center' }}>
          <Link component={RouterLink} to="/login" variant="body2" fontWeight={600}
            sx={{ color: 'primary.main', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 0.5, '&:hover': { textDecoration: 'underline' } }}
          >
            <ArrowBackRounded fontSize="small" /> Back to Sign In
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;