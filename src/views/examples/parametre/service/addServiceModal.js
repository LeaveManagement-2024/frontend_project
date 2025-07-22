import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from 'axios';
import {
  getAllDepartments
} from "../departement/departementApi"
import {
  getAllEmployees,
} from '../../Employess/employeeApi';

const AddServiceModal = (props) => {

  const [nomServiceFr, setNomServiceFr] = useState('');
  const [nomServiceAr, setNomServiceAr] = useState('');
  const [idDepartement, setIdDepartement] = useState('');
  const [idResponsableService, setIdResponsableService] = useState(0);
  const [departements, setDepartements] = useState([]);
  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    fetchAllDepartments();
    fetchAllEmployees();
  }, []);

  const fetchAllDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartements(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des départements :', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployes(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés :', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'nomServiceFr':
        setNomServiceFr(value);
        break;
      case 'nomServiceAr':
        setNomServiceAr(value);
        break;
      case 'idDepartement':
        setIdDepartement(value);
        break;
      case 'idResponsableService':
        setIdResponsableService(value);
        break;
      default:
        break;
    }
  };

  const handleAddService = async () => {
    try {
      const service = {
        serviceNameFr: nomServiceFr,
        serviceNameAr: nomServiceAr,
        idDepartment: idDepartement,
        respServiceId: idResponsableService
      };

      await axios.post('http://localhost:8093/services/save', service)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du service :', error);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className='text-center text-xl'>Ajouter un service</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
              
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="nomServiceFr">
                        Nom du service 
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="nomServiceFr"
                        placeholder="Entrez le nom du service"
                        type="text"
                        value={nomServiceFr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="idDepartement">
                        Département
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="idDepartement"
                        type="select"
                        value={idDepartement}
                        onChange={handleChange}
                      >
                        <option value="">Choisissez un département</option>
                        {departements.map((departement) => (
                          <option key={departement.idDepartement} value={departement.idDepartement}>
                            {departement.departementNameFr || departement.departementNameAr}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup>
                      <label className="form-control-label" htmlFor="idResponsableService">
                        Responsable du service
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="idResponsableService"
                        type="select"
                        value={idResponsableService}
                        onChange={handleChange}
                      >
                        <option value="">Choisissez le responsable</option>
                        {(employes||[]).map((emp) => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastNameFr || emp.lastNameAr} {emp.firstNameFr || emp.firstNameAr}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>Fermer</Button>
        <Button color="primary" onClick={handleAddService}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddServiceModal;
