import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HealthLog from "./pages/HealthLog";
import Profile from "./pages/Profile";
import Planner from "./pages/Planner";
import BottomNavBar from "./components/BottomNavBar";
import { useAuth } from "./contexts/AuthContext";

const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const showNavBar = location.pathname !== "/login";

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/logs" element={<ProtectedRoute element={<HealthLog />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/planner" element={<ProtectedRoute element={<Planner />} />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
      {showNavBar && <BottomNavBar />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppContent />
    </Router>
  );
};

export default App;
