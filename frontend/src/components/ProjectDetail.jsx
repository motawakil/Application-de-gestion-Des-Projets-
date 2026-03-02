import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  ArrowLeft, Plus, CheckCircle2, Clock, AlertCircle, 
  Filter, Calendar as CalendarIcon, MoreVertical, Trash2 
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filters, setFilters] = useState({ status: "", priority: "" });

  // État pour la nouvelle tâche
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    due_date: ""
  });

  useEffect(() => {
    fetchProjectDetails();
  }, [id, filters]); // Recharge si l'ID ou les filtres changent

  const fetchProjectDetails = async () => {
    try {
      // 1. Récupérer le projet
      const projectRes = await api.get(`/projects/${id}/`);
      setProject(projectRes.data);

      // 2. Récupérer les tâches avec filtres
      let url = `/tasks/?project=${id}`;
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.priority) url += `&priority=${filters.priority}`;
      
      const tasksRes = await api.get(url);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error(err);
      navigate("/dashboard");
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks/", { ...newTask, project: id });
      setShowTaskForm(false);
      setNewTask({ title: "", description: "", status: "TODO", priority: "MEDIUM", due_date: "" });
      fetchProjectDetails();
    } catch (err) { console.error(err); }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm("Supprimer cette tâche ?")) {
      await api.delete(`/tasks/${taskId}/`);
      fetchProjectDetails();
    }
  };

  if (!project) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Retour et Titre */}
        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-6">
          <ArrowLeft size={20} /> Retour au Dashboard
        </button>

        <div className="bg-white p-8 rounded-3xl shadow-sm border mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-500 mt-2">{project.description}</p>
            </div>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition"
            >
              <Plus size={20} /> Nouvelle Tâche
            </button>
          </div>

          {/* Filtres Bar */}
          <div className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Filter size={16} /> Filtrer par :
            </div>
            <select 
              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">Tous les statuts</option>
              <option value="TODO">À faire</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="DONE">Terminé</option>
            </select>
            <select 
              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
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
        <div className="space-y-4">
          {tasks.length > 0 ? tasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-2xl border flex items-center justify-between hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${task.status === 'DONE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {task.status === 'DONE' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{task.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-600' : 
                      task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <CalendarIcon size={12} /> {task.due_date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2">
                <Trash2 size={18} />
              </button>
            </div>
          )) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
              Aucune tâche trouvée avec ces critères.
            </div>
          )}
        </div>
      </div>

      {/* Modal Ajout Tâche */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6">Nouvelle tâche</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input 
                type="text" placeholder="Titre" required
                className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <textarea 
                placeholder="Description"
                className="w-full p-3 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400"
                value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <select 
                   className="p-3 border rounded-xl bg-gray-50"
                   value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}
                >
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminé</option>
                </select>
                <select 
                   className="p-3 border rounded-xl bg-gray-50"
                   value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="LOW">Faible</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Élevée</option>
                </select>
              </div>
              <input 
                type="date"
                className="w-full p-3 border rounded-xl bg-gray-50"
                value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})}
              />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowTaskForm(false)} className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition">Annuler</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;