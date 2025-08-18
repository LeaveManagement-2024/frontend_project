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
import { Container, Row, Col } from "reactstrap";
import "../views/examples/style.css";
// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import AuthFooter from "components/Footers/AuthFooter.js";

import routes, { getUserRole, ROLES } from "routes.js";

const Auth = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const userRole = getUserRole();

  React.useEffect(() => {
    document.body.classList.add("clabg");
    return () => {
      document.body.classList.remove("clabg");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  // Redirection automatique si déjà connecté
  React.useEffect(() => {
    if (userRole && Object.values(ROLES).includes(userRole)) {
      // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard
      // sauf s'il est explicitement sur la page de déconnexion
      if (location.pathname !== "/auth/logout") {
        window.location.href = "/admin/index";
      }
    }
  }, [userRole, location.pathname]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  // Composant de déconnexion
  const LogoutComponent = () => {
    React.useEffect(() => {
      // Nettoyer le localStorage
      localStorage.removeItem("userRole");
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 1000);
    }, []);

    return (
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md="6" className="text-center">
            <div className="card">
              <div className="card-body p-5">
                <i className="fas fa-sign-out-alt text-primary mb-3" style={{fontSize: "3rem"}}></i>
                <h4>Déconnexion en cours...</h4>
                <p className="text-muted">Vous allez être redirigé vers la page de connexion.</p>
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Chargement...</span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <>
      <div className="main-content" ref={mainContent}>
        <AuthNavbar />
        <div className="header py-7 py-lg-8">
          <Container>
            <div className="header-body text-center mb-7">
              <Row className="justify-content-center">
                <Col lg="5" md="6">
                  <h1 className="text-white nav-link-blur">
                    {location.pathname.includes('/logout') ? 'À bientôt !' : 'Bienvenue !'}
                  </h1>
                  {location.pathname.includes('/logout') && (
                    <p className="text-white-50">
                      Vous avez été déconnecté avec succès
                    </p>
                  )}
                </Col>
              </Row>
            </div>
          </Container>
        </div>

        {/* Page content */}
        <Container className="mt--8 pb-5">
          <Row className="justify-content-center">
            <Routes>
              {getRoutes(routes)}
              
              {/* Route de déconnexion */}
              <Route path="/logout" element={<LogoutComponent />} />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </Row>
        </Container>
      </div>
      <AuthFooter />
    </>
  );
};

export default Auth;