import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <p>Loading...</p>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<ProtectedRoute requireRole="user"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route
        path="/"
        element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/student"} replace /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
