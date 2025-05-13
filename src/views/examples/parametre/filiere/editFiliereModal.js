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
import { getFiliereById, updateFiliere } from './filiereApi'; // Assurez-vous d'avoir créé ces fonctions dans un fichier API séparé
import {
  getAllServices

} from "../service/serviceApi"

const EditFiliereModal = (props) => {

  const [filiereNameFr, setFiliereNameFr] = useState('');
  const [filiereNameAr, setFiliereNameAr] = useState('');
  const [idService,setIdService] = useState('');
  const [services,setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiliere = async () => {
      try {
        const data = await getFiliereById(props.fil.idFiliere);
        setFiliereNameFr(data.filiereNameFr);
        setFiliereNameAr(data.filiereNameAr);
        setIdService(data?.service?.idService);
      } catch (error) {
        console.error('Erreur lors de la récupération de la filière:', error);
      }
    };
    fetchFiliere();
    fetchAllServices();
  }, [props.fil.idFiliere]);

  const fetchAllServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'filiereNameFr':
        setFiliereNameFr(value);
        break;
      case 'filiereNameAr':
        setFiliereNameAr(value);
        break;
      case 'idService':
        setIdService(value);
        break;
      default:
        break;
    }
  };

  const handleUpdateFiliere = async () => {
    try {
      const updatedFiliere = {
        filiereNameFr,
        filiereNameAr,
        idService,
      };

      await axios({
        method: 'put',
        url: `http://localhost:8093/filieres/update/${props.fil.idFiliere}`,
        data: updatedFiliere,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating filiere:', error);
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
            <h4 className='text-center text-xl'>تعديل شعبة </h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small text-right mb-4" style={{ fontSize: '1.5em' }}>
              معلومات الشعبة
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="filiereNameAr">
                        اسم الشعبة 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="filiereNameAr"
                        placeholder="اسم الشعبة "
                        type="text"
                        value={filiereNameAr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">    
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="filiereNameFr">
                        Nom de la filière 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="filiereNameFr"
                        placeholder="Nom de la filière "
                        type="text"
                        value={filiereNameFr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                      <Col md="12">
                        <FormGroup className="text-right" >
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            المصلحة
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                           
                            id="idService"
                            placeholder="المصلحة"
                            type="select"
                            value={idService}
                            onChange={handleChange}
                        
                          >
                            
                          <option value>اختر المصلحة </option>
                          {services.map((service) => (
                          <option key={service.idService} value={service.idService}>
                            {service.serviceNameAr}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                    </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>خروج</Button>
        <Button variant="primary" onClick={handleUpdateFiliere}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditFiliereModal;
