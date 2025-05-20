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

  const [postName, setPostName] = useState('');
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'postName':
        setPostName(value);
        break;
      default:
        break;
    }
  };

  const handleAddPost = async () => {
    try {
      const postData = {
        postName,
    
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
              <h4 className='text-center text-xl'> Ajouter Un poste </h4>
            </CardHeader>
            <CardBody>
              <Form>
              <h6 className="heading-small mb-4" style={{ fontSize: '1em' }}>
               Information Du poste
              </h6>
                
                <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup className="text-left">
                        <label className="form-control-label" htmlFor="postName">
                        Nom du poste 
                        </label>
                        <Input
                          className="form-control-alternative text-left"
                          id="postName"
                          placeholder="Nom du poste "
                          type="text"
                          value={postName}
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
        <Button variant="primary" onClick={handleAddPost}>
          Ajouter
        </Button>
        <Button onClick={props.onHide}>Fermer</Button>
        
      </Modal.Footer>
    </Modal>
  );
};

export default AddPostModal;
