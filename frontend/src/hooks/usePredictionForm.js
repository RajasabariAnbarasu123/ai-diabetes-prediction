import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { createPrediction } from '../store/slices/predictionSlice';
import { fetchProfile } from '../store/slices/authSlice';
import predictionSchema from '../validators/predictionSchema';
import { showToast } from '../components/common/Toast';

const defaultValues = {
  height: '',
  weight: '',
  bmi: '',
  fastingBloodSugar: '',
  randomBloodSugar: '',
  hba1c: '',
  bloodPressure: '',
  cholesterol: '',
  hdl: '',
  ldl: '',
  triglycerides: '',
  familyHistory: false,
  smoking: false,
  alcohol: false,
  physicalActivity: 'None',
  dailyWaterIntake: '',
  sleepHours: '',
  dietType: 'VEGETARIAN',
  stressLevel: 'Low',
  existingDiseases: '',
  currentMedications: '',
  frequentUrination: false,
  increasedThirst: false,
  weightLoss: false,
  blurredVision: false,
  fatigue: false,
  slowWoundHealing: false,
  tinglingSensation: false,
  increasedHunger: false,
};

const usePredictionForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.prediction);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(predictionSchema),
    defaultValues,
  });

  // Auto-fill height and weight from user profile on mount
  useEffect(() => {
    if (user) {
      if (user.height) setValue('height', user.height);
      if (user.weight) setValue('weight', user.weight);
    }
  }, [user, setValue]);

  // Auto calculate BMI
  const height = watch('height');
  const weight = watch('weight');

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmiVal = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setValue('bmi', parseFloat(bmiVal) || '');
    }
  }, [height, weight, setValue]);

  const submit = (data) => {
    showToast.info('Creating risk prediction...');
    dispatch(createPrediction(data))
      .unwrap()
      .then(() => {
        showToast.success('Prediction completed successfully!');
        dispatch(fetchProfile());
      })
      .catch((err) => {
        showToast.error(err || 'Failed to create prediction.');
      });
  };

  return {
    register,
    handleSubmit: handleSubmit(submit),
    errors,
    setValue,
    watch,
    reset,
    loading,
    error,
    defaultValues,
    user,
  };
};

export default usePredictionForm;