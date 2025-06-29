import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date range"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDisplayText = () => {
    if (value.startDate && value.endDate) {
      return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
    } else if (value.startDate) {
      return `${formatDate(value.startDate)} - Select end date`;
    }
    return placeholder;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!value.startDate || !value.endDate) return false;
    return date >= value.startDate && date <= value.endDate;
  };

  const isDateSelected = (date: Date) => {
    return (value.startDate && date.getTime() === value.startDate.getTime()) ||
           (value.endDate && date.getTime() === value.endDate.getTime());
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart || !value.startDate) {
      onChange({ startDate: date, endDate: null });
      setSelectingStart(false);
    } else {
      if (date < value.startDate) {
        onChange({ startDate: date, endDate: value.startDate });
      } else {
        onChange({ startDate: value.startDate, endDate: date });
      }
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const clearSelection = () => {
    onChange({ startDate: null, endDate: null });
    setSelectingStart(true);
  };

  const quickRanges = [
    {
      label: 'Last 7 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'Last 30 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'Last 90 days',
      getValue: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 90);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'This month',
      getValue: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { startDate: start, endDate: end };
      }
    }
  ];

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white hover:bg-gray-600 transition-colors duration-200 min-w-[200px]"
      >
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm">{formatDisplayText()}</span>
        {(value.startDate || value.endDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearSelection();
            }}
            className="p-1 hover:bg-gray-500 rounded transition-colors duration-200"
            title="Clear date range"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 p-4 min-w-[400px]">
          {/* Quick Range Buttons */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Quick ranges:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onChange(range.getValue());
                    setIsOpen(false);
                  }}
                  className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Previous month"
              >
                <ChevronLeft className="h-4 w-4 text-gray-400" />
              </button>
              
              <h3 className="text-white font-medium">{monthYear}</h3>
              
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                title="Next month"
              >
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-gray-400 text-sm py-2 font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <div key={index} className="aspect-square">
                  {date && (
                    <button
                      onClick={() => handleDateClick(date)}
                      className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                        isDateSelected(date)
                          ? 'bg-emerald-600 text-white font-medium'
                          : isDateInRange(date)
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Selection Status */}
            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                {selectingStart || !value.startDate 
                  ? 'Select start date' 
                  : 'Select end date'
                }
              </p>
              {value.startDate && !value.endDate && (
                <p className="text-emerald-400 text-sm mt-1">
                  Start: {formatDate(value.startDate)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;