import { useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Divider,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import {
  People as FamilyIcon,
  SmokingRooms as SmokingIcon,
  LocalBar as AlcoholIcon,
  WaterDrop as UrinationIcon,
  Opacity as ThirstIcon,
  TrendingDown as WeightLossIcon,
  VisibilityOff as VisionIcon,
  BatteryAlert as FatigueIcon,
  Healing as WoundIcon,
  Waves as TinglingIcon,
  Restaurant as HungerIcon,
  Person as PersonIcon,
  Cake as CakeIcon,
  Wc as WcIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import Button from '../common/Button';
import { showToast } from '../common/Toast';
import usePredictionForm from '../../hooks/usePredictionForm';

// Sleek selectable toggle card
const SelectableCard = ({ label, icon, selected, onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        border: '2px solid',
        borderColor: selected ? 'primary.main' : 'divider',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        bgcolor: selected ? 'primary.main' + '08' : 'background.paper',
        transition: 'all 0.2s ease',
        height: '100%',
        '&:hover': {
          borderColor: selected ? 'primary.main' : 'text.secondary',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Box sx={{ color: selected ? 'primary.main' : 'text.secondary', mb: 1, display: 'flex', alignItems: 'center' }}>
        {icon}
      </Box>
      <Typography variant="body2" fontWeight={selected ? 600 : 500} color={selected ? 'primary.main' : 'text.primary'}>
        {label}
      </Typography>
    </Box>
  );
};

const PredictionForm = ({ initialData, reportData }) => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    loading,
    user,
  } = usePredictionForm();

  const processedReportRef = useRef(null);

  // Auto-fill from uploaded report data when received
  useEffect(() => {
    if (reportData?.data && reportData?.timestamp !== processedReportRef.current) {
      processedReportRef.current = reportData.timestamp;
      const data = reportData.data;

      const setValidNum = (field, val) => {
        if (val !== null && val !== undefined && val !== '') {
          const num = Number(val);
          if (!isNaN(num)) {
            setValue(field, num);
          }
        }
      };

      setValidNum('hba1c', data.hba1c);
      setValidNum('fastingBloodSugar', data.fastingBloodSugar ?? data.bloodSugar);
      setValidNum('randomBloodSugar', data.randomBloodSugar);
      setValidNum('cholesterol', data.cholesterol);
      setValidNum('hdl', data.hdl);
      setValidNum('ldl', data.ldl);
      setValidNum('triglycerides', data.triglycerides);
      setValidNum('bmi', data.bmi);
      setValidNum('weight', data.weight);

      if (data.bloodPressure && typeof data.bloodPressure === 'string') {
        setValue('bloodPressure', data.bloodPressure);
      }
      if (data.medications && typeof data.medications === 'string') {
        setValue('currentMedications', data.medications);
      }

      showToast.success('Form auto-filled with AI-extracted medical report metrics!');

      if (reportData.autoSubmit) {
        setTimeout(() => {
          handleSubmit();
        }, 300);
      }
    }
  }, [reportData, setValue, handleSubmit]);

  // Calculate age from dob
  const getAge = (dob) => {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const age = getAge(user?.dob) ?? user?.age ?? '--';

  const bmi = watch('bmi');

  // Watch risk factors and symptoms to re-render custom toggles
  const familyHistory = watch('familyHistory');
  const smoking = watch('smoking');
  const alcohol = watch('alcohol');

  const frequentUrination = watch('frequentUrination');
  const increasedThirst = watch('increasedThirst');
  const weightLoss = watch('weightLoss');
  const blurredVision = watch('blurredVision');
  const fatigue = watch('fatigue');
  const slowWoundHealing = watch('slowWoundHealing');
  const tinglingSensation = watch('tinglingSensation');
  const increasedHunger = watch('increasedHunger');

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {/* Personal Information */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>Personal Information</Typography>

        {/* Read-only demographic info from profile */}
        <Box sx={{ mb: 3, p: 2, borderRadius: 2, bgcolor: 'action.hover', border: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
            <LockIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              Auto-filled from your profile (cannot be changed here)
            </Typography>
          </Stack>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Chip
              icon={<PersonIcon />}
              label={`Name: ${user?.name || '--'}`}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
            <Chip
              icon={<CakeIcon />}
              label={`Age: ${age}`}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
            <Chip
              icon={<WcIcon />}
              label={`Gender: ${user?.gender || '--'}`}
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              {...register('height', { valueAsNumber: true })}
              error={!!errors.height}
              helperText={errors.height?.message || 'Auto-filled · can be updated'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              {...register('weight', { valueAsNumber: true })}
              error={!!errors.weight}
              helperText={errors.weight?.message || 'Auto-filled · can be updated'}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="BMI (Auto)"
              value={bmi || ''}
              InputProps={{ readOnly: true }}
              helperText="Calculated automatically"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Medical Details */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>Medical Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Fasting Blood Sugar (mg/dL)" type="number" {...register('fastingBloodSugar', { valueAsNumber: true })} error={!!errors.fastingBloodSugar} helperText={errors.fastingBloodSugar?.message} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Random Blood Sugar (mg/dL)" type="number" {...register('randomBloodSugar', { valueAsNumber: true })} error={!!errors.randomBloodSugar} helperText={errors.randomBloodSugar?.message} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="HbA1c (%)" type="number" {...register('hba1c', { valueAsNumber: true })} error={!!errors.hba1c} helperText={errors.hba1c?.message} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Blood Pressure (e.g., 120/80)" {...register('bloodPressure')} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Cholesterol (mg/dL)" type="number" {...register('cholesterol', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="HDL (mg/dL)" type="number" {...register('hdl', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="LDL (mg/dL)" type="number" {...register('ldl', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Triglycerides (mg/dL)" type="number" {...register('triglycerides', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Physical Activity</InputLabel>
              <Select {...register('physicalActivity')} label="Physical Activity" defaultValue="None">
                <MenuItem value="None">None</MenuItem>
                <MenuItem value="Light">Light</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Daily Water Intake (L)" type="number" {...register('dailyWaterIntake', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Sleep Hours" type="number" {...register('sleepHours', { valueAsNumber: true })} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Diet Type</InputLabel>
              <Select {...register('dietType')} label="Diet Type" defaultValue="VEGETARIAN">
                <MenuItem value="VEGETARIAN">Vegetarian</MenuItem>
                <MenuItem value="NON_VEGETARIAN">Non-Vegetarian</MenuItem>
                <MenuItem value="VEGAN">Vegan</MenuItem>
                <MenuItem value="JAIN">Jain</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Stress Level</InputLabel>
              <Select {...register('stressLevel')} label="Stress Level" defaultValue="Low">
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Moderate">Moderate</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Existing Diseases" multiline rows={2} {...register('existingDiseases')} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Current Medications" multiline rows={2} {...register('currentMedications')} />
          </Grid>
        </Grid>
      </Paper>

      {/* Improved Risk Factors selection */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>Risk Factors</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <SelectableCard
              label="Family History"
              icon={<FamilyIcon fontSize="large" />}
              selected={!!familyHistory}
              onClick={() => setValue('familyHistory', !familyHistory)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectableCard
              label="Smoking"
              icon={<SmokingIcon fontSize="large" />}
              selected={!!smoking}
              onClick={() => setValue('smoking', !smoking)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SelectableCard
              label="Alcohol"
              icon={<AlcoholIcon fontSize="large" />}
              selected={!!alcohol}
              onClick={() => setValue('alcohol', !alcohol)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Improved Symptoms selection */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, backgroundColor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>Symptoms</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Frequent Urination"
              icon={<UrinationIcon />}
              selected={!!frequentUrination}
              onClick={() => setValue('frequentUrination', !frequentUrination)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Increased Thirst"
              icon={<ThirstIcon />}
              selected={!!increasedThirst}
              onClick={() => setValue('increasedThirst', !increasedThirst)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Weight Loss"
              icon={<WeightLossIcon />}
              selected={!!weightLoss}
              onClick={() => setValue('weightLoss', !weightLoss)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Blurred Vision"
              icon={<VisionIcon />}
              selected={!!blurredVision}
              onClick={() => setValue('blurredVision', !blurredVision)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Fatigue"
              icon={<FatigueIcon />}
              selected={!!fatigue}
              onClick={() => setValue('fatigue', !fatigue)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Slow Wound Healing"
              icon={<WoundIcon />}
              selected={!!slowWoundHealing}
              onClick={() => setValue('slowWoundHealing', !slowWoundHealing)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Tingling Sensation"
              icon={<TinglingIcon />}
              selected={!!tinglingSensation}
              onClick={() => setValue('tinglingSensation', !tinglingSensation)}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <SelectableCard
              label="Increased Hunger"
              icon={<HungerIcon />}
              selected={!!increasedHunger}
              onClick={() => setValue('increasedHunger', !increasedHunger)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" type="reset">Reset</Button>
        <Button type="submit" loading={loading}>Predict Diabetes Risk</Button>
      </Box>
    </Box>
  );
};

export default PredictionForm;