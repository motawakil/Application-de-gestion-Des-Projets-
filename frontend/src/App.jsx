import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProjectDetail from './components/ProjectDetail';
import Chatbot from "./components/Chatbot";

import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

// Wrapper pour afficher le Chatbot conditionnellement
const LayoutWithChatbot = ({ children }) => {
  const location = useLocation();
  const hideChatbotRoutes = ["/login", "/register"]; // routes où on cache le chatbot

  return (
    <>
      {children}
      {!hideChatbotRoutes.includes(location.pathname) && <Chatbot />}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWithChatbot>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <ProjectDetail />
              </PrivateRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </LayoutWithChatbot>
    </Router>
  );
}

export default App;