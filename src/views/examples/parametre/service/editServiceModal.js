import Modal from 'react-bootstrap/Modal';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { getServiceById, updateService } from './serviceApi'; // Assurez-vous d'avoir créé ces fonctions dans un fichier API séparé
import { getAllDepartments } from "../departement/departementApi";
import { getAllEmployees } from '../../Employess/employeeApi';

const EditServiceModal = (props) => {
  const [serviceNameFr, setServiceNameFr] = useState('');
  const [serviceNameAr, setServiceNameAr] = useState('');
  const [idDepartment, setIdDepartment] = useState('');  
  const [respServiceId, setRespServiceId] = useState('');
  const [departements, setDepartements] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getServiceById(props.serv.idService);
        setServiceNameAr(data.serviceNameAr);
        setServiceNameFr(data.serviceNameFr);
        setIdDepartment(data?.departement?.idDepartement);
        setRespServiceId(data?.respService?.idE);
      } catch (error) {
        console.error('Erreur lors de la récupération du service :', error);
      }
    };

    fetchService();
    fetchAllDepartments();
    fetchAllEmployees();
  }, [props.serv.idService]);

  const fetchAllDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartements(data);
    } catch (error) {
      console.error('Erreur lors du chargement des départements :', error);
    }
  };

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés :', error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'serviceNameFr':
        setServiceNameFr(value);
        break;
      case 'serviceNameAr':
        setServiceNameAr(value);
        break;
      case 'idDepartment':
        setIdDepartment(value);
        break;
      case 'respServiceId':
        setRespServiceId(value);
        break;
      default:
        break;
    }
  };

  const handleUpdateService = async () => {
    try {
      const updatedService = {
        serviceNameFr,
        serviceNameAr,
        idDepartment,
        respServiceId
      };

      await axios({
        method: 'put',
        url: `http://localhost:8093/services/update/${props.serv.idService}`,
        data: updatedService,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service :', error);
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
            <h4 className='text-center text-xl'>Modifier le service</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="serviceNameFr">
                        Nom du service 
                      </label>
                      <Input
                        className="form-control-alternative text-left"
                        id="serviceNameFr"
                        placeholder="Nom du service en français"
                        type="text"
                        value={serviceNameFr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="idDepartment">
                        Département
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="idDepartment"
                        type="select"
                        value={idDepartment}
                        onChange={handleChange}
                      >
                        <option value="">Choisir un département</option>
                        {departements.map((departement) => (
                          <option key={departement.idDepartement} value={departement.idDepartement}>
                            {departement.departementNameFr}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="respServiceId">
                        Responsable du service
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="respServiceId"
                        type="select"
                        value={respServiceId}
                        onChange={handleChange}
                      >
                        <option value="">Choisir le responsable</option>
                        {employees.map((emp) => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastNameFr} {emp.firstNameFr}
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
        <Button variant="primary" onClick={handleUpdateService}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditServiceModal;
