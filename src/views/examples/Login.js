import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom"; // Pour la navigation
import axios from "axios"; // Pour effectuer des appels API
import './style.css'; // Importer le fichier CSS
import { HiLogin } from "react-icons/hi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const dfsd = async (e) => {
    e.preventDefault();
    setError(""); // Effacer les erreurs précédentes

    try {
      const response = await axios.post("http://localhost:8093/employee/login", { email, password });
      
      if (response.data.success) {
        // Rediriger vers le tableau de bord en cas de connexion réussie
        navigate('/index');
      } else {
        // Afficher un message d'erreur en cas d'échec de connexion
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.");
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8093/employee/login", {
        email: email,
        password: password,
      }).then((res) => {
        console.log(res.data);
        
        if (res.data.message === "Email Not Exist") {
          alert("L'email n'existe pas");
        } else if (res.data.message === "login Success") {
          localStorage.setItem('userId', res.data.id); // Stocker l'ID de l'utilisateur
          navigate('/admin/index');
        } else {
          alert("Email ou mot de passe incorrect");
        }
      }, fail => {
        console.error(fail); // Erreur !
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="card-blur shadow border-0">
          <CardHeader className="bg-transparent pb-3">
            <div className="text-muted text-center mt-1 mb-1">
           
              <span className="text-white" style={{fontSize:'3em'}}> Connexion</span> 
             
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-4">
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3 ">
                <InputGroup className="input-group-alternative card-blur">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Adresse e-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative card-blur">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                  
                    placeholder="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>
              
              {error && <div className="text-danger text-center mt-3">{error}</div>}
              <div className="text-center">
                <Button className="my-4 text-lg" color="primary" type="submit" style={{width:"250px"}}>
                <HiLogin  className="text-white" style={{fontSize:'2em'}} /> Connexion
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Mot de passe oublié</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
              <small>Créer un nouveau compte</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;