import React from "react";
import { Folder, Layout, Calendar, Edit2, Trash2, ChevronRight } from "lucide-react";
import { accent } from "./constants";

const ProjectGrid = ({ projects, onNavigate, onEdit, onDelete }) => {
  if (projects.length === 0) {
    return (
      <div className="col-span-full py-24 text-center flex flex-col items-center animate-fadeUp">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5" style={{ background: "rgba(79,70,229,0.07)" }}>
          <Layout size={36} style={{ color: "#c7d2fe" }} />
        </div>
        <h3 className="text-xl font-bold text-gray-400 mb-1" style={{ fontFamily: "'Syne', sans-serif" }}>
          Aucun projet actif
        </h3>
        <p className="text-gray-400 text-sm">Commencez par créer votre premier espace de travail.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger">
      {projects.map(project => (
        <div
          key={project.id}
          onClick={() => onNavigate(`/projects/${project.id}`)}
          className="group cursor-pointer rounded-3xl p-6 transition-all duration-300 animate-fadeUp"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.95)",
            boxShadow: "0 4px 16px rgba(79,70,229,0.05)"
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 16px 40px rgba(79,70,229,0.14)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(79,70,229,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          {/* Card top */}
          <div className="flex justify-between items-start mb-5">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, rgba(79,70,229,0.1), rgba(124,58,237,0.08))"
            }}>
              <Folder size={22} style={{ color: "#4f46e5" }} />
            </div>

            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => onEdit(e, project)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-500"
                onMouseEnter={e => e.currentTarget.style.background = "rgba(79,70,229,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(project.id); }}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500"
                onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Info */}
          <h3 className="text-lg font-bold text-gray-900 mb-1.5 group-hover:text-indigo-600 transition-colors" style={{ fontFamily: "'Syne', sans-serif" }}>
            {project.name}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-5">
            {project.description || "Aucune description."}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <Calendar size={12} />
              <span>{new Date(project.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Ouvrir <ChevronRight size={13} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectGrid;