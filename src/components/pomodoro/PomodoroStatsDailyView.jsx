import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FiAlertCircle } from "react-icons/fi";

const PomodoroStats = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("pomodoroUserData");
    console.log("Raw data from localStorage:", raw);
    try {
      const parsed = JSON.parse(raw) || [];
      console.log("Parsed data:", parsed);
      setData(parsed);
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      setData([]);
    }
  }, []);

  useEffect(() => {
    console.log("Filtering data for selected date:", selectedDate);
    const filtered = data.filter(
      (entry) => dayjs(entry.start).format("YYYY-MM-DD") === selectedDate
    );
    console.log("Filtered data:", filtered);
    setFilteredData(filtered);
  }, [data, selectedDate]);

  const computeAverages = () => {
    console.log("Computing averages for filtered data:", filteredData);
    const durations = { focus: [], break: [] };

    filteredData.forEach(({ type, start, end }) => {
      const startTime = dayjs(start);
      const endTime = dayjs(end);
      const duration = endTime.diff(startTime, "second");
      console.log(
        `Type: ${type}, Start: ${start}, End: ${end}, Duration: ${duration}`
      );
      if (durations[type]) durations[type].push(duration);
    });

    const average = (arr) =>
      arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const averages = {
      focus: average(durations.focus),
      break: average(durations.break),
    };
    console.log("Computed averages:", averages);
    return averages;
  };

  const { focus, break: breakTime } = computeAverages();

  return (
    <div className="w-full flex items-start flex-col  p-6 rounded-lg bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mb-4">
        <label className="block text-sm mb-1 text-[var(--text-secondary)] ">
          Select Date:
        </label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 rounded border w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border)]"
        />
        <p className="text-lg mt-1 text-[var(--text-secondary)]">
          Selected: {dayjs(selectedDate).format("DD/MM/YYYY")}
        </p>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex items-center gap-2 p-4 rounded border  bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] ">
          <FiAlertCircle className="text-xl" />
          <span>No data available for this date.</span>
        </div>
      ) : (
        <div className="p-4 mt-4 rounded border flex flex-col gap-2 w-full bg-[var(--bg-tertiary)] border-[var(--border)] ">
          <div className="mb-2">
            <span className="font-semibold text-[var(--text-accent)]">
              Average Focus Time:
            </span>
            {focus} sec
          </div>
          <div>
            <span className="font-semibold text-[var(--text-accent)]">
              Average Break Time:
            </span>
            {breakTime} sec
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroStats;
