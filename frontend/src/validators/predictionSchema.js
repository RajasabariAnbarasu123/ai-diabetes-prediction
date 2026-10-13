import { z } from 'zod';

const predictionSchema = z.object({
  // Personal Information
  name: z.string().optional(),
  age: z.number().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  height: z.number().min(50, 'Height too low').max(250, 'Height too high'),
  weight: z.number().min(20, 'Weight too low').max(300),
  bmi: z.number().optional(), // auto calculated

  // Medical Details
  fastingBloodSugar: z.number().min(0),
  randomBloodSugar: z.number().min(0),
  hba1c: z.number().min(0, 'HbA1c cannot be negative').max(20),
  bloodPressure: z.string().optional(),
  cholesterol: z.number().min(0).optional(),
  hdl: z.number().min(0).optional(),
  ldl: z.number().min(0).optional(),
  triglycerides: z.number().min(0).optional(),

  familyHistory: z.boolean(),
  smoking: z.boolean(),
  alcohol: z.boolean(),
  physicalActivity: z.enum(['None', 'Light', 'Moderate', 'Active']),
  dailyWaterIntake: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  dietType: z.enum(['VEGETARIAN', 'NON_VEGETARIAN', 'VEGAN', 'JAIN']),
  stressLevel: z.enum(['Low', 'Moderate', 'High']),
  existingDiseases: z.string().optional(),
  currentMedications: z.string().optional(),

  // Symptoms (booleans)
  frequentUrination: z.boolean(),
  increasedThirst: z.boolean(),
  weightLoss: z.boolean(),
  blurredVision: z.boolean(),
  fatigue: z.boolean(),
  slowWoundHealing: z.boolean(),
  tinglingSensation: z.boolean(),
  increasedHunger: z.boolean(),
});

export default predictionSchema;