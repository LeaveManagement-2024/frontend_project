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
  Badge,
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

  // Styles personnalisés ultra-compacts
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    paddingBottom: '0.5rem' // Ultra réduit de 2rem
  };

  const profileCardStyle = {
    borderRadius: '12px', // Réduit de 20px
    border: 'none',
    boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.08)', // Réduit
    background: '#ffffff',
    overflow: 'hidden'
  };

  const avatarContainerStyle = {
    position: 'relative',
    width: '80px', // Ultra réduit de 150px
    height: '80px',
    margin: '0 auto',
    borderRadius: '50%',
    padding: '2px', // Réduit de 4px
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  };

  const avatarStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid white' // Réduit de 4px
  };

  const sectionHeaderStyle = {
    fontSize: '0.9rem', // Ultra réduit de 1.2rem
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '0.8rem', // Réduit de 1.5rem
    padding: '0.3rem 0', // Réduit de 0.5rem
    borderBottom: '2px solid #e5e7eb', // Réduit de 3px
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem' // Réduit de 0.5rem
  };

  const inputStyle = {
    borderRadius: '8px', // Réduit de 12px
    border: '1px solid #e5e7eb', // Réduit de 2px
    padding: '8px 12px', // Réduit de 12px 16px
    fontSize: '12px', // Réduit de 14px
    backgroundColor: '#f9fafb',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    fontWeight: '600',
    color: '#374151',
    fontSize: '12px', // Réduit de 14px
    marginBottom: '4px' // Réduit de 8px
  };

  const departmentCardStyle = {
    borderRadius: '12px', // Réduit de 20px
    border: 'none',
    boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.08)', // Réduit
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    overflow: 'hidden'
  };

  const badgeStyle = {
    fontSize: '10px', // Réduit de 12px
    padding: '4px 8px', // Réduit de 6px 12px
    borderRadius: '12px', // Réduit de 20px
    fontWeight: '600'
  };

  return (
    <>
      <Header2 />
      {/* Contenu de la page */}
      <Container className="mt--7" fluid style={containerStyle}>
        <Row className="justify-content-center">
          {/* Carte principale du profil */}
          <Col className="order-xl-1" xl="8">
            <Card style={profileCardStyle}>
              {/* Section avatar et en-tête */}
              <div style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                padding: '1rem 0 2rem 0', // Ultra réduit de 2rem 0 4rem 0
                position: 'relative'
              }}>
                <div className="text-center">
                  <div 
                    style={avatarContainerStyle}
                    onClick={() => setModalShow1(true)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <img
                      alt="Photo de profil"
                      style={avatarStyle}
                      src={employee.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: '5px', // Réduit de 10px
                      right: '5px',
                      background: 'white',
                      borderRadius: '50%',
                      width: '20px', // Réduit de 30px
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px' // Réduit de 14px
                    }}>
                      📷
                    </div>
                  </div>
                  <ChangeImage show={modalShow1} onHide={() => setModalShow1(false)} />
                  
                  <h2 style={{ color: 'white', marginTop: '0.5rem', fontWeight: '700', fontSize: '1.1rem' }}> {/* Ultra réduit */}
                    {employee.firstName} {employee.lastName}
                  </h2>
                  <Badge color="light" style={badgeStyle}>
                    {employee?.post?.postName || 'Poste non défini'}
                  </Badge>
                </div>
              </div>

              <CardHeader className="bg-white border-0" style={{ marginTop: '-1rem', position: 'relative', zIndex: 1 }}> {/* Réduit de -2rem */}
                <Row className="align-items-center">
                    <h3 className="mb-0" style={{ color: '#1f2937', fontWeight: '700', fontSize: '1rem' }}> {/* Réduit */}
                      📋 Mon Profil
                    </h3>
                    <Button
                      style={{
                        marginLeft: '400px', // Réduit de 600px
                        border: 'none',
                        borderRadius: '15px', // Réduit de 25px
                        padding: '6px 12px', // Réduit de 10px 20px
                        fontWeight: '600',
                        fontSize: '11px' // Réduit de 13px
                      }}
                      onClick={() => setModalShow(true)}
                      size="sm"
                    >
                      🔐 Changer le mot de passe
                    </Button>
                    <ChangePass show={modalShow} onHide={() => setModalShow(false)} />
                </Row>
              </CardHeader>

              <CardBody style={{ padding: '1rem' }}> {/* Ultra réduit de 2rem */}
                <Form>
                  {/* Informations personnelles */}
                  <div style={sectionHeaderStyle}>
                    <span>👤</span>
                    Informations personnelles
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup className="mb-3"> {/* Réduit de mb-4 */}
                          <label style={labelStyle} htmlFor="input-first-name">
                            Prénom
                          </label>
                          <Input
                            style={inputStyle}
                            id="input-first-name"
                            placeholder="Prénom"
                            type="text"
                            defaultValue={employee.firstName}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-last-name">
                            Nom de famille
                          </label>
                          <Input
                            style={inputStyle}
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
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-cin">
                            Numéro de carte nationale
                          </label>
                          <Input
                            style={inputStyle}
                            defaultValue={employee.cin}
                            id="input-cin"
                            placeholder="Numéro de carte nationale"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-email">
                            📧 Adresse e-mail
                          </label>
                          <Input
                            style={inputStyle}
                            id="input-email"
                            placeholder="exemple@email.com"
                            type="email"
                            defaultValue={employee.email}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-phone">
                            📱 Numéro de téléphone
                          </label>
                          <Input
                            style={inputStyle}
                            defaultValue={employee.phone}
                            id="input-phone"
                            placeholder="Numéro de téléphone"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-address">
                            🏠 Adresse
                          </label>
                          <Input
                            style={inputStyle}
                            defaultValue={employee.address}
                            id="input-address"
                            placeholder="Adresse"
                            type="text"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  <hr style={{ margin: '1rem 0', border: 'none', height: '1px', background: '#e5e7eb' }} /> {/* Ultra réduit */}
                  
                  {/* Informations professionnelles */}
                  <div style={sectionHeaderStyle}>
                    <span>💼</span>
                    Informations professionnelles
                  </div>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-ppr">
                            🆔 Numéro de matricule
                          </label>
                          <Input
                            style={inputStyle}
                            id="input-ppr"
                            placeholder="Numéro de matricule"
                            type="text"
                            defaultValue={employee.ppr}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-hire-date">
                            📅 Date d'embauche
                          </label>
                          <Input
                            style={inputStyle}
                            defaultValue={employee.hireDate}
                            id="input-hire-date"
                            type="date"
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-work-location">
                            📍 Lieu de travail
                          </label>
                          <Input
                            style={inputStyle}
                            id="input-work-location"
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
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-post">
                            👔 Poste
                          </label>
                          <Input
                            style={inputStyle}
                            id="input-post"
                            placeholder="Poste"
                            type="text"
                            defaultValue={employee?.post?.postName}
                            disabled
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="mb-3">
                          <label style={labelStyle} htmlFor="input-department">
                            🏢 Département
                          </label>
                          <Input
                            style={inputStyle}
                            defaultValue={filiereE?.departementName}
                            id="input-department"
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

          {/* Carte du département */}
          <Col className="order-xl-1 mb-5 mb-xl-0" xl="4">
            <Card style={departmentCardStyle}>
              <div className="text-center" style={{ padding: '1rem 0' }}> {/* Ultra réduit de 2rem */}
                <div style={{
                  width: '70px', // Ultra réduit de 120px
                  height: '70px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  padding: '2px', // Réduit de 4px
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(6px)' // Réduit de 10px
                }}>
                  <img
                    alt="Chef de département"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid rgba(255, 255, 255, 0.8)' // Réduit de 3px
                    }}
                    src={filiereE?.service?.departement?.respDepartement?.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                  />
                </div>
              </div>

              <CardBody style={{ padding: '1rem' }}> {/* Ultra réduit de 2rem */}
                <div className="text-center mb-3"> {/* Réduit de mb-4 */}
                  <h3 style={{ color: 'white', fontWeight: '700', marginBottom: '0.3rem', fontSize: '1rem' }}> {/* Ultra réduit */}
                    🏢 {filiereE?.departementName}
                  </h3>
                  <Badge color="light" style={{ ...badgeStyle, fontSize: '9px' }}> {/* Ultra réduit */}
                    Mon Département
                  </Badge>
                </div>

                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  borderRadius: '10px', // Réduit de 15px
                  padding: '0.8rem', // Ultra réduit de 1.5rem
                  backdropFilter: 'blur(6px)' // Réduit de 10px
                }}>
                  <div className="mb-2"> {/* Réduit de mb-3 */}
                    <h5 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '11px', marginBottom: '4px' }}> {/* Ultra réduit */}
                      👨‍💼 Chef du département
                    </h5>
                    <h4 style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}> {/* Ultra réduit */}
                      {filiereE?.respDepartement?.firstName} {filiereE?.respDepartement?.lastName}
                    </h4>
                  </div>

                  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '0.5rem 0' }} /> {/* Ultra réduit */}

                  <div className="mb-2">
                    <h5 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '11px', marginBottom: '4px' }}>
                      📧 Email
                    </h5>
                    <h6 style={{ color: 'white', fontWeight: '500', wordBreak: 'break-word', fontSize: '0.8rem' }}> {/* Ultra réduit */}
                      {filiereE?.respDepartement?.email}
                    </h6>
                  </div>

                  <hr style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '0.5rem 0' }} />

                  <div>
                    <h5 style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '11px', marginBottom: '4px' }}>
                      📱 Téléphone
                    </h5>
                    <h6 style={{ color: 'white', fontWeight: '500', fontSize: '0.8rem' }}>
                      {filiereE?.respDepartement?.phone}
                    </h6>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;