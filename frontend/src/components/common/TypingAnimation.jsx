import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const TypingAnimation = ({ text, speed = 50, delay = 0 }) => {
  const [displayed, setDisplayed] = useState('');
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (started && index < text.length) {
      const timer = setTimeout(() => {
        setDisplayed((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [index, started, text, speed]);

  return (
    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
      {displayed}
      {index < text.length && <span className="cursor-blink">|</span>}
    </Typography>
  );
};

export default TypingAnimation;