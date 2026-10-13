import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EmailIcon from '@mui/icons-material/Email';
import Button from '../common/Button';
import medicationSchema from '../../validators/medicationSchema';

const MedicationForm = ({ onSubmit, initialData, loading }) => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(medicationSchema),
    defaultValues: initialData || {
      medicineName: '',
      dose: '',
      morning: true,
      afternoon: false,
      night: true,
      morningTime: '08:00',
      afternoonTime: '13:00',
      nightTime: '20:00',
      appNotification: true,
      emailNotification: true,
      notes: '',
    },
  });

  const isMorning = watch('morning');
  const isAfternoon = watch('afternoon');
  const isNight = watch('night');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ pt: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Medicine Name"
            placeholder="e.g. Metformin / Insulin"
            {...register('medicineName')}
            error={!!errors.medicineName}
            helperText={errors.medicineName?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Dose"
            placeholder="e.g. 500 mg / 10 units"
            {...register('dose')}
            error={!!errors.dose}
            helperText={errors.dose?.message}
          />
        </Grid>

        {/* Section 1: Reminder Schedule & Times */}
        <Grid item xs={12} mt={1}>
          <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
            ⏰ Daily Schedule & Reminder Times
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Select dose slots and configure exact alert times.
          </Typography>
        </Grid>

        {/* Morning Slot */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: isMorning ? '#f59e0b08' : 'transparent' }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6} sm={4}>
                <Controller
                  name="morning"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={field.onChange} color="warning" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <WbSunnyIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                          <Typography variant="body2" fontWeight={600}>Morning</Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={8}>
                {isMorning && (
                  <TextField
                    type="time"
                    size="small"
                    label="Reminder Time"
                    InputLabelProps={{ shrink: true }}
                    {...register('morningTime')}
                    sx={{ width: 160 }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Afternoon Slot */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: isAfternoon ? '#06b6d408' : 'transparent' }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6} sm={4}>
                <Controller
                  name="afternoon"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={field.onChange} color="info" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LunchDiningIcon sx={{ fontSize: 18, color: '#06b6d4' }} />
                          <Typography variant="body2" fontWeight={600}>Afternoon</Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={8}>
                {isAfternoon && (
                  <TextField
                    type="time"
                    size="small"
                    label="Reminder Time"
                    InputLabelProps={{ shrink: true }}
                    {...register('afternoonTime')}
                    sx={{ width: 160 }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Night Slot */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: isNight ? '#8b5cf608' : 'transparent' }}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={6} sm={4}>
                <Controller
                  name="night"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} onChange={field.onChange} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#8b5cf6' } }} />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <NightsStayIcon sx={{ fontSize: 18, color: '#8b5cf6' }} />
                          <Typography variant="body2" fontWeight={600}>Night</Typography>
                        </Box>
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} sm={8}>
                {isNight && (
                  <TextField
                    type="time"
                    size="small"
                    label="Reminder Time"
                    InputLabelProps={{ shrink: true }}
                    {...register('nightTime')}
                    sx={{ width: 160 }}
                  />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Section 2: Alert Channels */}
        <Grid item xs={12} mt={1}>
          <Typography variant="subtitle2" fontWeight={700} color="primary" gutterBottom>
            🔔 Alert Preferences
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Controller
              name="appNotification"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <NotificationsActiveIcon sx={{ fontSize: 18, color: '#6366f1' }} />
                      <Typography variant="body2">In-App Alert</Typography>
                    </Box>
                  }
                />
              )}
            />
            <Controller
              name="emailNotification"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onChange={field.onChange} color="primary" />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EmailIcon sx={{ fontSize: 18, color: '#22c55e' }} />
                      <Typography variant="body2">Email Alert</Typography>
                    </Box>
                  }
                />
              )}
            />
          </Box>
        </Grid>

        {/* Section 3: Doctor / Special Instructions */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Special Instructions / Doctor Notes"
            placeholder="e.g. Take after food with water"
            multiline
            rows={2}
            {...register('notes')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          type="submit"
          loading={loading}
          variant="contained"
          sx={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', px: 4 }}
        >
          Save Medication
        </Button>
      </Box>
    </Box>
  );
};

export default MedicationForm;