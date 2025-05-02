import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiAlertCircle } from "react-icons/fi";

// Utility to format duration
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
};

const PomodoroStatsMonthlyView = () => {
  const [data, setData] = useState([]);
  const [monthData, setMonthData] = useState([]);
  const [monthStart, setMonthStart] = useState(dayjs().startOf("month"));
  const daysInMonth = monthStart.daysInMonth();

  useEffect(() => {
    const raw = localStorage.getItem("pomodoroUserData");
    try {
      const parsed = JSON.parse(raw) || [];
      setData(parsed);
    } catch {
      setData([]);
    }
  }, []);

  useEffect(() => {
    const calendar = Array.from({ length: daysInMonth }, (_, i) => {
      const date = monthStart.date(i + 1);
      return {
        label: date.format("D"),
        key: date.format("YYYY-MM-DD"),
        focus: 0,
        break: 0,
      };
    });

    data.forEach(({ type, start, end }) => {
      const startDate = dayjs(start);
      if (startDate.isSame(monthStart, "month")) {
        const key = startDate.format("YYYY-MM-DD");
        const match = calendar.find((d) => d.key === key);
        if (match) {
          const duration = dayjs(end).diff(dayjs(start), "second");
          if (type === "focus") match.focus += duration;
          if (type === "break") match.break += duration;
        }
      }
    });

    setMonthData(calendar);
  }, [data, monthStart]);

  const startDayOfWeek = monthStart.day(); // 0 (Sun) to 6 (Sat)
  const blankDays = Array.from({ length: startDayOfWeek });

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <h2 className="text-xl font-semibold mb-2 text-[var(--text-accent)]">
        {monthStart.format("MMMM YYYY")}
      </h2>

      {monthData.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]">
          <FiAlertCircle className="text-xl" />
          <span>No data available for this month.</span>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2 text-sm mt-4">
          {/* Day of week headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center font-semibold text-[var(--text-secondary)]"
            >
              {d}
            </div>
          ))}

          {/* Blank days for alignment */}
          {blankDays.map((_, i) => (
            <div key={`blank-${i}`} />
          ))}

          {/* Day cells */}
          {monthData.map((day) => (
            <div
              key={day.key}
              className="h-20 border border-[var(--border)] rounded bg-[var(--bg-tertiary)] flex overflow-hidden"
            >
              {/* Left side: date */}
              <div className="w-[35%] flex items-center justify-center text-[var(--text-primary)] text-md font-medium border-l border-[var(--border)] bg-[var(--bg-secondary)]">
                {day.label}
              </div>
              {/* Right side: focus & break */}
              <div className="flex-1 flex flex-col justify-between text-sm p-1">
                <div className="text-[var(--text-accent)]">
                  {formatDuration(day.focus)}
                </div>
                <div className="text-[var(--text-secondary)]">
                  {formatDuration(day.break)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PomodoroStatsMonthlyView;
