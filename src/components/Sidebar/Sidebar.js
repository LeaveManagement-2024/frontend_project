import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import logoo14 from "../../assets/img/brand/OIP.jpg";
import {
  Button,
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Alert
} from "reactstrap";
import { getFilteredRoutes, getUserRole, getRoleLabel, ROLES } from "../../routes";

// Composant pour les icônes de notification
const NotificationBadge = ({ count }) => {
  return count > 0 ? (
    <span className="notification-badge bg-danger text-white rounded-circle position-absolute"
          style={{ 
            top: '-5px', 
            right: '-5px', 
            minWidth: '18px', 
            height: '18px',
            fontSize: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
      {count > 9 ? "9+" : count}
    </span>
  ) : null;
};

// Composant pour afficher le statut des permissions (développement uniquement)
const PermissionIndicator = ({ allowedRoles, userRole }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <small className="ml-auto text-muted d-none d-lg-block" style={{fontSize: "10px"}}>
      {allowedRoles?.join(', ')}
    </small>
  );
};

const Sidebar = ({ 
  bgColor = "white", 
  routes = [], 
  logo = {}, 
  userName = "Utilisateur" 
}) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Récupérer et vérifier le rôle utilisateur
  useEffect(() => {
    try {
      const role = getUserRole();
      
      if (!role) {
        setError("Rôle utilisateur non trouvé");
        // Rediriger vers la page de connexion après un délai
        setTimeout(() => {
          navigate("/auth/login");
        }, 2000);
        return;
      }

      // Valider que le rôle est correct
      if (!Object.values(ROLES).includes(role)) {
        setError(`Rôle invalide: ${role}`);
        console.warn(`Rôle non reconnu dans localStorage: ${role}`);
        // On continue quand même avec le rôle USER par défaut
        setUserRole(ROLES.USER);
      } else {
        setUserRole(role);
        setError(null);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération du rôle:", err);
      setError("Erreur lors de la vérification des permissions");
    }
  }, [navigate]);

  // Filtrer les routes selon le rôle de l'utilisateur
  useEffect(() => {
    if (userRole) {
      const filtered = getFilteredRoutes(userRole);
      setFilteredRoutes(filtered);
    }
  }, [userRole]);

  // Détecter la route active
  useEffect(() => {
    const currentPath = location.pathname;
    const activeRoute = filteredRoutes.find(route => 
      currentPath.indexOf(route.layout + route.path) > -1
    );
    
    if (activeRoute) {
      setActiveItem(activeRoute.name);
    }
  }, [location, filteredRoutes]);

  // Fonctions de gestion du collapse
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // Créer les liens de navigation
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      const isActive = activeItem === prop.name;
      
      return (
        <NavItem key={key} className={`sidebar-item ${isActive ? "active" : ""}`}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            className={`d-flex align-items-center sidebar-link ${isActive ? "active" : ""} py-2`}
          >
            <div className="icon-container position-relative" style={{ minWidth: "30px" }}>
              <i className={prop.icon} style={{ fontSize: "16px" }} />
              {prop.notifications > 0 && <NotificationBadge count={prop.notifications} />}
            </div>
            <span className="nav-link-text flex-grow-1" 
                  style={{
                    marginLeft: "15px", 
                    fontSize: "15px", 
                    color: isActive ? "#5e72e4" : "#525f7f",
                    fontWeight: isActive ? "600" : "400"
                  }}>
              {prop.name}
            </span>
            
          </NavLink>
        </NavItem>
      );
    });
  };

  // Fonction de déconnexion améliorée
  const handleLogout = () => {
    try {
      // Confirmation avant déconnexion
      if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        // Nettoyer localStorage
        localStorage.removeItem("userRole");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("userProfile");
        
        // Redirection vers la page de connexion
        navigate("/auth/login");
      }
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      // Forcer la redirection même en cas d'erreur
      window.location.href = "/auth/login";
    }
  };

  // Obtenir la couleur du badge selon le rôle
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.SUPERUSER:
        return "danger";
      case ROLES.ADMIN:
        return "warning";
      case ROLES.USER:
        return "info";
      default:
        return "secondary";
    }
  };

  // Propriétés du logo
  let navbarBrandProps = {};
  if (logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-expand-md shadow-sm"
      style={{ backgroundColor: bgColor || "#fff" }}
      id="sidenav-main"
    >
      <Container fluid className="px-0">
        {/* Bouton toggler pour mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={toggleCollapse}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Logo et nom de l'application */}
        <NavbarBrand className="pt-0 d-md-none" {...navbarBrandProps}>
          <div className="d-flex align-items-center">
            {logo.imgSrc && (
              <img
                alt={logo.imgAlt}
                className="navbar-brand-img"
                src={logo.imgSrc}
                style={{ height: "30px" }}
              />
            )}
          </div>
        </NavbarBrand>

        {/* Contenu du sidebar */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Affichage des erreurs */}
          {error && (
            <Alert color="danger" className="mx-3 mt-3">
              <small>{error}</small>
            </Alert>
          )}

          {/* Header du sidebar avec profil utilisateur */}
          <div className="sidebar-header text-center mb-4 mt-3">
            <div className="avatar-container mb-3">
              <img
                src={logoo14}
                alt="Photo de profil"
                className="rounded-circle border border-light shadow-sm"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>
            <h6 className="user-name font-weight-bold mb-1 text-dark">{userName}</h6>
            <p className="text-muted user-role small mb-2">
              {userRole ? getRoleLabel(userRole) : 'Chargement...'}
            </p>
            {/* Badge de rôle */}
            {userRole && (
              <span className={`badge badge-${getRoleBadgeColor(userRole)} badge-pill`}>
                {getRoleLabel(userRole)}
              </span>
            )}
          </div>

         
          

          {/* Séparateur */}
          <hr className="my-3 mx-3" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />

          {/* Navigation filtrée par rôle */}
          <Nav navbar className="sidebar-nav flex-column">
            {filteredRoutes.length > 0 ? (
              createLinks(filteredRoutes)
            ) : (
              <div className="text-center text-muted p-3">
                <small>Aucune page accessible</small>
              </div>
            )}
          </Nav>

          {/* Section inférieure - Actions rapides */}
          <div className="sidebar-footer mt-auto pb-3 px-3">
            <hr className="my-3" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
            
            

            {/* Bouton Paramètres - visible seulement pour superuser */}
            {userRole === ROLES.SUPERUSER && (
              <Button
                color="light"
                size="sm"
                block
                className="mb-2 d-flex align-items-center justify-content-center"
                onClick={() => navigate("/admin/Parametre")}
              >
                <i className="fas fa-cog mr-2" />
                <span>Paramètres</span>
              </Button>
            )}

            {/* Bouton Déconnexion */}
            <Button
              color="danger"
              size="sm"
              outline
              block
              className="d-flex align-items-center justify-content-center"
              onClick={handleLogout}
            >
              <i className="fas fa-sign-out-alt mr-2" />
              <span>Déconnexion</span>
            </Button>
          </div>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.propTypes = {
  bgColor: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    name: PropTypes.string,
    icon: PropTypes.string,
    layout: PropTypes.string,
    notifications: PropTypes.number,
    hideInSidebar: PropTypes.bool,
    allowedRoles: PropTypes.arrayOf(PropTypes.string),
  })),
  logo: PropTypes.shape({
    innerLink: PropTypes.string,
    outterLink: PropTypes.string,
    imgSrc: PropTypes.string,
    imgAlt: PropTypes.string,
  }),
  userName: PropTypes.string
};

export default Sidebar;