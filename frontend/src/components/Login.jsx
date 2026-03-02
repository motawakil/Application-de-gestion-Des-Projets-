import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(credentials);
    if (data.access) {
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      navigate("/dashboard");
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="text-white" size={30} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Bon retour !</h2>
          <p className="text-gray-500 mt-2">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Champ Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
              required
            />
          </div>

          {/* Champ Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
            Se connecter
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Nouveau ici ?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;