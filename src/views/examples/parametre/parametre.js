import React from 'react';
import {
  Card,
  CardHeader,
  Container,
  Row
} from "reactstrap";
import { Link } from 'react-router-dom';  // Importer Link depuis react-router-dom
import Header from "components/Headers/Header.js";
import '../style.css';

const Parametre = () => {
  // Tableau des détails des cartes avec les chemins de navigation
  const cardDetails = [
    { title: "Cadres", body: "Grades", link: "/admin/grades" },
    { title: "Missions", body: "Missions", link: "/admin/posts" },
    { title: "Départements", body: "Départements", link: "/admin/departments" },
    { title: "Filières", body: "Filières", link: "/admin/filieres" },
    { title: "Services", body: "Services", link: "/admin/services" },
    { title: "Jours fériés nationaux et religieux", body: "Liste des jours fériés", link: "/admin/public-holiday" },
    { title: "Types de congés", body: "Types des Congés", link: "/admin/leaveType" },
    { title: "Profils", body: "Profils", link: "/admin/profiles" }
  ];

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                {/* Contenu optionnel de l'en-tête */}
              </CardHeader>
              <div className="row side-row divstu">
                {cardDetails.map((card, index) => (
                  <div className="cardParametre" key={index}>
                    <div className="card-details text-center">
                      <p className="text-title">{card.title}</p>
                      <p className="text-body">{card.body}</p>
                    </div>
                    {/* Utiliser Link pour la navigation */}
                    <Link to={card.link}>
                      <button className="card-button">Pour plus d'informations</button>
                    </Link>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Parametre;