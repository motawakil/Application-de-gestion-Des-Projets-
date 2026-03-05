import React from "react";
import { accent } from "./constants";

const ProjectForm = ({ editingProject, newProject, onChange, onSubmit, onCancel }) => (
  <div className="mb-10 rounded-3xl p-8 max-w-2xl animate-scaleIn" style={{
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.95)",
    boxShadow: "0 20px 40px rgba(79,70,229,0.1)"
  }}>
    <h3 className="font-bold text-gray-800 text-lg mb-5" style={{ fontFamily: "'Syne', sans-serif" }}>
      {editingProject ? `Modifier "${editingProject.name}"` : "Nouveau projet"}
    </h3>

    <form onSubmit={onSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
          Nom du projet
        </label>
        <input
          type="text"
          placeholder="Ex: Refonte site web"
          required
          className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all"
          style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
          value={newProject.name}
          onChange={e => onChange({ ...newProject, name: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
          Description
        </label>
        <textarea
          placeholder="Décrivez la mission de ce projet…"
          rows="3"
          className="w-full px-4 py-3.5 rounded-2xl text-sm font-medium transition-all resize-none"
          style={{ background: "#f8faff", border: "1.5px solid #e8eaf6", color: "#1e293b" }}
          value={newProject.description}
          onChange={e => onChange({ ...newProject, description: e.target.value })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        {editingProject && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl font-bold text-sm"
            style={{ background: "#f1f5f9", color: "#64748b" }}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="flex-[2] py-3 rounded-2xl font-bold text-sm text-white active:scale-95 transition-all"
          style={{ background: accent, boxShadow: "0 8px 20px rgba(79,70,229,0.3)" }}
        >
          {editingProject ? "Enregistrer les modifications" : "Lancer le projet →"}
        </button>
      </div>
    </form>
  </div>
);

export default ProjectForm;