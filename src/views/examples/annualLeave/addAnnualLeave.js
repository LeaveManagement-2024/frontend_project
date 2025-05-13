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
import { useState } from 'react';
import 'wicg-inert';

const AddAnnualLeaveModal = (props) => {
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('');

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

  const handleAddAnnualLeave = async () => {
    try {
      const annualLeaveData = {
        startDate,
        endDate,
        label,
        status,
      };

      const response = await axios.post('http://localhost:8093/annualLeave/save', annualLeaveData);
      console.log(response.data);
      
      // Afficher une alerte de succès avec SweetAlert2
      swal.fire({
        title: 'Ajouté avec succès!',
        text: 'Le congé annuel a été ajouté avec succès.',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload(); // Recharger la page après confirmation
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du congé :', error);
      
      // Afficher une alerte d'erreur avec SweetAlert2
      swal.fire({
        title: 'Erreur!',
        text: 'Une erreur s\'est produite lors de l\'ajout du congé annuel.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={props.show}
      onHide={props.onHide}
      aria-hidden={!props.show} 
    >  
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className="text-center text-xl">Ajouter un congé annuel</h4>
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
        <Button onClick={props.onHide}>Quitter</Button>
        <Button color="primary" onClick={(handleAddAnnualLeave)} >Enregistrer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddAnnualLeaveModal;