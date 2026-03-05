import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export const accent = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)";

export const PRIORITY_STYLES = {
  HIGH:   { bg: "rgba(239,68,68,0.08)",   color: "#dc2626",  border: "rgba(239,68,68,0.2)",   label: "Élevée" },
  MEDIUM: { bg: "rgba(79,70,229,0.08)",   color: "#4f46e5",  border: "rgba(79,70,229,0.2)",   label: "Moyenne" },
  LOW:    { bg: "rgba(100,116,139,0.08)", color: "#64748b",  border: "rgba(100,116,139,0.2)", label: "Faible" },
};

export const STATUS_CONFIG = {
  TODO:        { bg: "rgba(100,116,139,0.08)", color: "#94a3b8", label: "À faire",  icon: Clock,        headerBg: "rgba(100,116,139,0.06)", accent: "#94a3b8" },
  IN_PROGRESS: { bg: "rgba(245,158,11,0.08)",  color: "#f59e0b", label: "En cours", icon: AlertCircle,  headerBg: "rgba(245,158,11,0.06)",  accent: "#f59e0b" },
  DONE:        { bg: "rgba(16,185,129,0.08)",  color: "#10b981", label: "Terminé",  icon: CheckCircle2, headerBg: "rgba(16,185,129,0.06)",  accent: "#10b981" },
};

export const isOverdue = (task) => {
  if (!task.due_date || task.status === "DONE") return false;
  return new Date(task.due_date) < new Date();
};