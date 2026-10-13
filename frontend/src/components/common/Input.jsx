import { TextField } from '@mui/material';

const Input = ({ label, name, register, errors, type = 'text', ...props }) => {
  const error = errors?.[name];
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      error={!!error}
      helperText={error?.message}
      {...register?.(name)}
      {...props}
      sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
    />
  );
};

export default Input;