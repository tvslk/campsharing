import React from "react";
import styles from "./day-picker.module.scss";
import LeftArrow from "../../assets/icons/left-arrow.png";
import RightArrow from "../../assets/icons/right-arrow.png";

interface DayPickerProps {
  selectedDays: Date[];
  onDaySelect: (day: Date) => void;
  reservedDates: Date[];
}

export const DayPicker: React.FC<DayPickerProps> = ({
  selectedDays,
  onDaySelect,
  reservedDates,
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const generateDays = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const totalDays = daysInMonth(month, year);

    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const handleDayClick = (day: Date) => {
    if (reservedDates.some((reserved) => reserved.toDateString() === day.toDateString())) {
      return; 
    }
    onDaySelect(day);
  };

  const isDayInRange = (day: Date) => {
    if (selectedDays.length === 2) {
      const [start, end] = selectedDays;
      return day >= start && day <= end;
    }
    return selectedDays.some((d) => d.getTime() === day.getTime());
  };

  const isDayReserved = (day: Date) =>
    reservedDates.some((reserved) => reserved.toDateString() === day.toDateString());

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className={styles.dayPicker}>
      <div className={styles.header}>
        <button className={styles.navButton} onClick={goToPreviousMonth}>
          <img src={LeftArrow} alt="Left Arrow" />
        </button>
        <div className={styles.currentMonth}>
          {currentMonth.toLocaleString("sk", { month: "long" })} {currentMonth.getFullYear()}
        </div>
        <button className={styles.navButton} onClick={goToNextMonth}>
          <img src={RightArrow} alt="Right Arrow" />
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {generateDays().map((day, index) => (
          <button
            key={index}
            className={`${styles.day} ${
              isDayReserved(day) ? styles.reserved : isDayInRange(day) ? styles.selected : ""
            }`}
            onClick={() => handleDayClick(day)}
            disabled={isDayReserved(day)}
          >
            {day.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};