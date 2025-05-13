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

const AddPostModal = (props) => {

  const [postNameFr, setPostNameFr] = useState('');
  const [postNameAr, setPostNameAr] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'postNameFr':
        setPostNameFr(value);
        break;
      case 'postNameAr':
        setPostNameAr(value);
        break;
      default:
        break;
    }
  };

  const handleAddPost = async () => {
    try {
      const postData = {
        postNameFr,
        postNameAr,
      };

      await axios.post('http://localhost:8093/posts/save', postData)
        .then((response) => {
          console.log(response.data);
          window.location.reload();
        });
    } catch (error) {
      console.error('Error adding post:', error);
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
              <h4 className='text-center text-xl'>إضافة مهمة </h4>
            </CardHeader>
            <CardBody>
              <Form>
              <h6 className="heading-small text-right mb-4" style={{ fontSize: '1.5em' }}>
              معلومات المهمة
              </h6>
                
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="6">
                      <FormGroup className="text-left">
                        <label className="form-control-label" htmlFor="postNameAr">
                        Nom du poste 
                        </label>
                        <Input
                          className="form-control-alternative text-left"
                          id="postNameFr"
                          placeholder="Nom du poste "
                          type="text"
                          value={postNameFr}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">    
                      <FormGroup className="text-right">
                        <label className="form-control-label" htmlFor="postNameFr">
                        اسم المهمة
                        </label>
                        <Input
                          className="form-control-alternative text-right"
                          id="postNameAr"
                          placeholder="   اسم المهمة"
                          type="text"
                          value={postNameAr}
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
        <Button onClick={props.onHide}>خروج</Button>
        <Button variant="primary" onClick={handleAddPost}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPostModal;
