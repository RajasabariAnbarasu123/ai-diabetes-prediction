import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './LoadingScreen';

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400); // 400ms transition display

    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading-screen" isTransitioning={true} />}
      </AnimatePresence>
      <div style={{ visibility: loading ? 'hidden' : 'visible', opacity: loading ? 0 : 1, transition: 'opacity 0.2s ease-in-out' }}>
        {children}
      </div>
    </>
  );
};

export default RouteTransition;

