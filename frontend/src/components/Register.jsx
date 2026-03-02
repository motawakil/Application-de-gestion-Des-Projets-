import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await registerUser(formData);
    if (data.id) {
      alert("Bienvenue ! Votre compte est créé.");
      navigate("/login");
    } else {
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="text-white" size={30} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Rejoignez-nous</h2>
          <p className="text-gray-500 mt-2">Créez votre profil en quelques secondes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-gray-50"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-emerald-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 mt-4">
            Créer mon compte
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;