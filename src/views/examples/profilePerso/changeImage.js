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
import { useNavigate } from "react-router-dom";

const ChangeImage = (props) => {
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const handleChange = (e) => {
    setImage(e.target.files[0]);  // Récupère le fichier sélectionné
  };

  const handleUpdateImage = async () => {
    if (!image) {
      alert('Veuillez sélectionner une image.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post(`http://localhost:8093/employee/image/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      props.onHide(); // Fermer le modal après la mise à jour réussie
      window.location.reload(); // Rafraîchir la page après la mise à jour
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      alert('Erreur lors de la mise à jour de l\'image');
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
            <h4 className='text-center text-xl'>  Changer la photo de profile</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <label>Choisir votre photo</label>
                <div className="d-flex justify-content-center" style={{ marginTop: '7px', marginBottom: '0px' }}>
                  <Input 
                    size="sm" 
                    type="file" 
                    onChange={handleChange}  // Gère le changement de fichier
                  />
                </div>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide} color="warning">Quitter</Button>
        <Button variant="primary" color="primary" onClick={handleUpdateImage}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeImage;
