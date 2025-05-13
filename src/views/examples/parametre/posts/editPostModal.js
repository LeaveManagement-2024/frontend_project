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
import { getPostById, updatePost } from './postApi'; // Assurez-vous d'avoir créé ces fonctions dans un fichier API séparé

const EditPostModal = (props) => {

  const [postNameFr, setPostNameFr] = useState('');
  const [postNameAr, setPostNameAr] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(props.post.idPost);
        setPostNameFr(data.postNameFr);
        setPostNameAr(data.postNameAr);
      } catch (error) {
        console.error('Erreur lors de la récupération du poste:', error);
      }
    };
    fetchPost();
  }, [props.post.idPost]);

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

  const handleUpdatePost = async () => {
    try {
      const updatedPost = {
        postNameFr,
        postNameAr,
      };

      await axios({
        method: 'put',
        url: `http://localhost:8093/posts/update/${props.post.idPost}`,
        data: updatedPost,
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Error updating post:', error);
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
            <h4 className='text-center text-xl'>تعديل المهمة </h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small text-right mb-4" style={{ fontSize: '1.5em' }}>
              معلومات المهمة
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="postNameAr">
                        اسم المهمة 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="postNameAr"
                        placeholder="اسم المهمة "
                        type="text"
                        value={postNameAr}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="postNameFr">
                        Nom du poste 
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="postNameFr"
                        placeholder="Nom du poste en français"
                        type="text"
                        value={postNameFr}
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
        <Button variant="primary" onClick={handleUpdatePost}>
          حفظ
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditPostModal;
