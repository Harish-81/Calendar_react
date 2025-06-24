import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle } from 'lucide-react';

// Sample events data
const SAMPLE_EVENTS = [
  {
    id: 1,
    title: "Daily Standup",
    startTime: "9:00",
    endTime: "9:30",
    color: "#f6be23",
    date: "2025-06-23"
  },
  {
    id: 2,
    title: "Weekly Catchup",
    startTime: "14:30",
    endTime: "15:30",
    color: "#4285f4",
    date: "2025-06-23"
  },
  {
    id: 3,
    title: "Project Review",
    startTime: "10:00",
    endTime: "11:00",
    color: "#34a853",
    date: "2025-06-24"
  },
  {
    id: 4,
    title: "Team Meeting",
    startTime: "16:00",
    endTime: "17:00",
    color: "#ea4335",
    date: "2025-06-25"
  },
  {
    id: 5,
    title: "Client Call",
    startTime: "11:00",
    endTime: "12:00",
    color: "#9c27b0",
    date: "2025-06-26"
  },
  {
    id: 6,
    title: "Design Review",
    startTime: "15:00",
    endTime: "16:00",
    color: "#ff9800",
    date: "2025-06-27"
  },
  {
    id: 7,
    title: "Sprint Planning",
    startTime: "10:00",
    endTime: "12:00",
    color: "#795548",
    date: "2025-06-30"
  }
];

// Date utility functions
const formatDate = (date, format) => {
  const options = {
    'MMMM YYYY': { month: 'long', year: 'numeric' },
    'MMMM D, YYYY': { month: 'long', day: 'numeric', year: 'numeric' }
  };
  return date.toLocaleDateString('en-US', options[format] || {});
};

const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const isSameMonth = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth();
};

const startOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const endOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const endOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
};

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const CalendarApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events] = useState(SAMPLE_EVENTS);

  const today = new Date();
  
  // Get the first day of the current month and calculate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const current = new Date(calendarStart);
    
    while (current <= calendarEnd) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [calendarStart, calendarEnd]);

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Check for time conflicts
  const hasTimeConflicts = (dateEvents) => {
    if (dateEvents.length <= 1) return false;
    
    for (let i = 0; i < dateEvents.length; i++) {
      for (let j = i + 1; j < dateEvents.length; j++) {
        const event1Start = new Date(`2000-01-01 ${dateEvents[i].startTime}`);
        const event1End = new Date(`2000-01-01 ${dateEvents[i].endTime}`);
        const event2Start = new Date(`2000-01-01 ${dateEvents[j].startTime}`);
        const event2End = new Date(`2000-01-01 ${dateEvents[j].endTime}`);
        
        if (
          (event1Start < event2End && event1End > event2Start) ||
          (event2Start < event1End && event2End > event1Start)
        ) {
          return true;
        }
      }
    }
    return false;
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => addMonths(prev, direction));
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    setSelectedDate(selectedDate && isSameDay(selectedDate, date) ? null : date);
  };

  const EventCard = ({ event, hasConflict }) => (
    <div
      className={`text-xs p-1 mb-1 rounded-sm text-white font-medium truncate cursor-pointer transition-all duration-200 hover:shadow-md ${
        hasConflict ? 'ring-2 ring-red-400 ring-opacity-50' : ''
      }`}
      style={{ backgroundColor: event.color }}
      title={`${event.title} (${event.startTime} - ${event.endTime})`}
    >
      <div className="flex items-center gap-1">
        {hasConflict && <AlertCircle size={10} className="text-red-200" />}
        <span className="truncate">{event.title}</span>
      </div>
      <div className="text-xs opacity-90">
        {event.startTime} - {event.endTime}
      </div>
    </div>
  );

  const CalendarDay = ({ day }) => {
    const dayEvents = getEventsForDate(day);
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isToday = isSameDay(day, today);
    const isSelected = selectedDate && isSameDay(day, selectedDate);
    const hasConflicts = hasTimeConflicts(dayEvents);

    return (
      <div
        className={`min-h-32 p-2 border border-gray-200 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
          isCurrentMonth ? 'bg-white' : 'bg-gray-50'
        } ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className={`text-sm font-medium ${
              isToday
                ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs'
                : isCurrentMonth
                ? 'text-gray-900'
                : 'text-gray-400'
            }`}
          >
            {day.getDate()}
          </span>
          {hasConflicts && (
            <AlertCircle size={14} className="text-red-500" title="Time conflicts detected" />
          )}
        </div>
        
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map((event) => (
            <EventCard
              key={event.id}
              event={event}
              hasConflict={hasConflicts}
            />
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 font-medium">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const EventDetailPanel = () => {
    if (!selectedDate) return null;
    
    const dayEvents = getEventsForDate(selectedDate);
    const hasConflicts = hasTimeConflicts(dayEvents);

    return (
      <div className="bg-white rounded-lg shadow-lg border p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDate(selectedDate, 'MMMM D, YYYY')}
          </h3>
          <button
            onClick={() => setSelectedDate(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
        
        {dayEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock size={24} className="mx-auto mb-2 opacity-50" />
            <p>No events scheduled for this day</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus size={16} className="inline mr-1" />
              Add Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {hasConflicts && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="font-medium">Time Conflicts Detected</span>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Some events have overlapping times. Please review the schedule.
                </p>
              </div>
            )}
            
            {dayEvents
              .sort((a, b) => new Date(`2000-01-01 ${a.startTime}`) - new Date(`2000-01-01 ${b.startTime}`))
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  ></div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600">
                      {event.startTime} - {event.endTime}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-semibold text-gray-800 min-w-48 text-center">
                {formatDate(currentDate, 'MMMM YYYY')}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Today
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              <Plus size={16} className="inline mr-1" />
              New Event
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-4 text-center font-semibold text-gray-700 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <CalendarDay key={index} day={day} />
          ))}
        </div>
      </div>

      {/* Event Detail Panel */}
      <EventDetailPanel />

      {/* Legend */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Legend</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Today</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" />
            <span>Time Conflicts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded"></div>
            <span>Selected Date</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarApp;