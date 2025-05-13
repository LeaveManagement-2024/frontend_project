import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import axios from 'axios';
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

const AddLeaveTypeModal = (props) => {

  const [name, setName] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'name':
        setName(value);
        break;
      default:
        break;
    }
  };

  const handleAddLeaveType = async () => {
    try {
      const leaveTypeData = {
        name,
      };

      await axios.post('http://localhost:8093/leaveTypes/save', leaveTypeData)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du type de congé :', error);
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
            <h4 className='text-center text-xl'>Ajouter un type de congé</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="leaveTypeNameFr">
                        Nom du type de congé
                      </label>
                      <Input
                        className="form-control-alternative text-left"
                        id="name"
                        placeholder="Nom du type de congé"
                        value={name}
                        onChange={handleChange}
                        type="text"
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
        <Button variant="primary" onClick={handleAddLeaveType}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLeaveTypeModal;