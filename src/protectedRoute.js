import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import { getUserRole, getRoleLabel, ROLES } from './routes';

// Composant de protection des routes
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  fallbackPath = "/auth/login",
  requireAuth = true 
}) => {
  const location = useLocation();
  const userRole = getUserRole();
  
  // Si l'authentification est requise mais qu'il n'y a pas de rôle
  if (requireAuth && !userRole) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Si pas de restrictions de rôle, autoriser l'accès
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Vérifier la hiérarchie des rôles
  const hasAccess = checkRoleAccess(userRole, allowedRoles);

  if (hasAccess) {
    return children;
  }

  // Page d'accès refusé
  return <AccessDenied userRole={userRole} requiredRoles={allowedRoles} />;
};

// Fonction pour vérifier l'accès selon la hiérarchie des rôles
const checkRoleAccess = (userRole, allowedRoles) => {
  if (!userRole || !allowedRoles) return false;
  
  // Hiérarchie : superuser > admin > user
  const roleHierarchy = {
    [ROLES.SUPERUSER]: 3,
    [ROLES.ADMIN]: 2,
    [ROLES.USER]: 1
  };
  
  const userLevel = roleHierarchy[userRole] || 0;
  
  // Vérifier si l'utilisateur a au moins un des niveaux requis
  return allowedRoles.some(role => {
    const requiredLevel = roleHierarchy[role] || 0;
    return userLevel >= requiredLevel;
  });
};

// Composant d'accès refusé
const AccessDenied = ({ userRole, requiredRoles }) => {
  const goBack = () => {
    window.history.back();
  };

  const goHome = () => {
    window.location.href = "/admin/index";
  };

  const goProfile = () => {
    window.location.href = "/admin/user-profile";
  };

  return (
    <Container className="mt-5 pb-5">
      <Row className="justify-content-center">
        <Col lg="8" md="10">
          <Card className="shadow border-0">
            <CardBody className="px-lg-5 py-lg-5">
              <div className="text-center">
                {/* Icône d'accès refusé */}
                <div className="mb-4">
                  <i className="fas fa-shield-alt text-danger" style={{ fontSize: "4rem" }}></i>
                </div>
                
                <h2 className="text-danger mb-3">Accès restreint</h2>
                
                <Alert color="warning" className="text-left">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle mr-3"></i>
                    <div>
                      <strong>Permissions insuffisantes</strong>
                      <br />
                      <small className="text-muted">
                        Votre rôle : <span className="font-weight-bold">{getRoleLabel(userRole)}</span>
                        <br />
                        Accès requis : <span className="font-weight-bold">{requiredRoles.map(getRoleLabel).join(' ou ')}</span>
                      </small>
                    </div>
                  </div>
                </Alert>

                <p className="text-muted mb-4">
                  Cette page nécessite des privilèges plus élevés. 
                  Si vous pensez avoir besoin d'accéder à cette section, 
                  veuillez contacter votre administrateur système.
                </p>

                {/* Suggestions d'actions selon le rôle */}
                <div className="mb-4">
                  <h6 className="text-muted">Que pouvez-vous faire ?</h6>
                  <Row className="mt-3">
                    <Col md="4" className="mb-3">
                      <div className="text-center">
                        <i className="fas fa-user-circle text-primary mb-2" style={{fontSize: "2rem"}}></i>
                        <p className="small text-muted">Consulter votre profil</p>
                      </div>
                    </Col>
                    <Col md="4" className="mb-3">
                      <div className="text-center">
                        <i className="fas fa-calendar-alt text-info mb-2" style={{fontSize: "2rem"}}></i>
                        <p className="small text-muted">Gérer vos congés</p>
                      </div>
                    </Col>
                    <Col md="4" className="mb-3">
                      <div className="text-center">
                        <i className="fas fa-chart-line text-success mb-2" style={{fontSize: "2rem"}}></i>
                        <p className="small text-muted">Voir le tableau de bord</p>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Boutons d'actions */}
                <div className="d-flex justify-content-center flex-wrap gap-2">
                  <Button color="primary" onClick={goHome} className="m-1">
                    <i className="fas fa-home mr-2"></i>
                    Tableau de bord
                  </Button>
                  
                  <Button color="info" outline onClick={goProfile} className="m-1">
                    <i className="fas fa-user mr-2"></i>
                    Mon profil
                  </Button>
                  
                  <Button color="secondary" outline onClick={goBack} className="m-1">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Retour
                  </Button>
                </div>

                {/* Contact administrateur */}
                <div className="mt-4 pt-3 border-top">
                  <small className="text-muted">
                    <i className="fas fa-envelope mr-1"></i>
                    Besoin d'aide ? Contactez votre administrateur système
                  </small>
                </div>

                {/* Informations de débogage en développement */}
                {process.env.NODE_ENV === 'development' && (
                  <Alert color="info" className="mt-4 text-left">
                    <strong>Informations de débogage :</strong>
                    <br />
                    <code className="small">
                      Rôle utilisateur : {userRole}
                      <br />
                      Rôles requis : [{requiredRoles.join(', ')}]
                      <br />
                      URL : {window.location.pathname}
                      <br />
                      Timestamp : {new Date().toLocaleString()}
                    </code>
                  </Alert>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Hook personnalisé pour vérifier les permissions
export const usePermissions = () => {
  const userRole = getUserRole();
  
  const hasRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (!userRole) return false;
    
    return checkRoleAccess(userRole, roles);
  };

  const canAccess = (routePath) => {
    // Cette fonction pourrait être étendue pour vérifier des routes spécifiques
    return userRole !== null;
  };

  return {
    userRole,
    hasRole,
    canAccess,
    isUser: userRole === ROLES.USER,
    isAdmin: userRole === ROLES.ADMIN,
    isSuperUser: userRole === ROLES.SUPERUSER,
    isAuthenticated: !!userRole,
    roleLabel: getRoleLabel(userRole)
  };
};

// Composant pour afficher du contenu conditionnel selon les rôles
export const RoleBasedComponent = ({ allowedRoles, children, fallback = null }) => {
  const { hasRole } = usePermissions();
  
  return hasRole(allowedRoles) ? children : fallback;
};

// HOC pour wrapper un composant avec protection de rôle
export const withRoleProtection = (Component, allowedRoles) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export default ProtectedRoute;