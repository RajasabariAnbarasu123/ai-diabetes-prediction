import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Fab,
  Paper,
  Typography,
  TextField,
  IconButton,
  Zoom,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import MinimizeIcon from '@mui/icons-material/Remove';
import { sendChatMessage, addUserMessage, fetchChatHistory } from '../../store/slices/aiChatSlice';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';
import TypingAnimation from '../common/TypingAnimation';

const AiChatFab = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.aiChat);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      dispatch(fetchChatHistory());
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    dispatch(addUserMessage(input));
    dispatch(sendChatMessage(input));
    setInput('');
  };

  const handleSuggested = (question) => {
    dispatch(addUserMessage(question));
    dispatch(sendChatMessage(question));
  };

  return (
    <>
      {/* Chat panel */}
      <Zoom in={open} unmountOnExit>
        <Paper
          elevation={12}
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 520,
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1400,
            boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 36, height: 36 }}>
              <SmartToyIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle2" fontWeight={700} color="#fff">
                AI Health Coach
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                Powered by Gemini AI
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Messages */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: 'background.default' }}>
            {messages.length === 0 && !loading && (
              <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.5 }}>
                <SmartToyIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Ask me anything about diabetes, diet, or your health!
                </Typography>
              </Box>
            )}
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {loading && <TypingAnimation text="AI is thinking..." />}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested questions */}
          {messages.length === 0 && (
            <Box sx={{ px: 2, pb: 1 }}>
              <SuggestedQuestions onSelect={handleSuggested} />
            </Box>
          )}

          <Divider />

          {/* Input */}
          <Box sx={{ display: 'flex', gap: 1, p: 1.5, bgcolor: 'background.paper' }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Ask about diabetes..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{
                bgcolor: 'primary.main',
                color: '#fff',
                borderRadius: 2,
                '&:hover': { bgcolor: 'primary.dark' },
                '&:disabled': { bgcolor: 'action.disabledBackground' },
              }}
            >
              {loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Paper>
      </Zoom>

      {/* FAB button */}
      <Fab
        onClick={() => setOpen((v) => !v)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1400,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#fff',
          boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            transform: 'scale(1.08)',
          },
          transition: 'all 0.2s ease',
        }}
        aria-label="AI Health Coach"
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>
    </>
  );
};

export default AiChatFab;
