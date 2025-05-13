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
import { getPublicHolidayById, updatePublicHoliday } from './public_holidayApi'; // Assurez-vous d’avoir créé ces fonctions dans un fichier API séparé

const EditPublicHolidayModal = (props) => {
  const [nom, setNom] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setNom(value);
        break;
      case 'startDate':
        setDateDebut(value);
        break;
      case 'endDate':
        setDateFin(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchPublicHoliday = async () => {
      try {
        const data = await getPublicHolidayById(props.publicHoliday.id);
        setNom(data.name);
        setDateDebut(data.startDate);
        setDateFin(data.endDate);
        setDescription(data.description);
      } catch (error) {
        console.error('Erreur lors de la récupération du jour férié :', error);
      }
    };
    fetchPublicHoliday();
  }, [props.publicHoliday.id]);

  const handleUpdatePublicHoliday = async () => {
    try {
      const updatedPublicHoliday = {
        name: nom,
        startDate: dateDebut,
        endDate: dateFin,
        description,
      };

      await axios({
        method: 'put',
        url: `http://localhost:8093/publicHoliday/update/${props.publicHoliday.id}`,
        data: updatedPublicHoliday,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du jour férié :', error);
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
            <h4 className='text-center text-xl'>Modifier un jour férié</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="name">
                        Nom du jour férié
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="name"
                        placeholder="Nom du jour férié"
                        type="text"
                        value={nom}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="startDate">
                        Date de début
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="startDate"
                        placeholder="AAAA-MM-JJ"
                        type="date"
                        value={dateDebut}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="endDate">
                        Date de fin
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="endDate"
                        placeholder="AAAA-MM-JJ"
                        type="date"
                        value={dateFin}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="description">
                        Description
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="description"
                        placeholder="Description du jour férié"
                        type="textarea"
                        value={description}
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
        <Button onClick={props.onHide}>Fermer</Button>
        <Button variant="primary" onClick={handleUpdatePublicHoliday}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPublicHolidayModal;
