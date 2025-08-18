import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Index from "views/Index";
import ProtectedRoute from "./protectedRoute";
import { ROLES } from "routes.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Fonction pour vérifier si l'utilisateur est connecté
const isAuthenticated = () => {
  const userRole = localStorage.getItem("userRole");
  return userRole && Object.values(ROLES).includes(userRole);
};

// Composant pour rediriger selon l'état d'authentification
const DefaultRedirect = () => {
  const authenticated = isAuthenticated();
  
  if (authenticated) {
    return <Navigate to="/admin/index" replace />;
  } else {
    return <Navigate to="/auth/login" replace />;
  }
};

root.render(
  <BrowserRouter>
    <Routes>
      {/* Routes d'administration - Protection requise */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.ADMIN, ROLES.SUPERUSER]}>
            <AdminLayout />
          </ProtectedRoute>
        } 
      />
      
      {/* Routes d'authentification - Pas de protection */}
      <Route path="/auth/*" element={<AuthLayout />} />
      
      {/* Route index directe - Protection requise */}
      <Route 
        path="/index" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.USER, ROLES.ADMIN, ROLES.SUPERUSER]}>
            <Index />
          </ProtectedRoute>
        } 
      />
      
      {/* Route par défaut avec redirection intelligente */}
      <Route path="/" element={<DefaultRedirect />} />
      <Route path="*" element={<DefaultRedirect />} />
    </Routes>
  </BrowserRouter>
);