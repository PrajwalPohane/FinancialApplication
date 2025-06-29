import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string, customRange?: DateRange) => void;
  customRange?: DateRange;
  options?: { value: string; label: string }[];
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  value,
  onChange,
  customRange,
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempRange, setTempRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [selectingStart, setSelectingStart] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const defaultOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'selectrange', label: 'Select Range' }
  ];
  const optionsList = options || defaultOptions;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowCalendar(false);
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

  const getDisplayLabel = () => {
    if (value === 'selectrange' && customRange?.startDate && customRange?.endDate) {
      return `${formatDate(customRange.startDate)} - ${formatDate(customRange.endDate)}`;
    }
    return optionsList.find(opt => opt.value === value)?.label || 'Monthly';
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
    if (!tempRange.startDate || !tempRange.endDate) return false;
    return date >= tempRange.startDate && date <= tempRange.endDate;
  };

  const isDateSelected = (date: Date) => {
    return (tempRange.startDate && date.getTime() === tempRange.startDate.getTime()) ||
           (tempRange.endDate && date.getTime() === tempRange.endDate.getTime());
  };

  const handleDateClick = (date: Date) => {
    if (selectingStart || !tempRange.startDate) {
      setTempRange({ startDate: date, endDate: null });
      setSelectingStart(false);
    } else {
      if (date < tempRange.startDate) {
        setTempRange({ startDate: date, endDate: tempRange.startDate });
      } else {
        setTempRange({ startDate: tempRange.startDate, endDate: date });
      }
      setSelectingStart(true);
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

  const handleOptionSelect = (optionValue: string) => {
    if (optionValue === 'selectrange') {
      setShowCalendar(true);
      setTempRange(customRange || { startDate: null, endDate: null });
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setShowCalendar(false);
    }
  };

  const applyCustomRange = () => {
    if (tempRange.startDate && tempRange.endDate) {
      onChange('selectrange', tempRange);
      setIsOpen(false);
      setShowCalendar(false);
    }
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
        className="flex items-center space-x-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:bg-gray-600 transition-colors duration-200 min-w-[140px]"
      >
        <span>{getDisplayLabel()}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[200px]">
          {!showCalendar ? (
            <div className="py-2">
              {optionsList.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors duration-200 ${
                    value === option.value ? 'text-emerald-400 bg-gray-700/50' : 'text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 w-[400px]">
              {/* Quick Range Buttons */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Quick ranges:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => setTempRange(range.getValue())}
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

                <div className="grid grid-cols-7 gap-1 mb-4">
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

                {/* Selection Status and Actions */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm mb-2">
                    {selectingStart || !tempRange.startDate 
                      ? 'Select start date' 
                      : 'Select end date'
                    }
                  </p>
                  
                  {tempRange.startDate && (
                    <p className="text-emerald-400 text-sm mb-2">
                      Start: {formatDate(tempRange.startDate)}
                      {tempRange.endDate && (
                        <span className="text-gray-400"> → End: {formatDate(tempRange.endDate)}</span>
                      )}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={() => {
                        setShowCalendar(false);
                        setTempRange({ startDate: null, endDate: null });
                      }}
                      className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    
                    <button
                      onClick={applyCustomRange}
                      disabled={!tempRange.startDate || !tempRange.endDate}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200"
                    >
                      Apply Range
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeRangeSelector;