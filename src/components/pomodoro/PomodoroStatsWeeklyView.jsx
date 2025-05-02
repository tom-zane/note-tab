import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiAlertCircle } from "react-icons/fi";

// Utility to format duration in seconds, minutes, or hours
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
  return `${(seconds / 3600).toFixed(1)}h`;
};

const PomodoroStatsWeeklyView = () => {
  const [data, setData] = useState([]);
  const [weekData, setWeekData] = useState([]);

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
    const today = dayjs();
    const pastWeek = Array.from({ length: 7 }, (_, i) => {
      const date = today.subtract(i, "day");
      return {
        label: date.format("DD/MM/YYYY"),
        key: date.format("YYYY-MM-DD"),
        focus: 0,
        break: 0,
      };
    }).reverse();

    data.forEach(({ type, start, end }) => {
      const startDay = dayjs(start).format("YYYY-MM-DD");
      const match = pastWeek.find((d) => d.key === startDay);
      if (match) {
        const duration = dayjs(end).diff(dayjs(start), "second");
        if (type === "focus") match.focus += duration;
        if (type === "break") match.break += duration;
      }
    });

    setWeekData(pastWeek);
  }, [data]);

  const averageFocus = () => {
    const total = weekData.reduce((sum, d) => sum + d.focus, 0);
    return weekData.length ? Math.round(total / weekData.length) : 0;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <h2 className="text-xl font-semibold mb-4 text-[var(--text-accent)]">
        Weekly Pomodoro Stats
      </h2>

      {weekData.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded border bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]">
          <FiAlertCircle className="text-xl" />
          <span>No data available for the past week.</span>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--bg-secondary)]">
                  <th className="p-2 border border-[var(--border)]">Date</th>
                  <th className="p-2 border border-[var(--border)]">Focus Time</th>
                  <th className="p-2 border border-[var(--border)]">Break Time</th>
                </tr>
              </thead>
              <tbody>
                {weekData.map((day) => (
                  <tr key={day.key} className="bg-[var(--bg-tertiary)]">
                    <td className="p-2 border border-[var(--border)]">{day.label}</td>
                    <td className="p-2 border border-[var(--border)]">
                      {formatDuration(day.focus)}
                    </td>
                    <td className="p-2 border border-[var(--border)]">
                      {formatDuration(day.break)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded border bg-[var(--bg-tertiary)] border-[var(--border)]">
            <span className="font-semibold text-[var(--text-accent)]">
              Average Daily Focus Time:
            </span>{" "}
            {formatDuration(averageFocus())}
          </div>
        </>
      )}
    </div>
  );
};

export default PomodoroStatsWeeklyView;
