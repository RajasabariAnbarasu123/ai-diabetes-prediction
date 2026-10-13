import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  TextField, Box, Typography, Link, InputAdornment,
  IconButton, Divider, useTheme, Button, CircularProgress, Alert,
} from '@mui/material';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import {
  Visibility, VisibilityOff, EmailOutlined, LockOutlined,
  ArrowForwardRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import loginSchema from '../../validators/loginSchema';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { login, loading, error, isAuthenticated, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState(location.state?.infoAlert || null);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      showToast.success('Welcome back! 👋');
      dispatch(fetchProfile());
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      if (error.toLowerCase().includes('email not verified')) {
        setInfoMessage('Email not verified! Please check your inbox and click the verification link before logging in.');
      } else {
        showToast.error(error);
      }
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = (data) => login(data);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom
          sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Welcome back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sign in to your account to continue
        </Typography>
      </Box>

      {infoMessage && (
        <Alert
          severity="info"
          icon={<MarkEmailReadOutlinedIcon />}
          onClose={() => setInfoMessage(null)}
          sx={{ mb: 3, borderRadius: 2.5, fontWeight: 500 }}
        >
          {infoMessage}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <TextField
            fullWidth
            label="Email address"
            type="email"
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            error={!!errors.password}
            helperText={errors.password?.message}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'text.secondary', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} onMouseDown={(e) => e.preventDefault()} edge="end" size="small">
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </motion.div>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link component={RouterLink} to="/forgot-password" variant="body2" fontWeight={600}
            sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Forgot password?
          </Link>
        </Box>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRounded />}
            sx={
              {
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 2.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 8px 25px rgba(99,102,241,0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </motion.div>

        <Divider sx={{ my: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>OR</Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register" fontWeight={700}
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Create account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;