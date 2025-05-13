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
import { getDepartmentById, updateDepartment } from './departementApi'; // Assurez-vous d'avoir créé ces fonctions dans un fichier API séparé
import {
  getAllEmployees,
} from '../../Employess/employeeApi'; 
import Employees from 'views/examples/Employess/Employees';
const EditDepartmentModal = (props) => {

  const [departementNameFr, setDepartementNameFr] = useState('');
  const [departementNameAr, setDepartementNameAr] = useState('');
  const [respDepartementId,setRespDepartementId] =useState('');
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const data = await getDepartmentById(props.dep.idDepartement);
        setDepartementNameFr(data.departementNameFr);
        setDepartementNameAr(data.departementNameAr);
        setRespDepartementId(data?.respDepartement?.idE)
      } catch (error) {
        console.error('Erreur lors de la récupération du département:', error);
      }
    };
    fetchDepartment();
    fetchAllEmployees();
  }, [props.dep.idDepartement]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'departementNameFr':
        setDepartementNameFr(value);
        break;
      case 'departmentNameAr':
        setDepartementNameAr(value);
        break;
        case 'respDepartementId':
        setRespDepartementId(value);
        break;
      default:
        break;
    }
  };
  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };


  const handleUpdateDepartment = async () => {
    try {
      const updatedDepartment = {
        departementNameFr,
        departementNameAr,
        respDepartementId,
      };

      await axios({
        method: 'put',
        url: `http://localhost:8093/departments/update/${props.dep.idDepartement}`,
        data: updatedDepartment,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating department:', error);
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
            <h4 className='text-center text-xl'>تعديل قسم </h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small text-right mb-4" style={{ fontSize: '1.5em' }}>
                معلومات القسم
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="departmentNameAr">
                        اسم القسم 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="departmentNameAr"
                        placeholder="اسم القسم "
                        type="text"
                        value={departementNameAr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">    
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="departementNameFr">
                        département 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="departementNameFr"
                        placeholder="Nom du département en français"
                        type="text"
                        value={departementNameFr}
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
                            المسؤول عن القسم
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                           
                            id="respDepartementId"
                            placeholder="الرتبة"
                            type="select"
                            value={respDepartementId}
                            onChange={handleChange}
                        
                          >
                            
                          <option value="">اختر المسؤول عن القسم</option>
                          {employees.map((emp) => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastNameAr} {emp.firstNameAr}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row></Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>خروج</Button>
        <Button variant="primary" onClick={handleUpdateDepartment}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditDepartmentModal;
