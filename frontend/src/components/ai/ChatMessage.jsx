import { Box, Typography, Paper, useTheme } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ChatMessage = ({ message }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const isUser = message.role === 'user';
  const isError = message.isError || (message.content && message.content.startsWith('AI Error'));

  const getBackgroundColor = () => {
    if (isError) return isDarkMode ? 'rgba(239, 68, 68, 0.2)' : '#fef2f2';
    if (isUser) return 'primary.main';
    return isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'grey.100';
  };

  const getTextColor = () => {
    if (isError) return isDarkMode ? '#fca5a5' : 'error.main';
    if (isUser) return 'primary.contrastText';
    return 'text.primary';
  };

  const getBorder = () => {
    if (isError) return isDarkMode ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #fca5a5';
    if (isUser) return 'none';
    return isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)';
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2 }}>
      <Paper
        elevation={isDarkMode && !isUser ? 2 : 0}
        sx={{
          p: 2,
          maxWidth: '80%',
          borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: getBackgroundColor(),
          color: getTextColor(),
          border: getBorder(),
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {isUser ? (
            <PersonIcon fontSize="small" sx={{ color: 'inherit' }} />
          ) : isError ? (
            <WarningAmberIcon fontSize="small" color="error" />
          ) : (
            <SmartToyIcon fontSize="small" color="primary" />
          )}
          <Typography
            variant="caption"
            fontWeight={700}
            color={isError ? (isDarkMode ? '#fca5a5' : 'error.main') : isUser ? 'inherit' : 'text.secondary'}
          >
            {isUser ? 'You' : isError ? 'AI System Notification' : 'AI Health Coach'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: isError ? 600 : 400, color: 'inherit' }}>
          {message.content}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;