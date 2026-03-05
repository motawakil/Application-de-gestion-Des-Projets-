import React, { useState } from "react";
import { List, Folder, Calendar, ArrowRight } from "lucide-react";
import { accent, PRIORITY_STYLES, STATUS_CONFIG, isOverdue } from "./constants";

const ListView = ({ tasks, navigate }) => {
  const [sortBy, setSortBy]             = useState("due_date");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const filtered = tasks
    .filter(t => !filterStatus   || t.status   === filterStatus)
    .filter(t => !filterPriority || t.priority === filterPriority)
    .sort((a, b) => {
      if (sortBy === "due_date") {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      }
      if (sortBy === "priority") {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      }
      if (sortBy === "status") {
        const order = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
        return (order[a.status] ?? 0) - (order[b.status] ?? 0);
      }
      return 0;
    });

  return (
    <div className="animate-fadeUp">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-2xl" style={{
        background: "rgba(255,255,255,0.88)",
        border: "1px solid rgba(255,255,255,0.95)",
        boxShadow: "0 2px 8px rgba(79,70,229,0.05)"
      }}>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1">Filtrer :</span>

        <select
          className="text-sm font-medium rounded-xl px-4 py-2"
          style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#475569", outline: "none" }}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="TODO">À faire</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="DONE">Terminé</option>
        </select>

        <select
          className="text-sm font-medium rounded-xl px-4 py-2"
          style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#475569", outline: "none" }}
          onChange={e => setFilterPriority(e.target.value)}
        >
          <option value="">Toutes priorités</option>
          <option value="HIGH">Élevée</option>
          <option value="MEDIUM">Moyenne</option>
          <option value="LOW">Faible</option>
        </select>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Trier par :</span>
          {[
            { value: "due_date", label: "Date"     },
            { value: "priority", label: "Priorité" },
            { value: "status",   label: "Statut"   },
          ].map(s => (
            <button
              key={s.value}
              onClick={() => setSortBy(s.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
              style={sortBy === s.value
                ? { background: accent, color: "white", boxShadow: "0 4px 10px rgba(79,70,229,0.25)" }
                : { background: "#f1f5f9", color: "#94a3b8" }
              }
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-12 gap-4 px-5 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <div className="col-span-4">Tâche</div>
          <div className="col-span-2">Projet</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2">Priorité</div>
          <div className="col-span-2">Échéance</div>
        </div>
      )}

      {/* Rows */}
      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map((task, i) => {
          const pStyle     = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;
          const sConf      = STATUS_CONFIG[task.status]     || STATUS_CONFIG.TODO;
          const StatusIcon = sConf.icon;
          const overdue    = isOverdue(task);

          return (
            <div
              key={task.id}
              className="group grid grid-cols-12 gap-4 items-center rounded-2xl px-5 py-4 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(12px)",
                border: overdue ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 2px 8px rgba(79,70,229,0.04)",
                animationDelay: `${i * 40}ms`
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.1)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.04)"}
            >
              {/* Title + description */}
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: sConf.bg }}>
                  <StatusIcon size={15} style={{ color: sConf.color }} />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]">{task.description}</p>
                  )}
                </div>
              </div>

              {/* Project link */}
              <div className="col-span-2">
                <button
                  onClick={() => navigate(`/projects/${task.project}`)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-600 transition-colors"
                >
                  <Folder size={11} />
                  <span className="truncate max-w-[90px]">{task.project_name}</span>
                  <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{
                  background: sConf.bg, color: sConf.color
                }}>
                  <StatusIcon size={10} />
                  {sConf.label}
                </span>
              </div>

              {/* Priority */}
              <div className="col-span-2">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider" style={{
                  background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}`
                }}>
                  {pStyle.label}
                </span>
              </div>

              {/* Due date */}
              <div className="col-span-2">
                {task.due_date ? (
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${overdue ? "text-red-500" : "text-gray-400"}`}>
                    <Calendar size={11} />
                    {new Date(task.due_date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    {overdue && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: "rgba(239,68,68,0.1)", color: "#dc2626" }}>
                        En retard
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="text-xs text-gray-300 font-medium">—</span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-20 rounded-3xl" style={{
            background: "rgba(255,255,255,0.6)",
            border: "2px dashed rgba(79,70,229,0.15)"
          }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(79,70,229,0.07)" }}>
              <List size={28} style={{ color: "#c7d2fe" }} />
            </div>
            <p className="text-gray-400 font-medium text-sm">Aucune tâche trouvée.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;