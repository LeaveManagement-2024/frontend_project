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
  Container,
  Row,
  Col,
} from "reactstrap";

const AddProfileModal = (props) => {
  const [profileName, setProfileName] = useState('');
  
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'profileName') {
      setProfileName(value);
    }
  };

  const handleAddProfile = async () => {
    try {
      const profileData = { profileName };

      await axios.post('http://localhost:8093/profiles/save', profileData)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du profil :', error);
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
            <h4 className="text-center text-xl">Ajouter un profil</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="profileName">
                        Nom du profil
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="profileName"
                        placeholder="Nom du profil"
                        type="text"
                        value={profileName}
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
        <Button variant="primary" onClick={handleAddProfile}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProfileModal;
