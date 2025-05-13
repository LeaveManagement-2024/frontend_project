import Modal from 'react-bootstrap/Modal';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";
import '../style.css';
import ChangePass from './changePasswordP';
import ChangeImage from './changeImage';

const Parametre = (props) => {

    const [modalShow, setModalShow] = useState(false);
    const [modalShow1, setModalShow1] = useState(false);

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
              <h4 className='text-center text-xl'>Paramètres</h4>
              </CardHeader>
              <CardBody>
                <div className="cards">
                    
                    <Button className="card red" onClick={() => setModalShow(true)}>
                        <p className="tip text-lg">Changer le mot de passe</p>
                    </Button>
                    <ChangePass show={modalShow} onHide={() => setModalShow(false)}></ChangePass>
                    
                    <Button className="card green" onClick={() => setModalShow1(true)}>
                        <p className="tip text-lg">Changer la photo de profil</p>
                    </Button>
                    <ChangeImage show={modalShow1} onHide={() => setModalShow1(false)}></ChangeImage>
                </div>
              </CardBody>
            </Card>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <Button onClick={props.onHide} color="warning">Quitter</Button>
        </Modal.Footer>
      </Modal>
    );
};

export default Parametre;