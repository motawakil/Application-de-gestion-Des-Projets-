import React from "react";
import { LogOut, Zap } from "lucide-react";
import { accent } from "./constants";

const DashboardHeader = ({ user, onLogout }) => (
  <header style={{
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.9)",
    boxShadow: "0 1px 20px rgba(79,70,229,0.07)",
    position: "sticky", top: 0, zIndex: 20
  }}>
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: accent }}>
          <Zap size={17} className="text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
          ProjectFlow
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        {user && (
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: accent }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800 leading-none">{user.username}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
            </div>
          </div>
        )}
        <div className="w-px h-8 bg-gray-100" />
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </div>
  </header>
);

export default DashboardHeader;