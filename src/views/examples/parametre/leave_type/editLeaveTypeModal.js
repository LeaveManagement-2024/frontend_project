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
import{
  getLeaveTypeById
} from "./leaveTypeApi"

const EditLeaveTypeModal = (props) => {

  const [name, setName] = useState('');
  const [LeaveType,setLeaveType]= useState('');

  useEffect(() => {
    fetchLeaveType(props.leaveType.leaveTypeId);
  }, [props.leaveType.leaveTypeId]);


  const fetchLeaveType = async (id) => {
    if (!id) {
      console.error('Error: LeaveType ID is undefined.');
      return;
    }
    try {
      const data = await getLeaveTypeById(id);
      setLeaveType(data);
      setName(data.name);
    } catch (error) {
      console.error('Error fetching LeaveType:', error);
    }
  };

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

  const handleUpdateLeaveType = async () => {
    try {
      const leaveTypeData = {
       name
      };

      await axios.put(`http://localhost:8093/leaveTypes/update/${props.leaveType.leaveTypeId}`, leaveTypeData)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Error updating leave type:', error);
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
            <h4 className='text-center text-xl'> Modifier le type de congé  </h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small mb-4" style={{ fontSize: '1em' }}>
                Les informations  sur le type de congé
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="">
                      <label className="form-control-label" htmlFor="leaveTypeNameAr">
                        Nom de type de congé  
                      </label>
                      <Input
                        className="form-control-alternative"
                        id="name"
                        placeholder="Nom de type de congé "
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
        <Button variant="primary" onClick={handleUpdateLeaveType}>
          Enregistrer
        </Button>
        <Button onClick={props.onHide}>Fermer</Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default EditLeaveTypeModal;
