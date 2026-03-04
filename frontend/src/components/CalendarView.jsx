import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, Circle, X } from "lucide-react";

const STATUS_CONFIG = {
  DONE:        { color: "#10b981", bg: "rgba(16,185,129,0.12)",  border: "rgba(16,185,129,0.3)",  label: "Terminé",   dot: "#10b981" },
  IN_PROGRESS: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)",  label: "En cours",  dot: "#f59e0b" },
  TODO:        { color: "#6366f1", bg: "rgba(99,102,241,0.10)", border: "rgba(99,102,241,0.25)", label: "À faire",   dot: "#6366f1" },
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const accent = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

// ── Tooltip / popover for a day's tasks ──────────────────────
const DayPopover = ({ tasks, dateLabel, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
    style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
    onClick={onClose}
  >
    <div
      className="w-full max-w-sm rounded-3xl p-6 animate-scaleIn"
      style={{
        background: "rgba(255,255,255,0.98)",
        boxShadow: "0 30px 60px rgba(79,70,229,0.2)",
      }}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Tâches</p>
          <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>{dateLabel}</h3>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto">
        {tasks.map(task => {
          const s = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
          return (
            <div key={task.id} className="flex items-start gap-3 px-3 py-3 rounded-2xl transition-all"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
            >
              <div className="mt-0.5 flex-shrink-0">
                {task.status === "DONE"
                  ? <CheckCircle2 size={15} style={{ color: s.color }} />
                  : task.status === "IN_PROGRESS"
                    ? <Clock size={15} style={{ color: s.color }} />
                    : <Circle size={15} style={{ color: s.color }} />
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate" style={{ fontFamily: "'Syne', sans-serif" }}>{task.title}</p>
                {task.project_name && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{task.project_name}</p>
                )}
                <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg" style={{ color: s.color, background: `${s.bg}` }}>
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

// ── Main CalendarView ─────────────────────────────────────────
const CalendarView = ({ tasks = [] }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Build task map: "YYYY-MM-DD" → [task, ...]
  const taskMap = useMemo(() => {
    const map = {};
    tasks.forEach(task => {
      if (!task.due_date) return;
      const key = task.due_date.slice(0, 10); // "YYYY-MM-DD"
      if (!map[key]) map[key] = [];
      map[key].push(task);
    });
    return map;
  }, [tasks]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    // Monday-based: getDay() returns 0=Sun, so offset
    let startDow = firstDay.getDay(); // 0=Sun
    startDow = startDow === 0 ? 6 : startDow - 1; // convert to Mon=0
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];
    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, currentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
    }
    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, currentMonth: true, date: new Date(year, month, d) });
    }
    // Next month padding to complete 6 rows
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, currentMonth: false, date: new Date(year, month + 1, d) });
    }
    return cells;
  }, [year, month]);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToday   = () => setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));

  const getDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const isToday = (date) =>
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  // Legend counts
  const counts = useMemo(() => {
    const c = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
    tasks.forEach(t => { if (t.due_date && c[t.status] !== undefined) c[t.status]++; });
    return c;
  }, [tasks]);

  const selectedTasks = selectedDay ? (taskMap[getDateKey(selectedDay.date)] || []) : [];
  const selectedLabel = selectedDay
    ? selectedDay.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div className="rounded-3xl overflow-hidden animate-fadeUp" style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(255,255,255,0.95)",
      boxShadow: "0 8px 32px rgba(79,70,229,0.08)"
    }}>
      {/* ── Header ── */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-0.5">Vue calendrier</p>
            <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              {MONTHS[month]} <span style={{ background: accent, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{year}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={goToday}
              className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
              style={{ background: "rgba(79,70,229,0.08)", color: "#4f46e5" }}
            >
              Aujourd'hui
            </button>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all hover:bg-indigo-50">
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all hover:bg-indigo-50">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.dot }} />
              {cfg.label}
              <span className="font-bold" style={{ color: cfg.color }}>({counts[key]})</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Day headers ── */}
      <div className="grid grid-cols-7 px-4 pb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-gray-400 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-7 gap-px px-4 pb-5" style={{ background: "transparent" }}>
        {calendarDays.map((cell, idx) => {
          const key = getDateKey(cell.date);
          const dayTasks = taskMap[key] || [];
          const isTodayCell = isToday(cell.date);
          const hasOverflow = dayTasks.length > 2;

          // Dominant status for background tint
          const statusPriority = ["IN_PROGRESS", "TODO", "DONE"];
          const dominant = statusPriority.find(s => dayTasks.some(t => t.status === s));
          const domCfg = dominant ? STATUS_CONFIG[dominant] : null;

          return (
            <div
              key={idx}
              onClick={() => dayTasks.length > 0 && setSelectedDay(cell)}
              className="min-h-[88px] rounded-2xl p-1.5 transition-all duration-200 relative"
              style={{
                background: isTodayCell
                  ? "rgba(79,70,229,0.06)"
                  : dayTasks.length > 0
                    ? `${domCfg?.bg}`
                    : "transparent",
                border: isTodayCell
                  ? "1.5px solid rgba(79,70,229,0.3)"
                  : dayTasks.length > 0
                    ? `1px solid ${domCfg?.border}`
                    : "1px solid transparent",
                opacity: cell.currentMonth ? 1 : 0.35,
                cursor: dayTasks.length > 0 ? "pointer" : "default",
              }}
              onMouseEnter={e => {
                if (dayTasks.length > 0) {
                  e.currentTarget.style.transform = "scale(1.03)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.15)";
                  e.currentTarget.style.zIndex = "5";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.zIndex = "0";
              }}
            >
              {/* Day number */}
              <div className="flex justify-end mb-1">
                <span
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold transition-all"
                  style={isTodayCell ? {
                    background: accent,
                    color: "white",
                    boxShadow: "0 2px 8px rgba(79,70,229,0.35)"
                  } : {
                    color: cell.currentMonth ? "#475569" : "#cbd5e1"
                  }}
                >
                  {cell.day}
                </span>
              </div>

              {/* Task pills */}
              <div className="space-y-0.5">
                {dayTasks.slice(0, 2).map(task => {
                  const s = STATUS_CONFIG[task.status] || STATUS_CONFIG.TODO;
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg"
                      style={{ background: s.bg, border: `1px solid ${s.border}` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                      <span className="text-[9px] font-bold truncate" style={{ color: s.color }}>
                        {task.title}
                      </span>
                    </div>
                  );
                })}
                {hasOverflow && (
                  <div className="px-1.5 py-0.5 rounded-lg text-[9px] font-bold text-center" style={{
                    background: "rgba(79,70,229,0.08)",
                    color: "#6366f1"
                  }}>
                    +{dayTasks.length - 2} autres
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popover */}
      {selectedDay && (
        <DayPopover
          tasks={selectedTasks}
          dateLabel={selectedLabel}
          
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};

export default CalendarView;