import { Box, Chip } from '@mui/material';

const questions = [
  'Can I eat mango?',
  'How much walking should I do?',
  'What is a good HbA1c target?',
  'Foods to avoid with diabetes',
  'How to reduce stress?',
];

const SuggestedQuestions = ({ onSelect }) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
      {questions.map((q) => (
        <Chip key={q} label={q} onClick={() => onSelect(q)} clickable variant="outlined" size="small" />
      ))}
    </Box>
  );
};

export default SuggestedQuestions;