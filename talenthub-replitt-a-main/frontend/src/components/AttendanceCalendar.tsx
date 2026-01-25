import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface ClassSession {
  id: number;
  session_date: string;
  branch: string;
  course: string | null;
  level: string | null;
  batch_name: string | null;
  topic: string | null;
  is_completed: boolean;
}

interface AttendanceRecord {
  id: number;
  session_id: number;
  status: "present" | "absent" | "on_break" | "leave";
  session?: ClassSession;
}

interface CalendarProps {
  sessions: ClassSession[];
  attendanceRecords?: AttendanceRecord[];
  onDateClick?: (date: Date) => void;
  selectedDate?: Date | null;
  isStudentView?: boolean;
}

export default function AttendanceCalendar({
  sessions,
  attendanceRecords = [],
  onDateClick,
  selectedDate,
  isStudentView = false,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Get sessions for current month only
  const getSessionsForCurrentMonth = () => {
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    return sessions.filter((session) => {
      const sessionDate = new Date(session.session_date);
      return sessionDate >= firstDay && sessionDate <= lastDay;
    });
  };

  const sessionsThisMonth = getSessionsForCurrentMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Adjust to Monday = 0
  const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
  
  // Check if selected date is today
  const isSelectedDateToday = selectedDate ? (() => {
    const today = new Date();
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    );
  })() : false;

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getSessionsForDate = (date: Date): ClassSession[] => {
    const dateStr = date.toISOString().split("T")[0];
    return sessions.filter((session) => {
      const sessionDate = new Date(session.session_date);
      return sessionDate.toISOString().split("T")[0] === dateStr;
    });
  };

  const getAttendanceForDate = (date: Date): AttendanceRecord | null => {
    if (!isStudentView || attendanceRecords.length === 0) return null;
    const dateStr = date.toISOString().split("T")[0];
    return attendanceRecords.find((record) => {
      if (!record.session) return false;
      const sessionDate = new Date(record.session.session_date);
      return sessionDate.toISOString().split("T")[0] === dateStr;
    }) || null;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "present":
        return "bg-green-500 dark:bg-green-600";
      case "absent":
        return "bg-red-500 dark:bg-red-600";
      case "on_break":
        return "bg-yellow-500 dark:bg-yellow-600";
      case "leave":
        return "bg-blue-500 dark:bg-blue-600";
      default:
        return "bg-slate-400 dark:bg-slate-500";
    }
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    // Empty cells for days before month starts
    for (let i = 0; i < adjustedStartingDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateSessions = getSessionsForDate(date);
      const attendance = getAttendanceForDate(date);
      const isPast = date < today && !isToday(date);
      const isFuture = date > today;

      days.push(
        <div
          key={day}
          onClick={() => onDateClick?.(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
          className={`
            aspect-square p-0.5 rounded border transition-all duration-300 cursor-pointer
            ${isSelected(date) 
              ? "border-indigo-500 dark:border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 shadow-md scale-105 ring-1 ring-indigo-200 dark:ring-indigo-500/50" 
              : isToday(date)
              ? "border-indigo-400 dark:border-indigo-500 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-sm ring-1 ring-indigo-200/50 dark:ring-indigo-500/30"
              : hoveredDate?.getTime() === date.getTime()
              ? "border-slate-300 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 shadow-sm scale-105"
              : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600"
            }
            ${isPast ? "opacity-60" : ""}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Date number */}
            <div className={`
              text-xs font-bold mb-0.5
              ${isToday(date) 
                ? "text-indigo-600 dark:text-indigo-400" 
                : isSelected(date)
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-slate-700 dark:text-slate-300"
              }
            `}>
              {day}
            </div>

            {/* Sessions/Attendance indicators */}
            <div className="flex-1 flex flex-col gap-0.5 overflow-hidden">
              {/* Scheduled Class Indicator - Always visible if there are sessions */}
              {dateSessions.length > 0 && (
                <div className="flex items-center gap-0.5 bg-indigo-50 dark:bg-indigo-900/30 px-0.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-700">
                  <div className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                  <span className="text-[9px] font-semibold text-indigo-700 dark:text-indigo-300 truncate leading-none">
                    {dateSessions.length}
                  </span>
                </div>
              )}
              
              {/* Attendance Status Indicator - Visible alongside scheduled class */}
              {isStudentView && attendance && (
                <div className={`
                  w-full h-1 rounded ${getStatusColor(attendance.status)}
                `} title={attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1).replace('_', ' ')} />
              )}

              {!isStudentView && dateSessions.length > 0 && (
                <div className="text-[9px] font-medium text-slate-600 dark:text-slate-400 truncate bg-slate-50 dark:bg-slate-700/50 px-0.5 py-0.5 rounded">
                  {dateSessions[0].course || "Class"}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-xl shadow-lg dark:shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-1 transition-all duration-300 w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-0.5 pb-0.5 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-0.5">
          <div className="p-0.5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded shadow-md ring-1 ring-indigo-200/50 dark:ring-indigo-500/30">
            <CalendarIcon className="w-2 h-2 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              {sessionsThisMonth.length} {sessionsThisMonth.length === 1 ? "scheduled class" : "scheduled classes"} this month
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => navigateMonth("prev")}
            className="p-0.5 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ChevronLeft className="w-2 h-2 text-slate-700 dark:text-slate-300" />
          </button>
          <button
            onClick={() => {
              const today = new Date();
              setCurrentMonth(today);
              onDateClick?.(today);
            }}
            className="px-1 py-0.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
          >
            {isSelectedDateToday ? "Today" : selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Today"}
          </button>
          <button
            onClick={() => navigateMonth("next")}
            className="p-0.5 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 rounded transition-all duration-200 hover:shadow-sm active:scale-95"
          >
            <ChevronRight className="w-2 h-2 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Day names header */}
      <div className="grid grid-cols-7 gap-0.5 mb-0.5">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-bold text-slate-700 dark:text-slate-300 py-0.5 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="mt-0.5 pt-0.5 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-center gap-0.5 flex-wrap">
          <div className="flex items-center gap-0.5 px-0.5 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-200 dark:border-indigo-700">
            <div className="w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />
            <span className="text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">Scheduled Class</span>
          </div>
          {isStudentView && (
            <>
              <div className="flex items-center gap-0.5 px-0.5 py-0.5 bg-green-50 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-700">
                <div className="w-1 h-1 rounded-full bg-green-500 dark:bg-green-600" />
                <span className="text-[10px] font-semibold text-green-700 dark:text-green-300">Present</span>
              </div>
              <div className="flex items-center gap-0.5 px-0.5 py-0.5 bg-red-50 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-700">
                <div className="w-1 h-1 rounded-full bg-red-500 dark:bg-red-600" />
                <span className="text-[10px] font-semibold text-red-700 dark:text-red-300">Absent</span>
              </div>
              <div className="flex items-center gap-0.5 px-0.5 py-0.5 bg-yellow-50 dark:bg-yellow-900/30 rounded border border-yellow-200 dark:border-yellow-700">
                <div className="w-1 h-1 rounded-full bg-yellow-500 dark:bg-yellow-600" />
                <span className="text-[10px] font-semibold text-yellow-700 dark:text-yellow-300">On Break</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
