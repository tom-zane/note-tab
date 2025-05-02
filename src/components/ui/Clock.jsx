import { useState, useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';

const clockStyles = {
  minimal: "font-mono",
  digital: "font-mono bg-[var(--text-accent)] text-[var(--bg-primary)] px-4 py-2 rounded-lg",
  analog: "font-serif italic",
  modern: "font-sans tracking-wide bg-[var(--text-secondary)] text-[var(--text-primary)] px-4 py-2 rounded-full",
  retro: "font-mono bg-[var(--text-primary)] text-[var(--bg-primary)] px-4 py-2 border-2 border-[var(--text-accent)]"
};

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const { settings } = useSettings();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!settings.showClock) return null;

  const timeString = time.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: settings.showSeconds ? '2-digit' : undefined
  });

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <span 
          className={`${clockStyles[settings.clockTheme]} transition-all`}
          style={{ fontSize: `${settings.clockSize}px` }}
        >
          {timeString}
        </span>
      
      </div>
    </div>
  );
}