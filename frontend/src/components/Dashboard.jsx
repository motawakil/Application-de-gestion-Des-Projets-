import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/api"; // Importation de notre nouvelle fonction

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe();
        setUser(data);
      } catch (err) {
        // Le refresh a échoué ou l'utilisateur n'est pas connecté
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Bonjour, <span className="text-blue-600">{user.username}</span> ! 🚀
        </h1>
        <p className="text-gray-500 mb-8 italic">{user.email}</p>
        
        <div className="space-y-4">
          <p className="text-green-600 font-medium">✓ Session Authentifiée avec JWT</p>
          <button 
            onClick={handleLogout}
            className="px-8 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;