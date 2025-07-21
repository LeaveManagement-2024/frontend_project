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
  getFilirerByEmployee,
  getEmployeeById,
  getDepartmentByEmployee,
 
} from './employeeApi'; 
import {getAllGrades} from '../parametre/grades/gradesApi'
import{getAllPosts} from'../parametre/posts/postApi'
import{getAllFilieres} from '../parametre/filiere/filiereApi'
import { getAllDepartments } from '../parametre/departement/departementApi';


const EditEmployeeModal = (props) => {

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
  const [profileId, setProfileId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [filiereId, setFiliereId] = useState('');
  const [posts, setPosts] = useState([]);
  const [filieres, setFilieres] = useState([]);
 

  const navigate = useNavigate();


  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
      }
    };
    const fetchFilieres = async () => {
      try {
        const filieresData = await getAllDepartments();
        setFilieres(filieresData);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
      }
    };
    fetchPosts();
    fetchFilieres();
    if (props.empl && props.empl.idE) {
      fetchEmployee();
      fetchFilierEmployee(props.empl.idE)
    }
  }, [props.empl.idE]);

  const fetchFilierEmployee = async (id) => {
    try {
      const filiereEmData = await getDepartmentByEmployee(id);
     setFiliereId(filiereEmData.idDepartement);
    } catch (error) {
      console.error('Erreur lors de la récupération des departement de lemployee', error);
    }
  };

  const handleChange = (e) => {
    
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      setImage(files[0]);
    } else {
      switch (id) {
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
        case 'postId':
          setPostId(value);
          break;
        case 'profileId':
          setProfileId(value);
          break;
        case 'filiereId':
          setFiliereId(value);
          break;
        default:
          break;
      }
    }
  };

 

  const handleAddEmployee = async () => {
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
      formData.append('departmentId', filiereId);
      formData.append('profileId', 1);

      if(image !== null){
        formData.append('image', image)
    }

    await axios({
          method: 'put',
          url: `http://localhost:8093/employee/update/${props.empl.idE}`,
          data: formData,
          headers: { 'Content-Type': 'multipart/form-data' }
    }).then((response) => {
          console.log(response.data)
          window.location.reload();
    })
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const [employee, setEmployee] = useState({});
  const fetchEmployee = async () => {
    try {
      const data = await getEmployeeById(props.empl.idE);
      setEmployee(data);
      setFirstName(data.firstName)
      setLastName(data.lastName)
      setEmail(data.email)
      setPhone(data.phone)
      setPpr(data.ppr)
      setCin(data.cin)
      setAddress(data.address)
      setHireDate(data.hireDate)
      setWorkLocation(data.workLocation)
      setPostId(data?.post?.idPost)
      setImage("")
     
       } catch (error) {
      console.error('Error fetching employee:', error);
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
              <h4 className='text-center text-xl'>  Modifier les informations de l'employee  {/*props.empl.idE*/}</h4>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className=" text-left mb-4  "style={{ fontSize: '1.3em' }}>
                   Les informations personnels
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup className="text-left">
                          <label
                            className="form-control-label"ك
                            htmlFor="input-first-name"
                          >
                            Nom
                          </label>
                          <Input
                            className="form-control-alternative text-left"                           
                            id="lastName"
                            placeholder="Nom"
                            type="text"
                            value={lastName}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">    
                        <FormGroup className="text-left">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Prénom 
                          </label>
                          <Input
                            className="form-control-alternative text-left"
                        
                            id="firstName"
                            placeholder="Prénom"
                            type="text"
                            value={firstName}
                            onChange={handleChange}
                          /> 
                        </FormGroup>
                      </Col>
                     
                     
                    </Row>
                    <Row>
                      
                    </Row>
                     <Row>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                              Numéro de la carte d'identité
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="cin"
                            placeholder="E161616"
                            type="text"
                            value={cin}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label
                            className="form-control-label text-left"
                            htmlFor="input-email"
                          >
                           Adresse e-mail
                          </label>
                          <Input
                            className="form-control-alternative "
                            id="email"
                            placeholder="jesse@example.com"
                            type="email"
                            value={email}
                            onChange={handleChange}
                          />
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
                            placeholder="ville, quartier, numéro de maison"
                            type="text"
                            value={address}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>
                  <hr className="my-4" />
                  
                  {/* Address */}
                  <h6 className="heading-small  mb-4 "style={{ fontSize: '1.5em' }}>
                     Informations de travail
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="4">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                             Numéro de Employees
                          </label>
                          <Input
                            className="form-control-alternative "
                           
                            id="ppr"
                            type="text"
                            value={ppr}
                            onChange={handleChange}
                            placeholder=" Numéro de Employees"
                            
                        
                            
                          />
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
                            placeholder=" lieu de travail"
                            type="text"
                            value={workLocation}
                            onChange={handleChange}
                          />
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
                          <option value="">Poste</option>
                            {posts.map((post) => (
                          <option key={post.idPost} value={post.idPost}>
                            {post.postName}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="">
                          <label 
                            className="form-control-label "
                            htmlFor="input-country"
                          >
                            Departement
                          </label>
                          <Input 
                            className="form-control-alternative "
                            
                            id="filiereId"
                            value={filiereId}
                            placeholder="Departement"
                            type="select"
                            
                            onChange={handleChange}
                          >
                            <option value="">Departement</option>
                            {filieres.map((filiere) => (
                          <option key={filiere.idDepartement} value={filiere.idDepartement}>
                            {filiere.departementName}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                      
                      
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className=" text-left mb-4  "style={{ fontSize: '1.3em' }}>
                    Les informations de travail
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col  md="12">
                        <FormGroup className="text-left">
                          <label
                            className="form-control-label"
                            htmlFor="input-postal-code"
                          >
                              Lieu de travail
                          </label>
                          <Input
                            className="form-control-alternative text-left"
                            id="workLocation"
                            value={workLocation}
                            placeholder=" Votre lieu de travail "
                            type="text"
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small  mb-4 "style={{ fontSize: '1.3em' }}>
                   Mot de passe  
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup className="" >
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
                            placeholder=" Mot de passe"
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                    </Row>     
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small  mb-4 "style={{ fontSize: '1.3em' }}>  photo personnelle </h6>
                  <div className="pl-lg-4">
                    <FormGroup className="">                     
                      <div className="d-flex justify-content-center " style={{marginTop : '7px',marginBottom : '0px'}} >
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
          <Button variant="primary" onClick={handleAddEmployee}>
           Enregistrer
          </Button>
          <Button onClick={props.onHide}>Fermer</Button>
          
        </Modal.Footer>
      </Modal>
    );
  };
  export default EditEmployeeModal;