import swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
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
import axios from 'axios';
import { useState, useEffect } from 'react';
import 'wicg-inert';

const UpdateAnnualLeaveModal = (props) => {
  const { leaveId, show, onHide } = props;
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');

  // Récupérer les données existantes du congé annuel pour l'ID sélectionné lorsque le modal est ouvert
  useEffect(() => {
    const fetchAnnualLeave = async () => {
      if (props.annualLeaveData.annualLeaveId) {
        try {
          const response = await axios.get(`http://localhost:8093/annualLeave/getById/${props.annualLeaveData.annualLeaveId}`);
          const { startDate, endDate, label, status } = response.data;
          setStartDate(startDate);
          setEndDate(endDate);
          setLabel(label);
          setStatus(status);
        } catch (error) {
          console.error('Erreur lors de la récupération des données du congé :', error);
        }
      }
    };

    if (show) {
      fetchAnnualLeave();
    }
  }, [leaveId, show]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'label':
        setLabel(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'endDate':
        setEndDate(value);
        break;
      case 'status':
        setStatus(value);
        break;
      default:
        break;
    }
  };

  const handleUpdateAnnualLeave = async () => {
    try {
      const updatedAnnualLeaveData = {
        startDate,
        endDate,
        label,
        status,
      };

      const response = await axios.put(`http://localhost:8093/annualLeave/update/${props.annualLeaveData.annualLeaveId}`, updatedAnnualLeaveData);
      console.log(response.data);
        window.location.reload(); // Recharger la page après confirmation
    } catch (error) {
      console.error('Erreur lors de la mise à jour du congé :', error);
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onHide}
      aria-hidden={!show}
    >  
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className="text-center text-xl">Modification de congé annuel {props.annualLeaveData.annualLeaveId}</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-leave-status">
                        Statut du congé annuel
                      </label>
                      <Input 
                        className="form-control-alternative text-right"
                        id="status"
                        type="select"
                        value={status}
                        onChange={handleChange}
                      >
                        <option value="">Choisir un statut</option> 
                        <option value="enabled">Activé</option>
                        <option value="disabled">Désactivé</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-leave-date">
                        Nom du congé annuel
                      </label>
                      <Input 
                        className="form-control-alternative text-right"
                        id="label"
                        placeholder="Nom du congé"
                        type="text"
                        value={label}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">    
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-leave-type">
                        Fin du congé annuel
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="endDate"
                        placeholder="Fin du congé annuel"
                        type="date"
                        value={endDate}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col> 
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-employee-name">
                        Début du congé annuel
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="startDate"
                        placeholder="Début du congé annuel"
                        type="date"
                        value={startDate}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={onHide}>Quitter</Button>
        <Button color="primary" onClick={handleUpdateAnnualLeave}>Mettre à jour</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateAnnualLeaveModal;