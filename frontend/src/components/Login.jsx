import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError(""); // Efface l'erreur dès que l'user retape
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await loginUser(credentials);
      if (data.access) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);
        navigate("/dashboard");
      } else {
        setError("Identifiants incorrects. Veuillez réessayer.");
      }
    } catch (err) {
      setError("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
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

          {/* Message d'erreur */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-pulse-once">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Champ Username */}
          <div className="relative">
            <User className={`absolute left-3 top-3 ${error ? "text-red-400" : "text-gray-400"}`} size={20} />
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50
                ${error
                  ? "border-red-300 focus:ring-red-400 bg-red-50"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
              required
            />
          </div>

          {/* Champ Password */}
          <div className="relative">
            <Lock className={`absolute left-3 top-3 ${error ? "text-red-400" : "text-gray-400"}`} size={20} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all bg-gray-50
                ${error
                  ? "border-red-300 focus:ring-red-400 bg-red-50"
                  : "border-gray-200 focus:ring-blue-500"
                }`}
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
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