import axios from "axios";

const API_URL = "http://localhost:8000/api";

// 1. Création de l'instance de base
const api = axios.create({
  baseURL: API_URL,
});

// 2. Intercepteur de REQUÊTE : Ajoute le token s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. Intercepteur de RÉPONSE : Gère le Refresh Token si on reçoit une erreur 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si on a une erreur 401 et qu'on n'a pas déjà essayé de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // On demande un nouveau access_token
          const res = await axios.post(`${API_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          localStorage.setItem("access_token", res.data.access);
          
          // On relance la requête initiale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Si le refresh_token est aussi expiré -> Déconnexion
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

// 4. Tes fonctions exportées (Simplifiées grâce à Axios)
export const registerUser = async (userData) => {
  // Changé de /register/ à /users/
  const response = await api.post("/users/", userData);
  return response.data;
};


export const loginUser = async (credentials) => {
  const response = await api.post("/token/", credentials);
  return response.data;
};

// Nouvelle fonction pour récupérer l'utilisateur connecté
export const getMe = async () => {
  // Changé de /register/me/ à /users/me/
  const response = await api.get("/users/me/");
  return response.data;
};

// Projets
export const getProjects = () => api.get("/projects/");
export const createProject = (data) => api.post("/projects/", data);
export const deleteProject = (id) => api.delete(`/projects/${id}/`);
export const updateProject = (id, data) => api.patch(`/projects/${id}/`, data);
// Tâches
export const getTasks = (projectId) => api.get(`/tasks/?project=${projectId}`);
export const createTask = (data) => api.post("/tasks/", data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}/`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}/`);


export const askChatbot = (message) => api.post("/chatbot/", { message });


export default api;









