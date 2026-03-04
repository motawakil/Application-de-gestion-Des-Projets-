import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Zap } from "lucide-react";

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

  const pageStyle = {
    background: "linear-gradient(135deg, #e8eaf6 0%, #f3e8ff 50%, #e0f2fe 100%)"
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={pageStyle}>
        <div className="w-full max-w-md animate-scaleIn relative z-10">
          <div className="rounded-3xl p-10 text-center shadow-2xl" style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 25px 50px rgba(16,185,129,0.12)"
          }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float" style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))",
              border: "2px solid rgba(16,185,129,0.3)"
            }}>
              <CheckCircle2 size={38} style={{ color: "#10b981" }} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Compte créé !
            </h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Bienvenue <span className="font-semibold" style={{ color: "#10b981" }}>{formData.username}</span> 🎉<br />
              Redirection vers la connexion…
            </p>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(16,185,129,0.12)" }}>
              <div className="h-full rounded-full animate-progress" style={{ background: "linear-gradient(90deg, #10b981, #059669)" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={pageStyle}>
      <div className="fixed top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-25 pointer-events-none" style={{
        background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
        filter: "blur(60px)"
      }} />

      <div className="w-full max-w-md animate-fadeUp relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg" style={{
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)"
            }}>
              <Zap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-800 text-xl" style={{ fontFamily: "'Syne', sans-serif" }}>ProjectFlow</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>Rejoignez-nous</h2>
          <p className="text-gray-500 text-sm">Créez votre profil en quelques secondes</p>
        </div>

        <div className="rounded-3xl p-8 shadow-2xl" style={{
          background: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.95)",
          boxShadow: "0 25px 50px rgba(79,70,229,0.12)"
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
            {[
              { name: "username", type: "text", placeholder: "votre_pseudo", label: "Nom d'utilisateur", Icon: User },
              { name: "email", type: "email", placeholder: "vous@email.com", label: "Adresse email", Icon: Mail },
            ].map(({ name, type, placeholder, label, Icon }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    name={name}
                    type={type}
                    placeholder={placeholder}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
                    style={{
                      background: error ? "rgba(239,68,68,0.05)" : "#f8faff",
                      border: error ? "1.5px solid rgba(239,68,68,0.35)" : "1.5px solid #e8eaf6",
                      color: "#1e293b"
                    }}
                    required
                  />
                </div>
              </div>
            ))}

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Mot de passe</label>
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
                    border: error ? "1.5px solid rgba(239,68,68,0.35)" : "1.5px solid #e8eaf6",
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
                  Création en cours…
                </>
              ) : (
                <><UserPlus size={16} /> Créer mon compte</>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-semibold hover:underline" style={{ color: "#4f46e5" }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;