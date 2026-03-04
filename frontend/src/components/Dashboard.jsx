import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject, getMe, updateProject } from "../services/api";
import api from "../services/api";
import { 
  PlusCircle, Trash2, Folder, Layout, 
  LogOut, Calendar, Edit2, Zap, ChevronRight,
  LayoutGrid, CalendarDays
} from "lucide-react";
import CalendarView from "./CalendarView";

const accent = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [projects, setProjects] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [view, setView]         = useState("grid"); // "grid" | "calendar"
  const [newProject, setNewProject]         = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, projectsData] = await Promise.all([getMe(), getProjects()]);
        setUser(userData);
        const projs = projectsData.data;
        setProjects(projs);
        await loadAllTasks(projs);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const loadAllTasks = async (projs) => {
    const taskRequests = projs.map(p =>
      api.get(`/tasks/?project=${p.id}`).then(res =>
        res.data.map(t => ({ ...t, project_name: p.name }))
      ).catch(() => [])
    );
    const taskArrays = await Promise.all(taskRequests);
    setAllTasks(taskArrays.flat());
  };

  const refreshAll = async () => {
    const res = await getProjects();
    const projs = res.data;
    setProjects(projs);
    await loadAllTasks(projs);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, newProject);
      } else {
        await createProject(newProject);
      }
      setNewProject({ name: "", description: "" });
      setEditingProject(null);
      setShowForm(false);
      await refreshAll();
    } catch (err) { console.error("Erreur lors de la sauvegarde :", err); }
  };

  const handleEditClick = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce projet et toutes ses tâches ?")) {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setAllTasks(prev => prev.filter(t => t.project !== id));
    }
  };

  const tasksWithDate = allTasks.filter(t => !!t.due_date);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f2f8" }}>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 60%)"
      }} />

      {/* ── HEADER ── */}
      <header style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.9)",
        boxShadow: "0 1px 20px rgba(79,70,229,0.07)",
        position: "sticky", top: 0, zIndex: 20
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent }}>
              <Zap size={17} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              ProjectFlow
            </span>
          </div>

          <div className="flex items-center gap-5">
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: accent }}>
                  {user.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 leading-none">{user.username}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                </div>
              </div>
            )}
            <div className="w-px h-8 bg-gray-100" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">

        {/* Page title + controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-5">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Tableau de bord</p>
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
              {view === "grid" ? "Mes Projets" : "Calendrier"}
            </h2>
            <p className="text-gray-400 mt-1 text-sm">
              {view === "grid"
                ? `${projects.length} projet${projects.length !== 1 ? "s" : ""} actif${projects.length !== 1 ? "s" : ""}`
                : `${tasksWithDate.length} tâche${tasksWithDate.length !== 1 ? "s" : ""} planifiée${tasksWithDate.length !== 1 ? "s" : ""}`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle */}
            <div className="flex items-center p-1 rounded-2xl gap-1" style={{
              background: "rgba(255,255,255,0.88)",
              border: "1.5px solid rgba(79,70,229,0.12)",
              boxShadow: "0 2px 8px rgba(79,70,229,0.06)"
            }}>
              {[
                { id: "grid",     icon: <LayoutGrid size={15} />,   label: "Projets"     },
                { id: "calendar", icon: <CalendarDays size={15} />, label: "Calendrier"  },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setView(tab.id); setShowForm(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative"
                  style={view === tab.id ? {
                    background: accent, color: "white",
                    boxShadow: "0 4px 12px rgba(79,70,229,0.3)"
                  } : { color: "#94a3b8" }}
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

            {/* New project — only in grid view */}
            {view === "grid" && (
              <button
                onClick={() => {
                  if (showForm) { setEditingProject(null); setNewProject({ name: "", description: "" }); }
                  setShowForm(!showForm);
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
                style={showForm ? {
                  background: "#e2e8f0", color: "#64748b"
                } : {
                  background: accent, color: "white",
                  boxShadow: "0 8px 24px rgba(79,70,229,0.3)"
                }}
              >
                <PlusCircle size={18} />
                {showForm ? "Annuler" : "Nouveau Projet"}
              </button>
            )}
          </div>
        </div>

        {/* ── CALENDAR VIEW ── */}
        {view === "calendar" && <CalendarView tasks={allTasks} />}

        {/* ── GRID VIEW ── */}
        {view === "grid" && (
          <>
            {showForm && (
              <div className="mb-10 rounded-3xl p-8 max-w-2xl animate-scaleIn" style={{
                background: "rgba(255,255,255,0.9)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 20px 40px rgba(79,70,229,0.1)"
              }}>
                <h3 className="font-bold text-gray-800 text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {editingProject ? `Modifier "${editingProject.name}"` : "Nouveau projet"}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Nom du projet</label>
                    <input
                      type="text" placeholder="Ex: Refonte site web" required
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                      style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Description</label>
                    <textarea
                      placeholder="Décrivez la mission de ce projet…" rows="3"
                      className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all resize-none"
                      style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-3 pt-1">
                    {editingProject && (
                      <button type="button"
                        onClick={() => { setShowForm(false); setEditingProject(null); setNewProject({ name: "", description: "" }); }}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm"
                        style={{ background: "#f1f5f9", color: "#64748b" }}
                      >Annuler</button>
                    )}
                    <button type="submit"
                      className="flex-[2] py-3 rounded-2xl font-bold text-sm text-white active:scale-95 transition-all"
                      style={{ background: accent, boxShadow: "0 8px 20px rgba(79,70,229,0.3)" }}
                    >
                      {editingProject ? "Enregistrer les modifications" : "Lancer le projet →"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
              {projects.length > 0 ? projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="group cursor-pointer rounded-3xl p-6 transition-all duration-300 animate-fadeUp"
                  style={{
                    background: "rgba(255,255,255,0.88)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.95)",
                    boxShadow: "0 4px 16px rgba(79,70,229,0.05)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(79,70,229,0.14)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
                      background: "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.08))"
                    }}>
                      <Folder size={22} style={{ color: "#4f46e5" }} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => handleEditClick(e, project)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-500"
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      ><Edit2 size={15} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500"
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      ><Trash2 size={15} /></button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
                    {project.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5">
                    {project.description || "Aucune description."}
                  </p>

                  <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                      <Calendar size={12} />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Ouvrir <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-24 text-center flex flex-col items-center animate-fadeUp">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: "rgba(79,70,229,0.07)" }}>
                    <Layout size={36} style={{ color: "#c7d2fe" }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>Aucun projet actif</h3>
                  <p className="text-gray-400 text-sm">Commencez par créer votre premier espace de travail.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;