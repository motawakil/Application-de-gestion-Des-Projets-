import React from "react";
import { LayoutGrid, CalendarDays, List, Kanban, PlusCircle } from "lucide-react";
import { accent } from "./constants";

const TABS = [
  { id: "grid",     icon: <LayoutGrid size={15} />,   label: "Projets"    },
  { id: "list",     icon: <List size={15} />,         label: "Tâches"     },
  { id: "kanban",   icon: <Kanban size={15} />,       label: "Kanban"     },
  { id: "calendar", icon: <CalendarDays size={15} />, label: "Calendrier" },
];

const VIEW_TITLES = {
  grid:     "Mes Projets",
  calendar: "Calendrier",
  list:     "Toutes les Tâches",
  kanban:   "Kanban",
};

const DashboardControls = ({
  view, onViewChange,
  projects, allTasks, tasksWithDate,
  showForm, onToggleForm,
}) => {
  const subtitle =
    view === "grid"
      ? `${projects.length} projet${projects.length !== 1 ? "s" : ""} actif${projects.length !== 1 ? "s" : ""}`
      : view === "calendar"
      ? `${tasksWithDate.length} tâche${tasksWithDate.length !== 1 ? "s" : ""} planifiée${tasksWithDate.length !== 1 ? "s" : ""}`
      : `${allTasks.length} tâche${allTasks.length !== 1 ? "s" : ""} au total`;

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-5">
      {/* Title */}
      <div>
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Tableau de bord</p>
        <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
          {VIEW_TITLES[view]}
        </h2>
        <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Tab toggle */}
        <div className="flex items-center p-1 rounded-2xl gap-1" style={{
          background: "rgba(255,255,255,0.88)",
          border: "1.5px solid rgba(79,70,229,0.12)",
          boxShadow: "0 2px 8px rgba(79,70,229,0.06)"
        }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative"
              style={view === tab.id
                ? { background: accent, color: "white", boxShadow: "0 4px 12px rgba(79,70,229,0.3)" }
                : { color: "#94a3b8" }
              }
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === "calendar" && tasksWithDate.length > 0 && view !== "calendar" && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "#f59e0b" }}>
                  {tasksWithDate.length > 9 ? "9+" : tasksWithDate.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* New project button — grid only */}
        {view === "grid" && (
          <button
            onClick={onToggleForm}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={showForm
              ? { background: "#e2e8f0", color: "#64748b" }
              : { background: accent, color: "white", boxShadow: "0 8px 24px rgba(79,70,229,0.3)" }
            }
          >
            <PlusCircle size={18} />
            {showForm ? "Annuler" : "Nouveau Projet"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardControls;