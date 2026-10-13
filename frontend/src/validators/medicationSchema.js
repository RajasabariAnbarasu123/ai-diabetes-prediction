import { z } from 'zod';

const medicationSchema = z.object({
  medicineName: z.string().min(1, 'Medicine name is required'),
  dose: z.string().min(1, 'Dose is required'),
  morning: z.boolean(),
  afternoon: z.boolean(),
  night: z.boolean(),
  morningTime: z.string().optional(),
  afternoonTime: z.string().optional(),
  nightTime: z.string().optional(),
  appNotification: z.boolean().optional(),
  emailNotification: z.boolean().optional(),
  notes: z.string().optional(),
});

export default medicationSchema;