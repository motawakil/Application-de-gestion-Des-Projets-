import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, 
  Filter, Calendar as CalendarIcon, Trash2, Edit2 
} from "lucide-react";
import { getHolidays } from "../services/holidayService"; 


const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  // État pour la tâche (Nouvelle ou en cours d'édition)
  const [currentTask, setCurrentTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    due_date: ""
  });
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
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

  // --- LOGIQUE SAUVEGARDE (CREATE / UPDATE) ---
  const handleSaveTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        // Mode Edition : PATCH
        await api.patch(`/tasks/${editingTaskId}/`, currentTask);
      } else {
        // Mode Création : POST
        await api.post("/tasks/", { ...currentTask, project: id });
      }
      
      closeModal();
      fetchProjectDetails();
    } catch (err) { console.error(err); }
  };

  // --- OUVRIR LE FORMULAIRE EN MODE ÉDITION ---
  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setCurrentTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ""
    });
    setShowTaskForm(true);
  };

  const closeModal = () => {
    setShowTaskForm(false);
    setEditingTaskId(null);
    setCurrentTask({ title: "", description: "", status: "TODO", priority: "MEDIUM", due_date: "" });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      await api.delete(`/tasks/${taskId}/`);
      fetchProjectDetails();
    }
  };

  if (!project) return <div className="p-10 text-center text-gray-500">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6 font-medium">
          <ArrowLeft size={18} /> Retour au Dashboard
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">{project.name}</h1>
              <p className="text-gray-500 mt-2 max-w-2xl">{project.description}</p>
            </div>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 whitespace-nowrap"
            >
              <Plus size={20} /> Nouvelle Tâche
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
              <Filter size={16} /> Filtrer par :
            </div>
            <select 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Tous les statuts</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminé</option>
            </select>
            <select 
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
            >
              <option value="">Toutes les priorités</option>
              <option value="LOW">Faible</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="HIGH">Élevée</option>
            </select>
          </div>
        </div>

        {/* Liste des Tâches */}
        <div className="grid gap-4">
          {tasks.length > 0 ? tasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border border-gray-100 flex items-center justify-between hover:shadow-xl hover:border-blue-100 transition-all group">
              <div className="flex items-center gap-5">
                <div className={`p-3 rounded-2xl ${task.status === 'DONE' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                  {task.status === 'DONE' ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">{task.title}</h4>
                  <div className="flex items-center gap-4 mt-1.5">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                      task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-100' : 
                      task.priority === 'MEDIUM' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'
                    }`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
                        <CalendarIcon size={14} /> {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClick(task)}
                  className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                  title="Modifier"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteTask(task.id)} 
                  className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 font-medium">
              Aucune tâche trouvée pour ce projet.
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajout/Modif Tâche */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingTaskId ? "Modifier la tâche" : "Nouvelle tâche"}
            </h2>
            <form onSubmit={handleSaveTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Titre</label>
                <input 
                  type="text" placeholder="Ex: Finir le design" required
                  className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={currentTask.title} onChange={e => setCurrentTask({...currentTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Description</label>
                <textarea 
                  placeholder="Détails de la mission..." rows="3"
                  className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={currentTask.description} onChange={e => setCurrentTask({...currentTask, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Statut</label>
                  <select 
                    className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-medium"
                    value={currentTask.status} onChange={e => setCurrentTask({...currentTask, status: e.target.value})}
                  >
                    <option value="TODO">À faire</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="DONE">Terminé</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Priorité</label>
                  <select 
                    className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-medium"
                    value={currentTask.priority} onChange={e => setCurrentTask({...currentTask, priority: e.target.value})}
                  >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Élevée</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Date limite (Optionnel)</label>
                <input 
                  type="date"
                  className="w-full p-4 border border-gray-100 rounded-2xl bg-gray-50 font-medium"
                  value={currentTask.due_date} onChange={e => setCurrentTask({...currentTask, due_date: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={closeModal} className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition">
                  Annuler
                </button>
                <button type="submit" className="flex-[1.5] py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition active:scale-95">
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