import { Link } from "react-router-dom";
import "./parametre.css";
import Header from "../../../components/Headers/Header.js";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Table,
  Container,
  Row,
  Col,
  CardTitle,
} from "reactstrap"
const Parametre = () => {
  // Configuration des cartes avec icônes et couleurs
  const cardDetails = [
    {
      title: "Missions",
      body: "Gérer les missions et projets",
      link: "/admin/posts",
      icon: "💼",
      color: "blue",
      badge: "Actif",
    },
    {
      title: "Départements",
      body: "Organisation des départements",
      link: "/admin/departments",
      icon: "🏢",
      color: "green",
      badge: "Gestion",
    },
    {
      title: "Jours fériés",
      body: "Jours fériés nationaux et religieux",
      link: "/admin/public-holiday",
      icon: "📅",
      color: "purple",
      badge: "Calendrier",
    },
    {
      title: "Types de congés",
      body: "Configuration des types de congés",
      link: "/admin/leaveType",
      icon: "⏰",
      color: "orange",
      badge: "RH",
    },
    {
      title: "Profils",
      body: "Gestion des profils utilisateurs",
      link: "/admin/profiles",
      icon: "👥",
      color: "pink",
      badge: "Utilisateurs",
    },
  ];

  return (
    <>
     <Header />
     
        <Container className="mt-2" fluid>
          <Row>
            <div className="col">
              <Card className="modern-leave-card">
                <CardHeader className="modern-card-header">
                  <CardTitle tag="h3" className="text-center">
                    Paramètres du Système
                  </CardTitle>
                </CardHeader> 
    <div className="">
      {/* Header moderne */}


      {/* Contenu principal */}
      <div className="settings-content">
        <div className="cards-grid">
          {cardDetails.map((card, index) => (
            <div key={index} className={`settings-card ${card.color}`}>
              <div className="card-header">
                <div className="card-icon-container">
                  <span className="card-icon">{card.icon}</span>
                </div>
                <span className="card-badge">{card.badge}</span>
              </div>

              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.body}</p>
              </div>

              <div className="card-footer">
                <Link to={card.link} className="card-link">
                  <button className="card-buttonn">
                    <span>Accéder</span>
                    <span className="arrow">→</span>
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section d'aide */}
        <div className="help-section">
          <div className="help-content">
            <div className="help-icon">
              <span>❓</span>
            </div>
            <div className="help-text">
              <h3>Besoin d'aide ?</h3>
              <p>
                Consultez notre documentation ou contactez le support technique.
              </p>
            </div>
            <button className="help-button">Documentation</button>
          </div>
        </div>
      </div>
    </div>
              </Card>
            </div>
          </Row>
        </Container>
     
    </>
  );
};

export default Parametre;
