import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject, deleteProject, getMe } from "../services/api";
import { 
  PlusCircle, Trash2, Folder, Layout, 
  LogOut, User as UserIcon, Calendar, Briefcase 
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, projectsData] = await Promise.all([
          getMe(),
          getProjects()
        ]);
        setUser(userData);
        setProjects(projectsData.data);
      } catch (err) {
        navigate("/login");
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await createProject(newProject);
      setNewProject({ name: "", description: "" });
      setShowForm(false);
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce projet et toutes ses tâches ?")) {
      await deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- HEADER --- */}
      <header className="bg-white border-b sticky top-0 z-10 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Briefcase className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">ProjectFlow</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 border-r pr-6 mr-2">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                <UserIcon size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-gray-800 leading-none">{user?.username}</p>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors font-medium text-sm"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="p-6 md:p-10 max-w-7xl mx-auto w-full flex-grow">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Tableau de bord</h2>
            <p className="text-gray-500 mt-1">Gérez vos projets et suivez vos tâches en temps réel.</p>
          </div>
          
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition shadow-lg shadow-blue-200 active:scale-95"
          >
            <PlusCircle size={20} />
            <span className="font-semibold">{showForm ? "Annuler" : "Nouveau Projet"}</span>
          </button>
        </div>

        {/* --- FORMULAIRE --- */}
        {showForm && (
          <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-blue-50 animate-fadeIn max-w-2xl mx-auto">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Détails du projet</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <input
                type="text"
                placeholder="Nom du projet"
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition"
                value={newProject.name}
                onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                required
              />
              <textarea
                placeholder="Quelle est la mission de ce projet ?"
                className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 transition"
                value={newProject.description}
                onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                rows="3"
              />
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-md">
                Lancer le projet
              </button>
            </form>
          </div>
        )}

        {/* --- LISTE DES PROJETS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Folder size={26} />
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }} 
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {project.description || "Aucune description."}
                </p>
                
                <div className="flex items-center text-xs text-gray-400 gap-2 border-t pt-4 font-medium uppercase tracking-wider">
                   <Calendar size={14} /> 
                   <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Layout className="text-gray-300" size={48} />
              </div>
              <h3 className="text-xl font-bold text-gray-400">Aucun projet actif</h3>
              <p className="text-gray-400 mt-1">Commencez par créer votre premier espace de travail.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;