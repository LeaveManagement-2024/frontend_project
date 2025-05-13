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
import { getGradeById, updateGrade } from './gradesApi'; // Assuming these functions exist for interacting with the grade API.

const EditGradeModal = (props) => {

  const [gradeNameFr, setGradeNameFr] = useState('');
  const [gradeNameAr, setGradeNameAr] = useState('');
  

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const data = await getGradeById(props.grade.idGrade);
        setGradeNameFr(data.gradeNameFr);
        setGradeNameAr(data.gradeNameAr);
       
      } catch (error) {
        console.error('Erreur lors de la récupération du grade:', error);
      }
    };
    fetchGrade();
  }, [props.grade.idGrade]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'gradeNameFr':
        setGradeNameFr(value);
        break;
      case 'gradeNameAr':
        setGradeNameAr(value);
        break;
       default:
        break;
    }
  };

  const handleUpdateGrade = async () => {
    try {
      const gradeData = {
        gradeNameFr,
        gradeNameAr,
      };

      await axios({
        method: 'put',
        url: `http://192.168.1.10:8093/grades/update/${props.grade.idGrade}`,
        data: gradeData,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating grade:', error);
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
            <h4 className='text-center text-xl'>تعديل الإطار</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small text-right mb-4" style={{ fontSize: '1.5em' }}>
                معلومات الإطار
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-grade-name-ar">
                        اسم الإطار
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="gradeNameAr"
                        placeholder="اسم الرتبة"
                        value={gradeNameAr}
                        onChange={handleChange}
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="12">
                    <FormGroup className="text-left">
                      <label className="form-control-label" htmlFor="input-grade-name-fr">
                        Nom du grade
                      </label>
                      <Input
                        className="form-control-alternative text-left"
                        id="gradeNameFr"
                        placeholder="Nom du grade"
                        value={gradeNameFr}
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
        <Button onClick={props.onHide}>خروج</Button>
        <Button variant="primary" onClick={handleUpdateGrade}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditGradeModal;
