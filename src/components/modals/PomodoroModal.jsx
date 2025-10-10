import { FiX } from "react-icons/fi";
import { useState } from "react";

import PomodoroStatsDailyView from "../pomodoro/PomodoroStatsDailyView";
import PomodoroStatsWeeklyView from "../pomodoro/PomodoroStatsWeeklyView";
import PomodoroStatsMonthlyView from "../pomodoro/PomodoroStatsMonthlyView";

export default function PomodoroModal({ onClose }) {
  const [tab, setTab] = useState("daily");

  return (
    <div className="fixed inset-0 bg-[var(--overlay)] backdrop-blur-sm flex items-center justify-center z-20 ">
      <div className="bg-[var(--bg-primary)] rounded-lg p-6 w-[70%]   min-h-[70vh] max-h-[90vh] overflow-y-auto scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold border-b-[var(--text-accent)] border-b-2 font-mono text-[var(--text-accent)]">
            Pomodoro Stats
          </h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="flex w-full mb-2  bg-[var(--bg-secondary)] rounded-md">
          <button
            onClick={() => {
              setTab("daily");
            }}
            className={` w-1/3 py-2  transition-colors rounded-tl-md rounded-bl-md text-md text-[var(--text-primary)] font-semibold ${
              tab === "daily"
                ? "bg-[var(--bg-primary)] "
                : "bg-[var(--bg-tertiary)]"
            } `}
          >
            Daily
          </button>
          <button
            onClick={() => {
              setTab("weekly");
            }}
            className={` w-1/3 py-2  transition-colors text-[var(--text-primary)] text-md font-semibold ${
              tab === "weekly"
                ? "bg-[var(--bg-primary)] "
                : "bg-[var(--bg-tertiary)]"
            } `}
          >
            Weekly
          </button>
          <button
            onClick={() => {
              setTab("monthly");
            }}
            className={` w-1/3 py-2 text-md text-[var(--text-primary)] rounded-tr-md transition-colors rounded-br-md font-semibold ${
              tab === "monthly"
                ? "bg-[var(--bg-primary)]"
                : "bg-[var(--bg-tertiary)]  "
            } `}
          >
            Monthly
          </button>
        </div>
        <div>
          {tab === "daily" && <PomodoroStatsDailyView />}

          {tab === "weekly" && <PomodoroStatsWeeklyView />}

          {tab === "monthly" && <PomodoroStatsMonthlyView /> }
        </div>
      </div>
    </div>
  );
}
