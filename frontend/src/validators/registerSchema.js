import { z } from 'zod';

const registerSchema = z
  .object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    dob: z.string().min(1, 'Date of Birth is required').refine((val) => {
      const birthDate = new Date(val);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of Birth must be in the past'),
    gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default registerSchema;