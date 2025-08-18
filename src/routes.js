/*! ========================================================= 
 * Argon Dashboard React - v1.2.4 
 =========================================================
 * Page produit : https://www.creative-tim.com/product/argon-dashboard-react
 * Copyright 2024 Creative Tim (https://www.creative-tim.com)
 * Licence sous MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)
 * Développé par Creative Tim 
 =========================================================
 * Le copyright ci-dessus et cette autorisation doivent être inclus dans toutes les copies ou parties substantielles du logiciel. 
 */

import React from 'react';
import Index from "views/Index.js";
import Profile from "views/examples/profilePerso/Profile";
import Register from "views/examples/Authe/Register.js";
import Login from "views/examples/Authe/Login.js";
import Leave from "views/examples/Leave/Leave";
import Employees from "views/examples/Employess/Employees";
import SaisieFormation from "views/examples/formation/GestionFormations";
import Parametre from "views/examples/parametre/parametre";
import AnnualLeave from "views/examples/annualLeave/annualLeave";
import LeavePerson from "views/examples/Leave/LeavePerson";

// Configuration des rôles et leurs hiérarchies
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin', 
  SUPERUSER: 'superuser'
};

// Fonction pour vérifier la hiérarchie des rôles
const hasRoleAccess = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  
  // Hiérarchie des rôles : superuser > admin > user
  const roleHierarchy = {
    [ROLES.SUPERUSER]: 3,
    [ROLES.ADMIN]: 2,
    [ROLES.USER]: 1
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  
  // Vérifier si l'utilisateur a au moins un des rôles requis
  return allowedRoles.some(role => {
    const requiredLevel = roleHierarchy[role] || 0;
    return userLevel >= requiredLevel;
  });
};

var routes = [
  {
    path: "/index",
    name: "Tableau de bord",
    icon: "fa-solid fa-gauge text-primary",
    component: <Index />,
    layout: "/admin",
    allowedRoles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERUSER], // Tous les utilisateurs
  },
  {
    path: "/user-profile",
    name: "Profil de l'utilisateur",
    icon: "fa-solid fa-user text-primary",
    component: <Profile />,
    layout: "/admin",
    allowedRoles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERUSER], // Tous les utilisateurs
  },
  {
    path: "/LeavePerson",
    name: "Congés personnels",
    icon: "fa-solid fa-calendar-days text-primary",
    component: <LeavePerson />,
    layout: "/admin",
    allowedRoles: [ROLES.USER, ROLES.ADMIN, ROLES.SUPERUSER], // Tous les utilisateurs
  },
  {
    path: "/Leave",
    name: "Congés généraux",
    icon: "fa-solid fa-calendar text-primary",
    component: <Leave />,
    layout: "/admin",
    allowedRoles: [ROLES.ADMIN, ROLES.SUPERUSER], // Seulement admin et superuser
  },
  {
    path: "/annualLeave",
    name: "Congés annuels",
    icon: "fa-regular fa-calendar-days text-primary",
    component: <AnnualLeave />,
    layout: "/admin",
    allowedRoles: [ROLES.ADMIN, ROLES.SUPERUSER], // Seulement admin et superuser
  },
  {
    path: "/Formations",
    name: "Formations",
    icon: "fa-solid fa-graduation-cap text-primary",
    component: <SaisieFormation />,
    layout: "/admin",
    allowedRoles: [ROLES.ADMIN, ROLES.SUPERUSER], // Seulement admin et superuser
  },
  {
    path: "/employees",
    name: "Employés",
    icon: "fa-solid fa-user-tie text-primary",
    component: <Employees />,
    layout: "/admin",
    allowedRoles: [ROLES.ADMIN, ROLES.SUPERUSER], // Seulement admin et superuser
  },
  {
    path: "/Parametre",
    name: "Paramètres",
    icon: "fa-solid fa-gears text-primary",
    component: <Parametre />,
    layout: "/admin",
    allowedRoles: [ROLES.SUPERUSER], // Seulement superuser
    hideInSidebar: false, // Sera masqué automatiquement par le système de permissions
  },
  // Routes d'authentification (toujours visibles)
  {
    path: "/login",
    name: "Connexion",
    icon: "fa-solid fa-key text-primary",
    component: <Login />,
    layout: "/auth",
    hideInSidebar: true, // Masquer dans la sidebar
  },
  {
    path: "/register",
    name: "Inscription",
    icon: "fa-solid fa-address-card text-primary",
    component: <Register />,
    layout: "/auth",
    hideInSidebar: true, // Masquer dans la sidebar
  },
];

// Fonction utilitaire pour filtrer les routes selon le rôle de l'utilisateur
export const getFilteredRoutes = (userRole) => {
  return routes.filter(route => {
    // Si hideInSidebar est true, ne pas afficher dans la sidebar
    if (route.hideInSidebar) return false;
    
    // Si pas de rôles définis, accessible à tous
    if (!route.allowedRoles) return true;
    
    // Vérifier si l'utilisateur a les permissions
    return hasRoleAccess(userRole, route.allowedRoles);
  });
};

// Fonction utilitaire pour vérifier si un utilisateur peut accéder à une route
export const canAccessRoute = (userRole, routePath) => {
  const route = routes.find(r => r.path === routePath);
  if (!route || !route.allowedRoles) return true;
  return hasRoleAccess(userRole, route.allowedRoles);
};

// Fonction utilitaire pour obtenir le rôle depuis localStorage
export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

// Fonction utilitaire pour obtenir les libellés des rôles en français
export const getRoleLabel = (role) => {
  const roleLabels = {
    [ROLES.USER]: 'Utilisateur',
    [ROLES.ADMIN]: 'Administrateur', 
    [ROLES.SUPERUSER]: 'Super Administrateur'
  };
  return roleLabels[role] || 'Utilisateur';
};

export default routes;