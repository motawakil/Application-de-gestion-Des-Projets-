import React from "react";
import { Folder, Calendar } from "lucide-react";
import { PRIORITY_STYLES, STATUS_CONFIG, isOverdue } from "./constants";

const COLUMNS = ["TODO", "IN_PROGRESS", "DONE"];

const KanbanView = ({ tasks, navigate }) => (
  <div className="animate-fadeUp">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {COLUMNS.map(status => {
        const conf       = STATUS_CONFIG[status];
        const StatusIcon = conf.icon;
        const colTasks   = tasks.filter(t => t.status === status);

        return (
          <div key={status} className="flex flex-col rounded-3xl overflow-hidden" style={{
            background: "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 4px 16px rgba(79,70,229,0.05)"
          }}>

            {/* Column header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: conf.headerBg }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: conf.bg }}>
                  <StatusIcon size={16} style={{ color: conf.color }} />
                </div>
                <p className="font-bold text-sm text-gray-800" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {conf.label}
                </p>
              </div>
              <span className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold" style={{
                background: conf.bg, color: conf.color
              }}>
                {colTasks.length}
              </span>
            </div>

            {/* Accent line */}
            <div className="h-0.5 w-full" style={{ background: conf.accent, opacity: 0.4 }} />

            {/* Cards */}
            <div className="flex-1 p-3 space-y-3 overflow-y-auto" style={{ maxHeight: "calc(100vh - 360px)", minHeight: "200px" }}>
              {colTasks.length > 0 ? colTasks.map((task, i) => {
                const pStyle  = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;
                const overdue = isOverdue(task);

                return (
                  <div
                    key={task.id}
                    className="group rounded-2xl p-4 transition-all duration-200 cursor-pointer"
                    style={{
                      background: "rgba(255,255,255,0.95)",
                      border: overdue ? "1px solid rgba(239,68,68,0.25)" : "1px solid rgba(255,255,255,0.95)",
                      boxShadow: "0 2px 8px rgba(79,70,229,0.05)",
                      animationDelay: `${i * 50}ms`
                    }}
                    onClick={() => navigate(`/projects/${task.project}`)}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(79,70,229,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.05)";  e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    {/* Priority + overdue */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider" style={{
                        background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}`
                      }}>
                        {pStyle.label}
                      </span>
                      {overdue && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                          En retard
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-sm text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                        {task.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/projects/${task.project}`); }}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <Folder size={10} />
                        <span className="max-w-[90px] truncate">{task.project_name}</span>
                      </button>
                      {task.due_date && (
                        <span className={`flex items-center gap-1 text-[11px] font-medium ${overdue ? "text-red-400" : "text-gray-400"}`}>
                          <Calendar size={10} />
                          {new Date(task.due_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: conf.bg }}>
                    <StatusIcon size={18} style={{ color: conf.color, opacity: 0.5 }} />
                  </div>
                  <p className="text-xs text-gray-400 font-medium">Aucune tâche</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default KanbanView;