import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject, getMe, updateProject } from "../services/api";
import api from "../services/api";

import DashboardHeader   from "./DashboardHeader";
import DashboardControls from "./DashboardControls";
import ProjectForm       from "./ProjectForm";
import ProjectGrid       from "./ProjectGrid";
import ListView          from "./ListView";
import KanbanView        from "./KanbanView";
import CalendarView      from "./CalendarView";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser]           = useState(null);
  const [projects, setProjects]   = useState([]);
  const [allTasks, setAllTasks]   = useState([]);
  const [view, setView]           = useState("grid"); // "grid" | "list" | "kanban" | "calendar"
  const [showForm, setShowForm]   = useState(false);
  const [newProject, setNewProject]         = useState({ name: "", description: "" });
  const [editingProject, setEditingProject] = useState(null);

  /* ── Data fetching ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, projectsData] = await Promise.all([getMe(), getProjects()]);
        setUser(userData);
        const projs = projectsData.data;
        setProjects(projs);
        await loadAllTasks(projs);
      } catch {
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const loadAllTasks = async (projs) => {
    const requests = projs.map(p =>
      api.get(`/tasks/?project=${p.id}`)
        .then(res => res.data.map(t => ({ ...t, project_name: p.name })))
        .catch(() => [])
    );
    const arrays = await Promise.all(requests);
    setAllTasks(arrays.flat());
  };

  const refreshAll = async () => {
    const res = await getProjects();
    const projs = res.data;
    setProjects(projs);
    await loadAllTasks(projs);
  };

  /* ── Handlers ── */
  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const handleToggleForm = () => {
    if (showForm) { setEditingProject(null); setNewProject({ name: "", description: "" }); }
    setShowForm(prev => !prev);
  };

  const handleViewChange = (id) => { setView(id); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      editingProject
        ? await updateProject(editingProject.id, newProject)
        : await createProject(newProject);
      setNewProject({ name: "", description: "" });
      setEditingProject(null);
      setShowForm(false);
      await refreshAll();
    } catch (err) { console.error("Erreur lors de la sauvegarde :", err); }
  };

  const handleEditProject = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setNewProject({ name: project.name, description: project.description });
    setShowForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Supprimer ce projet et toutes ses tâches ?")) {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setAllTasks(prev => prev.filter(t => t.project !== id));
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setNewProject({ name: "", description: "" });
  };

  const tasksWithDate = allTasks.filter(t => !!t.due_date);

  /* ── Render ── */
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f2f8" }}>
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: "radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 60%)"
      }} />

      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-10">
        <DashboardControls
          view={view}
          onViewChange={handleViewChange}
          projects={projects}
          allTasks={allTasks}
          tasksWithDate={tasksWithDate}
          showForm={showForm}
          onToggleForm={handleToggleForm}
        />

        {/* ── Grid view ── */}
        {view === "grid" && (
          <>
            {showForm && (
              <ProjectForm
                editingProject={editingProject}
                newProject={newProject}
                onChange={setNewProject}
                onSubmit={handleSubmit}
                onCancel={handleCancelForm}
              />
            )}
            <ProjectGrid
              projects={projects}
              onNavigate={navigate}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          </>
        )}

        {/* ── List view ── */}
        {view === "list" && <ListView tasks={allTasks} navigate={navigate} />}

        {/* ── Kanban view ── */}
        {view === "kanban" && <KanbanView tasks={allTasks} navigate={navigate} />}

        {/* ── Calendar view ── */}
        {view === "calendar" && <CalendarView tasks={allTasks} />}
      </main>
    </div>
  );
};

export default Dashboard;