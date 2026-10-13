import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import Button from '../common/Button';
import profileSchema from '../../validators/profileSchema';
import { updateProfile, fetchProfile } from '../../store/slices/authSlice';
import { showToast } from '../common/Toast';

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      height: '',
      weight: '',
      emergencyContact: '',
      dob: '',
      gender: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        height: user.height || '',
        weight: user.weight || '',
        emergencyContact: user.emergencyContact || '',
        dob: user.dob || '',
        gender: user.gender || '',
      });
    }
  }, [user, reset]);

  const onSubmit = (data) => {
    // email is not editable via profile update, strip it
    const { email, ...rest } = data;
    // Convert empty/NaN numeric fields to null so backend validation passes
    const payload = {
      ...rest,
      height: rest.height !== '' && !isNaN(rest.height) ? Number(rest.height) : null,
      weight: rest.weight !== '' && !isNaN(rest.weight) ? Number(rest.weight) : null,
      dob: rest.dob && rest.dob !== '' ? rest.dob : null,
      gender: rest.gender && rest.gender !== '' ? rest.gender : null,
    };
    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => {
        showToast.success('Profile updated successfully!');
        // Re-fetch from DB to ensure UI reflects the saved state
        dispatch(fetchProfile());
      })
      .catch((err) => {
        showToast.error(err || 'Failed to update profile.');
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </Grid>

        {/* Email (display only, not sent) */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            {...register('email')}
            disabled
            helperText="Email cannot be changed"
          />
        </Grid>

        {/* DOB */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            {...register('dob')}
            InputLabelProps={{ shrink: true }}
            error={!!errors.dob}
            helperText={errors.dob?.message}
          />
        </Grid>

        {/* Gender — Controller ensures the saved value is pre-selected */}
        <Grid item xs={12} sm={4}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Gender"
                error={!!errors.gender}
                helperText={errors.gender?.message}
                value={field.value || ''}
              >
                <MenuItem value="">Select gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Phone" {...register('phone')} />
        </Grid>

        {/* Height */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Height (cm)"
            type="number"
            {...register('height', { valueAsNumber: true })}
            error={!!errors.height}
            helperText={errors.height?.message}
          />
        </Grid>

        {/* Weight */}
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Weight (kg)"
            type="number"
            {...register('weight', { valueAsNumber: true })}
            error={!!errors.weight}
            helperText={errors.weight?.message}
          />
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} sm={4}>
          <TextField fullWidth label="Emergency Contact" {...register('emergencyContact')} />
        </Grid>

        {/* Address */}
        <Grid item xs={12}>
          <TextField fullWidth label="Address" multiline rows={2} {...register('address')} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="submit"
          loading={loading}
          disabled={!isDirty}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileForm;