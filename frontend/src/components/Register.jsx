import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await registerUser(formData);
      if (data.id) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
      }
    } catch (err) {
      setError("Ce nom d'utilisateur ou cet email est déjà utilisé.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Écran de succès ──────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6">
            <CheckCircle2 className="text-emerald-500" size={42} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Compte créé avec succès !</h2>
          <p className="text-gray-500 mb-6">
            Bienvenue <span className="font-semibold text-emerald-600">{formData.username}</span> 🎉<br />
            Vous allez être redirigé vers la page de connexion…
          </p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full animate-progress" />
          </div>
          <p className="text-xs text-gray-400 mt-3">Redirection dans 2 secondes</p>
        </div>
      </div>
    );
  }

  // ── Formulaire ───────────────────────────────────────────────
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

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="relative">
            <User className={`absolute left-3 top-3 ${error ? "text-red-400" : "text-gray-400"}`} size={20} />
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50
                ${error ? "border-red-300 focus:ring-red-400 bg-red-50" : "border-gray-200 focus:ring-emerald-500"}`}
              required
            />
          </div>

          <div className="relative">
            <Mail className={`absolute left-3 top-3 ${error ? "text-red-400" : "text-gray-400"}`} size={20} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50
                ${error ? "border-red-300 focus:ring-red-400 bg-red-50" : "border-gray-200 focus:ring-emerald-500"}`}
              required
            />
          </div>

          <div className="relative">
            <Lock className={`absolute left-3 top-3 ${error ? "text-red-400" : "text-gray-400"}`} size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50
                ${error ? "border-red-300 focus:ring-red-400 bg-red-50" : "border-gray-200 focus:ring-emerald-500"}`}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-emerald-200 transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Création en cours…
              </>
            ) : (
              "Créer mon compte"
            )}
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