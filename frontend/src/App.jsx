import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

import ProjectDetail from './components/ProjectDetail'; // On va le créer
import Chatbot from "./components/Chatbot";

import './App.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
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

      <Chatbot />
    </Router>
  );
}

export default App;