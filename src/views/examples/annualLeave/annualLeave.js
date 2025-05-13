import React, { useState, useEffect } from 'react';
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// Composants principaux
import Header from "components/Headers/Header.js";
import '../style.css'
import { Link } from 'react-router-dom';
import { getAllAnnualLeave } from './annualLeaveAPI';
import AddAnnualLeaveModal from "./addAnnualLeave";

const AnnualLeave = () => {
  const [annualLeaves, setAnnualLeaves] = useState([]);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    fetchAllAnnualLeaves();
  }, []);
  
  const fetchAllAnnualLeaves = async () => {
    try {
      const data = await getAllAnnualLeave();
      setAnnualLeaves(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés annuels :", error);
    }
  };

  const handleCloseModal = () => {
    console.log("Fermeture du modal");
    setModalShow(false);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0 text-lg text-center">Congés annuels</h3>
                  <Button color="primary" onClick={() => setModalShow(true)}>
                    Ajouter un congé annuel
                  </Button>
                  <AddAnnualLeaveModal show={modalShow} onHide={handleCloseModal} />
                </div>
              </CardHeader>
              
              <div className="row side-row divstu">
                {annualLeaves.map((anl) => (
                  <Link to={`/admin/annualLeaveDetial/${anl.annualLeaveId}`} key={anl.annualLeaveId}>
                    <div className="card78">
                      <h3 
                        className="card__title text-center" 
                        style={{margin: '10px'}}
                      >
                        Congé annuel {anl.label}
                      </h3>
                      
                      <p 
                        className="card__content text-center" 
                        style={{ color: anl.status === 'enabled' ? 'green' : 'red', marginLeft: '10px', fontSize: "1.5em" }}
                      >
                        Statut : {anl.status === 'enabled' ? 'Activé' : 'Désactivé'}
                      </p>
                      <div className='d-flex justify-content-between align-items-center'>
                        <i className="ni ni-calendar-grid-58" />
                        <div className="text-right">
                          Début du congé annuel :
                        </div>
                        <div className='text-left'>
                          {anl.startDate}
                        </div>
                      </div>
                      <div className='d-flex justify-content-between align-items-center' style={{marginBottom: '20px'}}>
                        <i className="ni ni-calendar-grid-58" />
                        <div className="text-right">
                          Fin du congé annuel :
                        </div>
                        <div className='text-left'>
                          {anl.endDate}
                        </div>
                      </div>
                      <div className="card__arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15">
                          <path fill="#fff" d="M13.4697 17.9697C13.1768 18.2626 13.1768 18.7374 13.4697 19.0303C13.7626 19.3232 14.2374 19.3232 14.5303 19.0303L20.3232 13.2374C21.0066 12.554 21.0066 11.446 20.3232 10.7626L14.5303 4.96967C14.2374 4.67678 13.7626 4.67678 13.4697 4.96967C13.1768 5.26256 13.1768 5.73744 13.4697 6.03033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L13.4697 17.9697Z"></path>
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default AnnualLeave;
