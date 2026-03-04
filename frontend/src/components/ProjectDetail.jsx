import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, 
  Filter, Calendar as CalendarIcon, Trash2, Edit2, Zap
} from "lucide-react";
import { getHolidays } from "../services/holidayService";

const PRIORITY_STYLES = {
  HIGH:   { bg: "rgba(239,68,68,0.08)",   color: "#dc2626",  border: "rgba(239,68,68,0.2)",   label: "Élevée" },
  MEDIUM: { bg: "rgba(79,70,229,0.08)",   color: "#4f46e5",  border: "rgba(79,70,229,0.2)",   label: "Moyenne" },
  LOW:    { bg: "rgba(100,116,139,0.08)", color: "#64748b",  border: "rgba(100,116,139,0.2)", label: "Faible" },
};

const STATUS_STYLES = {
  DONE:        { bg: "rgba(16,185,129,0.08)", color: "#10b981" },
  IN_PROGRESS: { bg: "rgba(245,158,11,0.08)", color: "#f59e0b" },
  TODO:        { bg: "rgba(100,116,139,0.08)", color: "#94a3b8" },
};

const accent = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });
  const [holidays, setHolidays] = useState([]);
  const [isHolidayWarning, setIsHolidayWarning] = useState(null);

  const [currentTask, setCurrentTask] = useState({
    title: "", description: "", status: "TODO", priority: "MEDIUM", due_date: ""
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const loadHolidays = async () => {
      const data = await getHolidays('FR');
      setHolidays(data);
    };
    loadHolidays();
    fetchProjectDetails();
  }, [id, filters]);

  const fetchProjectDetails = async () => {
    try {
      const projectRes = await api.get(`/projects/${id}/`);
      setProject(projectRes.data);
      let url = `/tasks/?project=${id}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.priority) url += `&priority=${filters.priority}`;
      const tasksRes = await api.get(url);
      setTasks(tasksRes.data);
    } catch (err) {
      navigate("/dashboard");
    }
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await api.patch(`/tasks/${editingTaskId}/`, currentTask);
      } else {
        await api.post("/tasks/", { ...currentTask, project: id });
      }
      closeModal();
      fetchProjectDetails();
    } catch (err) { console.error(err); }
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setCurrentTask({
      title: task.title, description: task.description || "",
      status: task.status, priority: task.priority, due_date: task.due_date || ""
    });
    setShowTaskForm(true);
  };

  const closeModal = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    setIsHolidayWarning(null);
    setCurrentTask({ title: "", description: "", status: "TODO", priority: "MEDIUM", due_date: "" });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      await api.delete(`/tasks/${taskId}/`);
      fetchProjectDetails();
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setCurrentTask({ ...currentTask, due_date: selectedDate });
    const holiday = holidays.find(h => h.date === selectedDate);
    if (holiday) {
      setIsHolidayWarning(`${new Date(selectedDate).toLocaleDateString()} est un jour férié (${holiday.localName})`);
    } else {
      setIsHolidayWarning(null);
    }
  };

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f0f2f8" }}>
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm font-medium">Chargement…</p>
      </div>
    </div>
  );

  const doneTasks = tasks.filter(t => t.status === 'DONE').length;
  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#f0f2f8" }}>
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Back */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-indigo-500 transition-colors mb-7"
        >
          <ArrowLeft size={16} /> Retour au Dashboard
        </button>

        {/* Project Header Card */}
        <div className="rounded-3xl p-8 mb-6 animate-fadeUp" style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 8px 32px rgba(79,70,229,0.08)"
        }}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-5">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: accent }}>
                  <Zap size={13} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Projet</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
                {project.name}
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{project.description}</p>

              {/* Progress */}
              {tasks.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between items-center mb-2 text-xs font-semibold text-gray-400">
                    <span>{doneTasks}/{tasks.length} tâches terminées</span>
                    <span style={{ color: "#4f46e5" }}>{progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(79,70,229,0.1)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{
                      width: `${progress}%`,
                      background: accent
                    }} />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 whitespace-nowrap"
              style={{ background: accent, boxShadow: "0 8px 20px rgba(79,70,229,0.3)" }}
            >
              <Plus size={17} /> Nouvelle Tâche
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mt-7 pt-6" style={{ borderTop: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
              <Filter size={13} /> Filtrer :
            </div>
            {[
              {
                key: "status",
                options: [
                  { value: "", label: "Tous statuts" },
                  { value: "TODO", label: "À faire" },
                  { value: "IN_PROGRESS", label: "En cours" },
                  { value: "DONE", label: "Terminé" },
                ]
              },
              {
                key: "priority",
                options: [
                  { value: "", label: "Toutes priorités" },
                  { value: "LOW", label: "Faible" },
                  { value: "MEDIUM", label: "Moyenne" },
                  { value: "HIGH", label: "Élevée" },
                ]
              }
            ].map(({ key, options }) => (
              <select
                key={key}
                className="text-sm font-medium rounded-xl px-4 py-2 transition-all"
                style={{
                  background: "#f8faff",
                  border: "1.5px solid #e8eaf6",
                  color: "#475569",
                  outline: "none"
                }}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              >
                {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3 stagger">
          {tasks.length > 0 ? tasks.map(task => {
            const pStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.MEDIUM;
            const sStyle = STATUS_STYLES[task.status] || STATUS_STYLES.TODO;
            return (
              <div
                key={task.id}
                className="group rounded-2xl p-5 flex items-center justify-between transition-all duration-200 animate-fadeUp"
                style={{
                  background: "rgba(255,255,255,0.88)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 2px 8px rgba(79,70,229,0.04)"
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.1)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px rgba(79,70,229,0.04)"}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: sStyle.bg }}>
                    {task.status === 'DONE'
                      ? <CheckCircle2 size={19} style={{ color: sStyle.color }} />
                      : <Clock size={19} style={{ color: sStyle.color }} />
                    }
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider" style={{
                        background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}`
                      }}>
                        {pStyle.label}
                      </span>
                      {task.due_date && (
                        <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                          <CalendarIcon size={11} />
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-500 transition-all"
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="text-center py-20 rounded-3xl animate-fadeUp" style={{
              background: "rgba(255,255,255,0.6)",
              border: "2px dashed rgba(79,70,229,0.15)"
            }}>
              <p className="text-gray-400 font-medium text-sm">Aucune tâche trouvée pour ce projet.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL ── */}
      {showTaskForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-fadeIn"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="w-full max-w-md rounded-3xl p-8 animate-scaleIn" style={{
            background: "rgba(255,255,255,0.97)",
            boxShadow: "0 30px 60px rgba(15,23,42,0.25)"
          }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Syne', sans-serif" }}>
              {editingTaskId ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>

            <form onSubmit={handleSaveTask} className="space-y-4">
              {[
                { key: "title", label: "Titre", type: "input", placeholder: "Ex: Finir le design", required: true },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    required
                    className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                    style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
                    value={currentTask[key]}
                    onChange={e => setCurrentTask({ ...currentTask, [key]: e.target.value })}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                <textarea
                  placeholder="Détails de la mission…"
                  rows="3"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all resize-none"
                  style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
                  value={currentTask.description}
                  onChange={e => setCurrentTask({ ...currentTask, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "status", label: "Statut",
                    options: [{ value: "TODO", label: "À faire" }, { value: "IN_PROGRESS", label: "En cours" }, { value: "DONE", label: "Terminé" }]
                  },
                  {
                    key: "priority", label: "Priorité",
                    options: [{ value: "LOW", label: "Faible" }, { value: "MEDIUM", label: "Moyenne" }, { value: "HIGH", label: "Élevée" }]
                  }
                ].map(({ key, label, options }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                    <select
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                      style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
                      value={currentTask[key]}
                      onChange={e => setCurrentTask({ ...currentTask, [key]: e.target.value })}
                    >
                      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Date limite (optionnel)</label>
                <input
                  type="date"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: isHolidayWarning ? "rgba(245,158,11,0.05)" : "#f8faff",
                    border: isHolidayWarning ? "1.5px solid rgba(245,158,11,0.5)" : "1.5px solid #e8eaf6",
                    color: "#1e293b"
                  }}
                  value={currentTask.due_date}
                  onChange={handleDateChange}
                />
                {isHolidayWarning && (
                  <div className="flex items-center gap-2 mt-2 px-4 py-2.5 rounded-2xl text-xs font-semibold animate-fadeUp" style={{
                    background: "rgba(245,158,11,0.08)",
                    border: "1px solid rgba(245,158,11,0.2)",
                    color: "#d97706"
                  }}>
                    <AlertCircle size={14} className="shrink-0" />
                    {isHolidayWarning}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all"
                  style={{ background: "#f1f5f9", color: "#64748b" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] py-3.5 rounded-2xl font-bold text-sm text-white transition-all active:scale-95"
                  style={{ background: accent, boxShadow: "0 8px 20px rgba(79,70,229,0.3)" }}
                >
                  {editingTaskId ? "Mettre à jour" : "Créer la tâche"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;