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
import {
  getAllEmployees,
} from '../../Employess/employeeApi'; 

const AddDepartmentModal = (props) => {
  const [departementNameFr, setDepartementNameFr] = useState('');
  const [departementNameAr, setDepartementNameAr] = useState('');
  const [respDepartementId,setRespDepartementId] =useState(0);
  const [employees, setEmployees] = useState([]);
  const [headOfDepartment, setHeadOfDepartment] = useState('');
  const [errors, setErrors] = useState({}); // State to track validation errors

  const navigate = useNavigate();
  useEffect(() => {  
    fetchAllEmployees();

  }, []);
  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'departementNameFr':
        setDepartementNameFr(value);
        break;
      case 'departementNameAr':
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
  const handleAddDepartment = async () => {
    try {
      const departmentData = {
        departementNameFr,
        departementNameAr,
        respDepartementId,
      };

      await axios.post('http://localhost:8093/departments/save', departmentData)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Error adding department:', error);
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
            <h4 className='text-center text-xl'> إضافة قسم</h4>
          </CardHeader>
          <CardBody>
            <Form>
           
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="departmentNameFr">
                          Nom du département
                      </label>
                      <Input
                        className="form-control-alternative text-left"
                        id="departementNameFr"
                        placeholder=" Nom du département "
                        type="text"
                        value={departementNameFr}
                        onChange={handleChange}
                      />
                      {errors.departementNameFr && (
                        <div className="text-danger">{errors.departementName}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label " htmlFor="departmentNameAr" >
                      اسم القسم 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="departementNameAr"
                        placeholder="اسم القسم  "
                        type="text"
                        value={departementNameAr}
                        onChange={handleChange}
                      />
                       {errors.departementNameAr && (
                        <div className="text-danger">{errors.departementName}</div>
                      )}
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
                            {emp.lastName} {emp.firstName}
                          </option>
                        ))}</Input>
                        {errors.respDepartementId && (
                        <div className="text-danger">{errors.respDepartementId}</div>
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
        <Button onClick={props.onHide}>خروج</Button>
        <Button variant="primary" onClick={handleAddDepartment}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDepartmentModal;
