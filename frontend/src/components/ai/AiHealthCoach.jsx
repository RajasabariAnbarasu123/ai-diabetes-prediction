import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { sendChatMessage, addUserMessage, fetchChatHistory } from '../../store/slices/aiChatSlice';
import ChatMessage from './ChatMessage';
import SuggestedQuestions from './SuggestedQuestions';
import TypingAnimation from '../common/TypingAnimation';

const AiHealthCoach = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.aiChat);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '60vh' }}>
      <Paper sx={{ flexGrow: 1, overflow: 'auto', p: 2, mb: 2, borderRadius: 3 }}>
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {loading && <TypingAnimation text="AI is typing..." />}
        <div ref={messagesEndRef} />
      </Paper>
      <SuggestedQuestions onSelect={handleSuggested} />
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me anything about diabetes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend} disabled={loading}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default AiHealthCoach;