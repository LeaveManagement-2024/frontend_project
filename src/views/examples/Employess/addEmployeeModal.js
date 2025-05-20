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
import {
  loginEmployee,
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getManagerByIdEmp,
  getResponsibleByIdEmp
} from './employeeApi'; 
import {getAllGrades} from '../parametre/grades/gradesApi'
import {getAllPosts} from '../parametre/posts/postApi'
import {getAllFilieres} from '../parametre/filiere/filiereApi'
import { getAllDepartments } from '../parametre/departement/departementApi';
import { useNavigate } from "react-router-dom";

const AddEmployeeModal = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ppr, setPpr] = useState('');
  const [cin, setCin] = useState('');
  const [address, setAddress] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [workLocation, setWorkLocation] = useState('');
  const [image, setImage] = useState(null);
  const [postId, setPostId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [filiereId, setFiliereId] = useState(0);
  const [grades, setGrades] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const gradesData = await getAllGrades();
        setGrades(gradesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des grades:', error);
      }
    };
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des postes:', error);
      }
    };
    const fetchFilieres = async () => {
      try {
        const filieresData = await getAllDepartments();
        setFilieres(filieresData);
      } catch (error) {
        console.error('Erreur lors de la récupération des filières:', error);
      }
    };
    fetchGrades();
    fetchPosts();
    fetchFilieres();
  }, []);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      setImage(files[0]);
    } else {
      switch (id) {
        case 'postId':
        case 'gradeId':
        case 'profileId':
        case 'filiereId':
          const numberValue = value ? Number(value) : '';
          if (id === 'postId') setPostId(numberValue);
          if (id === 'gradeId') setGradeId(numberValue);
          if (id === 'profileId') setProfileId(numberValue);
          if (id === 'filiereId') setFiliereId(numberValue);
          break;
        case 'firstName':
          setFirstName(value);
          break;
        case 'lastName':
          setLastName(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        case 'phone':
          setPhone(value);
          break;
        case 'ppr':
          setPpr(value);
          break;
        case 'cin':
          setCin(value);
          break;
        case 'address':
          setAddress(value);
          break;
        case 'hireDate':
          setHireDate(value);
          break;
        case 'workLocation':
          setWorkLocation(value);
          break;
        default:
          break;
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstNameFr = 'Le prénom est obligatoire';
    if (!lastName) newErrors.lastNameFr = 'Le nom est obligatoire';
    if (!email) newErrors.email = 'L\'email est obligatoire';
    if (!password) newErrors.password = 'Le mot de passe est obligatoire';
    if (!phone) newErrors.phone = 'Le numéro de téléphone est obligatoire';
    if (!ppr) newErrors.ppr = 'Le numéro de recrutement est obligatoire';
    if (!cin) newErrors.cin = 'Le numéro de la carte nationale est obligatoire';
    if (!address) newErrors.address = 'L\'adresse est obligatoire';
    if (!hireDate) newErrors.hireDate = 'La date d\'embauche est obligatoire';
    if (!workLocation) newErrors.workLocationFr = 'Le lieu de travail est obligatoire';
    if (!gradeId) newErrors.gradeId = 'Le grade est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEmployee = async () => {
    /* if (!validateForm()) {
      // return;
    } */
    try {
      const formData = new FormData();

      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('ppr', ppr);
      formData.append('cin', cin);
      formData.append('address', address);
      formData.append('hireDate', hireDate);
      formData.append('workLocation', workLocation);
      formData.append('postId', postId);
      formData.append('gradeId', gradeId); 
      formData.append('filiereId', filiereId);
   

      if (image !== null) {
        formData.append('image', image);
      }

      await axios({
        method: 'post',
        url: 'http://localhost:8093/employee/save',
        data: formData
      }).then((response) => {
        console.log(response.data);
        window.location.reload();
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'employé:', error);
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
            <h4 className='text-center text-xl'>Fiche de l'employé</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <h6 className="heading-small mb-4" style={{ fontSize: '1em' }}>
                Informations personnelles
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-first-name"
                      >
                        Nom
                      </label>
                      <Input
                        className="form-control-alternative "                           
                        id="lastName"
                        placeholder="Nom"
                        value={lastName}
                        onChange={handleChange}
                        type="text"
                      />
                      {errors.lastName && (
                        <div className="text-danger">{errors.lastName}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">    
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-last-name"
                      >
                        Prénom
                      </label>
                      <Input
                        className="form-control-alternative "
                        value={firstName}
                        onChange={handleChange}
                        id="firstName"
                        placeholder="Prénom"
                        type="text"
                      /> 
                      {errors.firstName && (
                        <div className="text-danger">{errors.firstName}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-username"
                      >
                        Numéro de la carte nationale
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="cin"
                        placeholder="E161616"
                        type="text"
                        value={cin}
                        onChange={handleChange}
                      />
                      {errors.cin && (
                        <div className="text-danger">{errors.cin}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label text-left"
                        htmlFor="input-email"
                      >
                        Email
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="email"
                        placeholder="jesse@example.com"
                        type="email"
                        value={email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="text-danger">{errors.email}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-first-name"
                      >
                        Numéro de téléphone
                      </label>
                      <Input 
                        className="form-control-alternative "
                        id="phone"
                        placeholder="06 56 30 98 03"
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <div className="text-danger">{errors.phone}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-last-name"
                      >
                        Adresse
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="address"
                        placeholder="Ville, quartier, numéro de maison"
                        type="text"
                        value={address}
                        onChange={handleChange}
                      />
                      {errors.addressAr && (
                        <div className="text-danger">{errors.addressAr}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              
              <hr className="my-4" />
              <h6 className="heading-small  mb-4" style={{ fontSize: '1.5em' }}>
                Informations professionnelles
              </h6>
              <div className="pl-lg-4">
                
                <Row>
                  <Col lg="4">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-city"
                      >
                        Numéro de recrutement
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="ppr"
                        type="text"
                        value={ppr}
                        onChange={handleChange}
                        placeholder="Numéro de recrutement"
                      />
                      {errors.ppr && (
                        <div className="text-danger">{errors.ppr}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Date d'embauche
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="hireDate"
                        value={hireDate}
                        onChange={handleChange}
                        type="date"
                      />
                      {errors.hireDate && (
                        <div className="text-danger">{errors.hireDate}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="4">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-postal-code"
                      >
                        Lieu de travail
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="workLocation"
                        placeholder="Lieu de travail"
                        type="text"
                        value={workLocation}
                        onChange={handleChange}
                      />
                      {errors.workLocationAr && (
                        <div className="text-danger">{errors.workLocationAr}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-city"
                      >
                        Poste
                      </label>
                      <Input
                        className="form-control-alternative "
                        id="postId"
                        placeholder="Poste"
                        type="select"
                        value={postId}
                        onChange={handleChange}
                      >
                        <option value="">Choisir le poste</option>
                        {posts.map((post) => (
                          <option key={post.idPost} value={post.idPost}>
                            {post.postName} {/* Note: Peut-être utiliser postNameFr ici */}
                          </option>
                        ))}
                      </Input>
                      {errors.postNameAr && (
                        <div className="text-danger">{errors.postNameAr}</div>
                      )}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="">
                      <label 
                        className="form-control-label"
                        htmlFor="input-country"
                      >
                        Departement
                      </label>
                      <Input 
                        className="form-control-alternative "
                        id="filiereId"
                        value={filiereId}
                        placeholder="Filière"
                        type="select"
                        onChange={handleChange}
                      >
                        <option value="">Choisir la filière</option>
                        {filieres.map((filiere) => (
                          <option key={filiere.idDepartement} value={filiere.idDepartement}>
                            {filiere.departementName} {/* Note: Peut-être utiliser filiereNameFr ici */}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              
              <hr className="my-4" />
              <h6 className="heading-small  mb-4" style={{ fontSize: '1.5em' }}>
                Saisie du mot de passe
              </h6>
              <div className="pl-lg-4">
                <Row>
                  <Col md="12">
                    <FormGroup className="">
                      <label
                        className="form-control-label"
                        htmlFor="input-address"
                      >
                        Mot de passe
                      </label>
                      <Input
                        className="form-control-alternative "
                        onChange={handleChange}
                        id="password"
                        value={password}
                        placeholder="Mot de passe"
                        type="password"
                      />
                      {errors.password && (
                        <div className="text-danger">{errors.password}</div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>     
              </div>
              <hr className="my-4" />
              <h6 className="heading-small  mb-4" style={{ fontSize: '1.5em' }}>
                Photo personnelle
              </h6>
              <div className="pl-lg-4">
                <FormGroup className="">                     
                  <div className="d-flex justify-content-center" style={{marginTop: '7px', marginBottom: '0px'}} >
                    <Input                                                       
                      size="sm" 
                      type="file"  
                      id="image"
                      onChange={handleChange}              
                    >                             
                    </Input>                         
                  </div>                     
                </FormGroup>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>Quitter</Button>
        <Button variant="primary" onClick={handleAddEmployee}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEmployeeModal;