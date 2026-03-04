import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/api";
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle, Zap } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (error) setError("");
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
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: "linear-gradient(135deg, #e8eaf6 0%, #f3e8ff 50%, #e0f2fe 100%)"
    }}>
      {/* Decorative blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-96 h-96 rounded-full opacity-30 pointer-events-none" style={{
        background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
        filter: "blur(60px)"
      }} />
      <div className="fixed bottom-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-20 pointer-events-none" style={{
        background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
        filter: "blur(60px)"
      }} />

      <div className="w-full max-w-md animate-fadeUp relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)"
            }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>ProjectFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Bon retour !</h2>
          <p className="text-gray-500 text-sm">Connectez-vous à votre espace de travail</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8 shadow-2xl" style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 25px 50px rgba(79,70,229,0.12), 0 0 0 1px rgba(255,255,255,0.8)"
        }}>

          {error && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 text-sm font-medium animate-fadeUp" style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#dc2626"
            }}>
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  name="username"
                  type="text"
                  placeholder="votre_pseudo"
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: error ? "rgba(239,68,68,0.05)" : "#f8faff",
                    border: error ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid #e8eaf6",
                    color: "#1e293b"
                  }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3.5 rounded-2xl text-sm font-medium transition-all"
                  style={{
                    background: error ? "rgba(239,68,68,0.05)" : "#f8faff",
                    border: error ? "1.5px solid rgba(239,68,68,0.4)" : "1.5px solid #e8eaf6",
                    color: "#1e293b"
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white mt-2 flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{
                background: isLoading
                  ? "linear-gradient(135deg, #a5b4fc, #c4b5fd)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                boxShadow: isLoading ? "none" : "0 8px 24px rgba(79,70,229,0.35)",
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Connexion...
                </>
              ) : (
                <><LogIn size={16} /> Se connecter</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Nouveau ici ?{" "}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: "#4f46e5" }}>
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;