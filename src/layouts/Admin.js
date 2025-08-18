/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================
* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import ProtectedRoute from "../protectedRoute";

// Import des composants de pages
import Grades from "views/examples/parametre/grades/grades";
import Postes from "views/examples/parametre/posts/posts";
import Departments from "views/examples/parametre/departement/departement";
import Filieres from "views/examples/parametre/filiere/filiere";
import Services from "views/examples/parametre/service/service";
import PublicHoliday from "views/examples/parametre/public_holiday/public_holliday";
import Profiles from "views/examples/parametre/profiles/profiles";
import Index from "views/Index";
import LeaveTypes from "views/examples/parametre/leave_type/leave_type";
import AnnualLeaveDetial from "views/examples/annualLeave/annualLeaveDetial";

import routes, { ROLES, getUserRole } from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const userRole = getUserRole();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Fonction pour générer les routes avec protection
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        // Si la route a des restrictions de rôle, l'envelopper avec ProtectedRoute
        if (prop.allowedRoles && prop.allowedRoles.length > 0) {
          return (
            <Route 
              path={prop.path} 
              element={
                <ProtectedRoute allowedRoles={prop.allowedRoles}>
                  {prop.component}
                </ProtectedRoute>
              } 
              key={key} 
            />
          );
        } else {
          // Route accessible à tous les utilisateurs connectés
          return (
            <Route path={prop.path} element={prop.component} key={key} />
          );
        }
      } else {
        return null;
      }
    });
  };

  // Fonction pour obtenir le nom de la page actuelle
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (path.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    }
    return "Dashboard";
  };

  // Obtenir le nom d'utilisateur depuis localStorage (optionnel)
  const getUserName = () => {
    try {
      const userData = localStorage.getItem("userData");
      if (userData) {
        const parsedData = JSON.parse(userData);
        return parsedData.name || parsedData.username || "Utilisateur";
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
    return "Utilisateur";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        userName={getUserName()}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "Dashboard Logo",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(location.pathname)}
        />
        <Routes>
          {/* Routes générées automatiquement avec protection */}
          {getRoutes(routes)}
          
          {/* Routes de paramètres - Protection SUPERUSER uniquement */}
          <Route 
            path="/grades" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Grades />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/posts" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Postes />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/departments" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Departments />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/filieres" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Filieres />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/services" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Services />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/public-holiday" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERUSER]}>
                <PublicHoliday />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profiles" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPERUSER]}>
                <Profiles />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/leaveType" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERUSER]}>
                <LeaveTypes />
              </ProtectedRoute>
            } 
          />
          
          {/* Routes avec paramètres - Protection selon le contexte */}
          <Route 
            path="/annualLeaveDetial/:idan" 
            element={
              <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPERUSER]}>
                <AnnualLeaveDetial />
              </ProtectedRoute>
            } 
          />
          
          {/* Route index par défaut - Accessible à tous */}
          <Route path="/index" element={<Index />} />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;