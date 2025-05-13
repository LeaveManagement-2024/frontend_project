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

const AddEmpInAL = (props) => {

  const [nbr, setNbr] = useState('');
  const [errors, setErrors] = useState({}); // État pour suivre les erreurs de validation

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'nbr':
        setNbr(value);
        break;
      default:
        break;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!nbr) newErrors.gradeNameAr = 'Veuillez entrer le nombre de jours de congé.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post(`http://localhost:8093/annualLeaveLine/save/${props.idan}/${nbr}`)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la ligne de congé annuel :', error);
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
            <h4 className='text-center text-xl'>Ajouter des employés au congé annuel</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="gradeNameAr">
                        Nombre de jours de congé
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="nbr"
                        value={nbr}
                        onChange={handleChange}
                        type="number"
                      />
                      {errors.gradeNameAr && (
                        <div className="text-danger">{errors.nbr}</div>
                      )}
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
        <Button variant="primary" onClick={handleAdd}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmpInAL;