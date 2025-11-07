import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* 如果以后有更多页面，也用 ProtectedRoute 包裹 */}
      </Routes>
    </Router>
  );
}

export default App;