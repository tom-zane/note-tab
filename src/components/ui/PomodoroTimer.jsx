import { useState, useEffect, useCallback, useRef } from 'react';
import { FiPlay, FiPause, FiSkipForward, FiClock, FiCoffee } from 'react-icons/fi';
import { useSettings } from '../../contexts/SettingsContext';

export default function PomodoroTimer() {
  const {settings} = useSettings();
  
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
  const sessionStartRef = useRef(null);



  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveSession = useCallback((start, end, type) => {
    const stored = JSON.parse(localStorage.getItem('pomodoroUserData') || '[]');
    stored.push({ type, start, end });
    localStorage.setItem('pomodoroUserData', JSON.stringify(stored));
  }, []);

  const resetTimer = useCallback(() => {
    const newTime = isBreak ? settings.breakTime * 60 : settings.focusTime * 60;
    setTimeLeft(newTime);
    sessionStartRef.current = new Date().toISOString();
  }, [isBreak, settings.breakTime, settings.focusTime]);

  const skipSession = () => {
    if (sessionStartRef.current) {
      const now = new Date().toISOString();
      saveSession(sessionStartRef.current, now, isBreak ? 'break' : 'focus');
    }
    setIsRunning(false);
    setIsBreak(!isBreak);
    resetTimer();
  };

  useEffect(() => {
    if (isRunning && !sessionStartRef.current) {
      sessionStartRef.current = new Date().toISOString();
    }

    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      const now = new Date().toISOString();
      if (sessionStartRef.current) {
        saveSession(sessionStartRef.current, now, isBreak ? 'break' : 'focus');
      }
      setIsBreak(!isBreak);
      resetTimer();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, resetTimer, saveSession]);

  return (
    <div className="flex items-center gap-4 bg-[var(--bg-tertiary)] px-4 py-2 rounded-lg shadow-sm">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
        isBreak 
          ? 'bg-[var(--button-secondary)] text-[var(--text-primary)]' 
          : 'bg-[var(--button-primary)] text-[var(--text-primary)]'
      }`}>
        {isBreak ? <FiCoffee size={14} /> : <FiClock size={14} />}
        <span className="text-sm text-[var(--text-primary)] font-mono">
          {isBreak ? 'Break' : 'Focus'}
        </span>
      </div>
      <span className="text-[var(--text-accent)] font-mono text-xl min-w-[80px] text-center">
        {formatTime(timeLeft)}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setIsRunning((prev) => !prev);
            if (!isRunning && !sessionStartRef.current) {
              sessionStartRef.current = new Date().toISOString();
            }
          }}
          className={`p-2 rounded-full hover:bg-[var(--bg-primary)] transition-colors ${
            isRunning ? 'text-[var(--button-danger)]' : 'text-[var(--button-primary)]'
          }`}
        >
          {isRunning ? <FiPause size={16} /> : <FiPlay size={16} />}
        </button>
        <button
          onClick={skipSession}
          className="p-2 rounded-full hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] transition-colors"
        >
          <FiSkipForward size={16} />
        </button>
      </div>
    </div>
  );
}
