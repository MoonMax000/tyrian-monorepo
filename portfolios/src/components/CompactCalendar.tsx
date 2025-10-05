import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CompactCalendarProps {
  selected?: Date | null;
  onSelect: (date: Date) => void;
}

type ViewMode = 'day' | 'month' | 'year';

const CompactCalendar: React.FC<CompactCalendarProps> = ({ selected, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('day');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesShort = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Monday-first labels
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    // Pad to complete weeks and always 6 rows (42 cells) to avoid height jumps
    while (days.length % 7 !== 0) {
      days.push(null);
    }
    while (days.length < 42) {
      days.push(null);
    }

    return days;
  };

  const getYearRange = () => {
    const currentYear = currentMonth.getFullYear();
    const years: number[] = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = monthNames[currentMonth.getMonth()];
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
  };

  const handleNextYear = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
  };

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(newDate);
  };

  const handleMonthClick = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setViewMode('day');
  };

  const handleYearClick = (selectedYear: number) => {
    setCurrentMonth(new Date(selectedYear, currentMonth.getMonth(), 1));
    setViewMode('month');
  };

  const handleHeaderClick = () => {
    if (viewMode === 'day') {
      setViewMode('month');
    } else if (viewMode === 'month') {
      setViewMode('year');
    }
  };

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === currentMonth.getMonth() &&
      selected.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className="w-[320px] p-4 rounded-2xl border border-tyrian-gray-darker glass-card bg-tyrian-dark/60 backdrop-blur-[30px] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
      {/* Header */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10">
        <button
          onClick={viewMode === 'day' ? handlePrevMonth : viewMode === 'month' ? handlePrevYear : undefined}
          className="h-7 w-7 bg-transparent p-0 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-md flex items-center justify-center"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={handleHeaderClick}
          className="text-white text-base font-bold font-nunito hover:text-white/80 transition-colors cursor-pointer"
        >
          {viewMode === 'day' && `${monthName} ${year}`}
          {viewMode === 'month' && `${year}`}
          {viewMode === 'year' && `${year}`}
        </button>

        <button
          onClick={viewMode === 'day' ? handleNextMonth : viewMode === 'month' ? handleNextYear : undefined}
          className="h-7 w-7 bg-transparent p-0 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/5 rounded-md flex items-center justify-center"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day View */}
      {viewMode === 'day' && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((name, i) => (
              <div
                key={i}
                className="text-white/50 uppercase text-[10px] font-semibold font-nunito text-center"
              >
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <div key={index} className="aspect-square">
                {day ? (
                  <button
                    onClick={() => handleDayClick(day)}
                    className={`w-full h-full p-0 font-medium rounded-full transition-all duration-200 font-nunito flex items-center justify-center text-sm ${
                      isSelected(day)
                        ? 'bg-tyrian-purple-primary text-white font-semibold shadow-lg'
                        : isToday(day)
                        ? 'bg-transparent text-white font-semibold'
                        : 'text-white/90 hover:bg-white/10'
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="grid grid-cols-3 gap-3 py-2">
          {monthNamesShort.map((month, index) => (
            <button
              key={index}
              onClick={() => handleMonthClick(index)}
              className={`p-3 rounded-lg font-medium font-nunito text-sm transition-all duration-200 ${
                currentMonth.getMonth() === index
                  ? 'bg-tyrian-purple-primary text-white font-semibold shadow-lg'
                  : 'text-white/90 hover:bg-white/10'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      )}

      {/* Year View */}
      {viewMode === 'year' && (
        <div className="flex flex-col items-center gap-2 py-4 max-h-[280px] overflow-y-auto">
          {getYearRange().map((y) => (
            <button
              key={y}
              onClick={() => handleYearClick(y)}
              className={`font-nunito transition-all duration-200 hover:text-white ${
                y === year
                  ? 'text-3xl font-bold text-white'
                  : 'text-lg text-white/60 hover:text-white/80'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompactCalendar;
