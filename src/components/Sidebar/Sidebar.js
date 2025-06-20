import { useState, useEffect } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
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
} from "reactstrap";

// Composant pour les icônes de notification
const NotificationBadge = ({ count }) => {
  return count > 0 ? (
    <span className="notification-badge bg-danger text-white rounded-circle">
      {count > 9 ? "9+" : count}
    </span>
  ) : null;
};

const Sidebar = ({ bgColor = "white", routes = [], logo = {}, userName = "Utilisateur" }) => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");
  const location = useLocation();
  
  // Détecte la route active basée sur l'URL
  useEffect(() => {
    const currentPath = location.pathname;
    const activeRoute = routes.find(route => 
      currentPath.indexOf(route.layout + route.path) > -1
    );
    
    if (activeRoute) {
      setActiveItem(activeRoute.name);
    }
  }, [location, routes]);

  // Bascule l'état du collapse
  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  // Ferme le collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
  };

  // Crée les liens de navigation
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      // Filtrer les routes qui ne devraient pas apparaître dans la sidebar
      if (prop.hideInSidebar) return null;
      
      const isActive = activeItem === prop.name;
      
      return (
        <NavItem key={key} className={`sidebar-item ${isActive ? "active" : ""}`}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            className={`d-flex align-items-center sidebar-link ${isActive ? "active" : ""}`}
          >
            <div className="icon-container">
              <i className={prop.icon} />
              {prop.notifications > 0 && <NotificationBadge count={prop.notifications} />}
            </div>
            <span className="nav-link-text" style={{marginLeft: "20px", fontSize: "15px", color:"black", }}>{prop.name}</span>
          </NavLink>
        </NavItem>
      );
    });
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
          <div className="sidebar-header text-center mb-4 mt-3">
            <div className="avatar-container mb-3">
              <img
                src={logoo14}
                alt="Photo de profil"
                className="rounded-circle border border-light shadow-sm"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
            <h5 className="user-name font-weight-bold mb-0">{userName}</h5>
            <p className="text-muted user-role small">Administrateur</p>
          </div>

          {/* Barre de recherche */}
          <div className="px-3 mb-4">
            <div className="search-box position-relative">
              <input
                type="text"
                className="form-control bg-light border-0 rounded-pill pl-4"
                placeholder="Rechercher..."
                style={{ fontSize: "0.85rem", paddingRight: "2.5rem" }}
              />
              <i className="fas fa-search position-absolute" 
                style={{ right: "15px", top: "10px", color: "#adb5bd" }} />
            </div>
          </div>

          {/* Séparateur */}
          <hr className="my-3 mx-3" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />

          {/* Navigation */}
          <Nav navbar className="sidebar-nav">
            {createLinks(routes)}
          </Nav>

          {/* Section inférieure - Actions rapides */}
          <div className="sidebar-footer mt-auto pb-3 px-3">
            <hr className="my-3" style={{ backgroundColor: "rgba(0,0,0,0.1)" }} />
            <Button
              color="light"
              size="sm"
              block
              className="mb-2 d-flex align-items-center justify-content-center"
            >
              <i className="fas fa-cog mr-2" />
              <span>Paramètres</span>
            </Button>
            <Button
              color="danger"
              size="sm"
              outline
              block
              className="d-flex align-items-center justify-content-center"
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
    hideInSidebar: PropTypes.bool
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