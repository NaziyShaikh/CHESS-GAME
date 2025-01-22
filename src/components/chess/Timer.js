import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';

const Timer = forwardRef(({ isActive, initialTime }, ref) => {
  const [time, setTime] = useState(initialTime);

  // Expose resetTimer function to parent
  useImperativeHandle(ref, () => ({
    resetTimer: () => {
      setTime(initialTime);
    }
  }));

  useEffect(() => {
    let interval = null;
    
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      {formatTime(time)}
    </div>
  );
});

Timer.displayName = 'Timer';

export default Timer;
