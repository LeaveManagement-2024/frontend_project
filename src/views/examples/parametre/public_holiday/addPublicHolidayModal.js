import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
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

const AddPublicHolidayModal = (props) => {

  const [name, setname] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setname(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'endDate':
        setEndDate(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleAddPublicHoliday = async () => {
    try {
      const publicHoliday = {
        name,
        startDate,
        endDate,
        description,
      };

      await axios.post('http://localhost:8093/publicHoliday/save', publicHoliday)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du jour férié :', error);
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
            <h4 className='text-center text-xl'>Ajouter un jour férié national ou religieux</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="holidayName">
                        Nom du jour férié
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="name"
                        placeholder="Nom du jour férié"
                        type="text"
                        value={name}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="startDate">
                        Date de début
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="startDate"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        value={startDate}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="endDate">
                        Date de fin
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="endDate"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        value={endDate}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="description">
                        Description
                      </label>
                      <Input
                        className="form-control-alternative"
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
        <Button color="primary" onClick={handleAddPublicHoliday}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPublicHolidayModal;
