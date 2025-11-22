import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./auth/Login.jsx";
import Signup from "./auth/Signup.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import MainApp from "./MainApp.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Home → Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* API Tool */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainApp />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
