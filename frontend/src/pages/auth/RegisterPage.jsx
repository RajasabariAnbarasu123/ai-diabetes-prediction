import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  TextField, Box, Typography, Link, FormControl, InputLabel,
  Select, MenuItem, Grid, InputAdornment, IconButton, Divider,
  Button, CircularProgress,
} from '@mui/material';
import {
  Visibility, VisibilityOff, PersonOutlined, EmailOutlined,
  LockOutlined, CalendarTodayOutlined, WcOutlined, ArrowForwardRounded,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import registerSchema from '../../validators/registerSchema';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../components/common/Toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, loading, error, successMessage, isAuthenticated, clearError, clearSuccessMessage } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', dob: '', gender: '' }
  });

  useEffect(() => { if (isAuthenticated) navigate('/dashboard'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (successMessage) {
      showToast.success(successMessage);
      clearSuccessMessage();
      navigate('/login', {
        state: { infoAlert: 'Account created successfully! Please check your inbox and verify your email address to log in.' }
      });
    }
  }, [successMessage, clearSuccessMessage, navigate]);

  useEffect(() => {
    if (error) { showToast.error(error); clearError(); }
  }, [error, clearError]);

  const onSubmit = (data) => {
    const { confirmPassword, ...payload } = data;
    registerUser(payload);
  };

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom
          sx={{ background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Create account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Join Diabetes CDSS for AI-powered health monitoring
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { label: 'Full Name', name: 'name', icon: <PersonOutlined sx={{ fontSize: 20, color: 'text.secondary' }} /> },
          { label: 'Email address', name: 'email', type: 'email', icon: <EmailOutlined sx={{ fontSize: 20, color: 'text.secondary' }} /> },
        ].map((field, i) => (
          <motion.div key={field.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <TextField
              fullWidth label={field.label} type={field.type || 'text'}
              {...register(field.name)}
              error={!!errors[field.name]} helperText={errors[field.name]?.message}
              InputProps={{ startAdornment: <InputAdornment position="start">{field.icon}</InputAdornment> }}
            />
          </motion.div>
        ))}

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth label="Date of Birth" type="date"
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayOutlined sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
              {...register('dob')}
              error={!!errors.dob} helperText={errors.dob?.message}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth error={!!errors.gender}>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select labelId="gender-label" label="Gender" defaultValue="" {...register('gender')}
                startAdornment={<InputAdornment position="start"><WcOutlined sx={{ fontSize: 18, color: 'text.secondary', ml: 0.5 }} /></InputAdornment>}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.gender && <Typography variant="caption" color="error" sx={{ mx: 1.5, mt: 0.5, display: 'block' }}>{errors.gender.message}</Typography>}
            </FormControl>
          </Grid>
        </Grid>

        {[
          { label: 'Password', name: 'password', show: showPassword, toggle: () => setShowPassword(!showPassword) },
          { label: 'Confirm Password', name: 'confirmPassword', show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) },
        ].map((field, i) => (
          <motion.div key={field.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}>
            <TextField
              fullWidth label={field.label} type={field.show ? 'text' : 'password'}
              {...register(field.name)}
              error={!!errors[field.name]} helperText={errors[field.name]?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined sx={{ fontSize: 20, color: 'text.secondary' }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={field.toggle} onMouseDown={(e) => e.preventDefault()} edge="end" size="small">
                      {field.show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Button
            type="submit" fullWidth variant="contained"
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardRounded />}
            sx={{
              py: 1.5, fontSize: '1rem', fontWeight: 700, borderRadius: 2.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                boxShadow: '0 8px 25px rgba(99,102,241,0.5)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </motion.div>

        <Divider sx={{ my: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>OR</Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" fontWeight={700}
              sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;