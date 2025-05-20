// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import Header2 from "components/Headers/Header2.js";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  getEmployeeById,
  getFilirerByEmployee,
  getDepartmentByEmployee,
} from '../Employess/employeeApi'; 
import '../style.css';
import Parametre from './Para';
import ChangeImage from './changeImage';
import ChangePass from './changePasswordP';

const Profile = () => {
  const userId = localStorage.getItem('userId');
  console.log(userId);
  const [employee, setEmployee] = useState({});
  const [modalShow, setModalShow] = useState(false);
  const [modalShow1, setModalShow1] = useState(false);
  const [filiereE, setFiliereE] = useState({});
  
  useEffect(() => {
    fetchEmployee();
    fetchFiliereEmployee();
  }, []);
  
  const fetchEmployee = async () => {
    try {
      const data = await getEmployeeById(userId);
      setEmployee(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'employé :', error);
    }
  };

  const fetchFiliereEmployee = async () => {
    try {
      const data = await getDepartmentByEmployee(userId);
      setFiliereE(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la filière de l\'employé :', error);
    }
  };

  return (
    <>
      <Header2 />
      {/* Contenu de la page */}
      <Container className="mt--7" fluid>
        <Row>
          
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={() => setModalShow1(true)}>
                      <img
                        alt="..."
                        className="rounded-circle" style={{ height: '180px' }}
                        src={employee.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                      />
                    </a>
                    <ChangeImage show={modalShow1} onHide={() => setModalShow1(false)}></ChangeImage>
                  </div>
                </Col>
              </Row>
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mon compte</h3>
                  </Col>
                  <Col className="" xs="4">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={() => setModalShow(true)}
                      size="sm"
                    >
                      Changer le mot de passe
                    </Button>
                    <ChangePass show={modalShow} onHide={() => setModalShow(false)}></ChangePass>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small mb-4 mt-5" style={{ fontSize: '1em' }}>
                    Informations sur l'employé
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Prénom
                          </label>
                          <Input
                            className="form-control-alternative "                           
                            id="input-first-name"
                            placeholder="Prénom"
                            type="text"
                            defaultValue={employee.firstName}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Nom de famille
                          </label>
                          <Input
                            className="form-control-alternative "
                            defaultValue={employee.lastName}
                            id="input-last-name"
                            placeholder="Nom de famille"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                              Numéro de carte nationale
                          </label>
                          <Input
                            className="form-control-alternative "
                            defaultValue={employee.cin}
                            id="input-username"
                            placeholder="Numéro de carte nationale"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label text-left"
                            htmlFor="input-email"
                          >
                            Adresse e-mail
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="input-email"
                            placeholder="jesse@example.com"
                            type="email"
                            defaultValue={employee.email}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Numéro de téléphone
                          </label>
                          <Input
                            className="form-control-alternative "
                            defaultValue={employee.phone}
                            id="input-first-name"
                            placeholder="Numéro de téléphone"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Adresse
                          </label>
                          <Input
                            className="form-control-alternative "
                            defaultValue={employee.addressAr}
                            id="input-last-name"
                            placeholder="Adresse"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Adresse */}
                  <h6 className="heading-small  mb-4" style={{ fontSize: '1em' }}>
                    Informations professionnelles
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Numéro de matricule
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="input-city"
                            placeholder="Numéro de matricule"
                            type="text"
                            defaultValue={employee.ppr}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Date d'embauche
                          </label>
                          <Input
                            className="form-control-alternative "
                            defaultValue={employee.hireDate}
                            id="input-country"
                            type="date"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-postal-code"
                          >
                              Lieu de travail
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="input-postal-code"
                            placeholder="Lieu de travail"
                            type="text"
                            defaultValue={employee.workLocationAr}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                                            <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            Poste
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="input-city"
                            placeholder="Poste"
                            type="text"
                            defaultValue={employee?.post?.postName}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label 
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Département
                          </label>
                          <Input 
                            className="form-control-alternative "
                            defaultValue={filiereE?.departementName}
                            id="input-country"
                            placeholder="Département"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow" style={{ marginBottom: '90px' }}>
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo">
                      <img
                        alt="..."
                        className="rounded-circle" style={{ height: '180px' }}
                        src={filiereE?.service?.departement?.respDepartement?.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div className="">
                        <h3 className="">   Département : {filiereE?.departementName}</h3>
                        <h3 className="">Chef du département : {filiereE?.respDepartement?.firstName} {filiereE?.respDepartement?.lastName}</h3>
                      </div>
                    </div>
                  </div>
                </Row>
                <hr className="my-2" />
                <div className=""> 
                  <h5> 
                    Adresse e-mail :
                  </h5>
                </div>
                <div>
                  <h4>
                    {filiereE?.respDepartement?.email}
                  </h4>
                </div>
                <hr className="my-2" />
                <div className=""> 
                  <h5>
                  Numéro de téléphone :
                  </h5>
                </div>                 
                <div>  
                  <h4> 
                    {filiereE?.respDepartement?.phone}
                  </h4>
                </div> 
                <hr className="my-2" />
              </CardBody>
            </Card>
            
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;