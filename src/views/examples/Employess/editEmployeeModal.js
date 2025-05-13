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
 
} from './employeeApi'; 
import {getAllGrades} from '../parametre/grades/gradesApi'
import{getAllPosts} from'../parametre/posts/postApi'
import{getAllFilieres} from '../parametre/filiere/filiereApi'


const EditEmployeeModal = (props) => {

  const [firstNameFr, setFirstNameFr] = useState('');
  const [firstNameAr, setFirstNameAr] = useState('');
  const [lastNameFr, setLastNameFr] = useState('');
  const [lastNameAr, setLastNameAr] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [ppr, setPpr] = useState('');
  const [cin, setCin] = useState('');
  const [addressFr, setAddressFr] = useState('');
  const [addressAr, setAddressAr] = useState('');
  const [hireDate, setHireDate] = useState('');
  const [workLocationFr, setWorkLocationFr] = useState('');
  const [workLocationAr, setWorkLocationAr] = useState('');
  const [image, setImage] = useState(null);
  const [postId, setPostId] = useState('');
  const [gradeId, setGradeId] = useState('');
  const [profileId, setProfileId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [responsibleId, setResponsibleId] = useState('');
  const [filiereId, setFiliereId] = useState('');
  const [grades, setGrades] = useState([]);
  const [posts, setPosts] = useState([]);
  const [filieres, setFilieres] = useState([]);
 

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
        console.error('Erreur lors de la récupération des posts:', error);
      }
    };
    const fetchFilieres = async () => {
      try {
        const filieresData = await getAllFilieres();
        setFilieres(filieresData);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts:', error);
      }
    };
    fetchGrades();
    fetchPosts();
    fetchFilieres();
    if (props.empl && props.empl.idE) {
      fetchEmployee();
      fetchFilierEmployee(props.empl.idE)
    }
  }, [props.empl.idE]);

  const fetchFilierEmployee = async (id) => {
    try {
      const filiereEmData = await getFilirerByEmployee(id);
     setFiliereId(filiereEmData.idFiliere);
    } catch (error) {
      console.error('Erreur lors de la récupération des filier de lemployee', error);
    }
  };

  const handleChange = (e) => {
    
    const { id, value, type, files } = e.target;
    if (type === 'file') {
      setImage(files[0]);
    } else {
      switch (id) {
        case 'firstNameFr':
          setFirstNameFr(value);
          break;
        case 'firstNameAr':
          setFirstNameAr(value);
          break;
        case 'lastNameFr':
          setLastNameFr(value);
          break;
        case 'lastNameAr':
          setLastNameAr(value);
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
        case 'addressFr':
          setAddressFr(value);
          break;
        case 'addressAr':
          setAddressAr(value);
          break;
        case 'hireDate':
          setHireDate(value);
          break;
        case 'workLocationFr':
          setWorkLocationFr(value);
          break;
        case 'workLocationAr':
          setWorkLocationAr(value);
          break;
        case 'postId':
          setPostId(value);
          break;
        case 'gradeId':
          setGradeId(value);
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
      formData.append('firstNameFr', firstNameFr);
      formData.append('firstNameAr', firstNameAr);
      formData.append('lastNameFr', lastNameFr);
      formData.append('lastNameAr', lastNameAr);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('phone', phone);
      formData.append('ppr', ppr);
      formData.append('cin', cin);
      formData.append('addressFr', addressFr);
      formData.append('addressAr', addressAr);
      formData.append('hireDate', hireDate);
      formData.append('workLocationFr', workLocationFr);
      formData.append('workLocationAr', workLocationAr);
      formData.append('postId', postId);
      formData.append('gradeId', gradeId); 
      formData.append('filiereId', filiereId);
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
      setFirstNameFr(data.firstNameFr)
      setFirstNameAr(data.firstNameAr)
      setLastNameFr(data.lastNameFr)
      setLastNameAr(data.lastNameAr)
      setEmail(data.email)
      setPhone(data.phone)
      setPpr(data.ppr)
      setCin(data.cin)
      setAddressFr(data.addressFr)
      setAddressAr(data.addressAr)
      setHireDate(data.hireDate)
      setWorkLocationFr(data.workLocationFr)
      setWorkLocationAr(data.workLocationAr)
      setFiliereId(data?.filiere?.idFiliere)
      setGradeId(data?.grade?.idGrade)
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
              <h4 className='text-center text-xl'>تعديل بطاقة الموظف {props.empl.idE}</h4>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-right mb-4 "style={{ fontSize: '1.5em' }}>
                   المعلومات الشخصية                 </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            الاسم العائلي
                          </label>
                          <Input
                            className="form-control-alternative text-right"                           
                            id="lastNameAr"
                            placeholder="الاسم العائلي"
                            value={lastNameAr}
                            onChange={handleChange}
                            type="text"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">    
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            الاسم الشخصي
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            value={firstNameAr}
                            onChange={handleChange}
                            id="firstNameAr"
                            placeholder="الاسم الشخصي"
                            type="text"
                          /> 
                        </FormGroup>
                      </Col>
                     
                     
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                              رقم البطاقة الوطنية
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            id="cin"
                            placeholder="E161616"
                            type="text"
                            value={cin}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label text-left"
                            htmlFor="input-email"
                          >
                             البريد الإلكتروني
                          </label>
                          <Input
                            className="form-control-alternative text-right"
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
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            رقم الهاتف
                          </label>
                          <Input 
                            className="form-control-alternative text-right"
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
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            العنوان
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            id="addressAr"
                            placeholder="المدينة،الحي،رقم المنزل"
                            type="text"
                            value={addressAr}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>
                  <hr className="my-4" />
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
                            id="lastNameFr"
                            placeholder="Nom"
                            type="text"
                            value={lastNameFr}
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
                        
                            id="firstNameFr"
                            placeholder="Prénom"
                            type="text"
                            value={firstNameFr}
                            onChange={handleChange}
                          /> 
                        </FormGroup>
                      </Col>
                     
                     
                    </Row>
                    <Row>
                      
                    </Row>
                    <Row>
                     
                      <Col md="12">
                        <FormGroup className="text-left">
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Adresse
                          </label>
                          <Input
                            className="form-control-alternative text-left"
                           
                            id="addressFr"
                            placeholder="Adresse"
                            type="text"
                            value={addressFr}
                            onChange={handleChange}
                              />
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>
                  <hr className="my-4" />
                  
                  {/* Address */}
                  <h6 className="heading-small text-right mb-4 "style={{ fontSize: '1.5em' }}>
                    معلومات العمل
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup className="text-right" >
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            الرتبة 
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                           
                            id="gradeId"
                            placeholder="الرتبة"
                            type="select"
                            value={gradeId}
                            onChange={handleChange}
                        
                          >
                            
                          <option value="">اختر الرتبة</option>
                        {grades.map((grade) => (
                          <option key={grade.idGrade} value={grade.idGrade}>
                            {grade.gradeNameAr}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            رقم التاجر
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                           
                            id="ppr"
                            type="text"
                            value={ppr}
                            onChange={handleChange}
                            placeholder="رقم التاجير"
                            
                        
                            
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            تاريخ التوظيف
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            
                            id="hireDate"
                            value={hireDate}
                            onChange={handleChange}
                            type="date"
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-postal-code"
                          >
                              مقر العمل
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            id="workLocationAr"
                            placeholder="مقر العمل"
                            type="text"
                            value={workLocationAr}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="text-right">
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            المهمة
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                           
                            id="postId"
                            placeholder="المهمة"
                            type="select"
                            value={postId}
                            onChange={handleChange}

                          >
                          <option value="">اخترالمهمة</option>
                            {posts.map((post) => (
                          <option key={post.idPost} value={post.idPost}>
                            {post.postNameAr}
                          </option>
                        ))}</Input>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="text-right">
                          <label 
                            className="form-control-label "
                            htmlFor="input-country"
                          >
                            الشعبة
                          </label>
                          <Input 
                            className="form-control-alternative text-right"
                            
                            id="filiereId"
                            value={filiereId}
                            placeholder="الشعبة"
                            type="select"
                            
                            onChange={handleChange}
                          >
                            <option value="">اخترالشعبة</option>
                            {filieres.map((filiere) => (
                          <option key={filiere.idFiliere} value={filiere.idFiliere}>
                            {filiere.filiereNameAr}
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
                            id="workLocationFr"
                            value={workLocationFr}
                            placeholder=" Votre lieu de travail "
                            type="text"
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-right mb-4 "style={{ fontSize: '1.5em' }}>
                  إدخال كلمة المرور 
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup className="text-right" >
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            كلمة المرور  
                          </label>
                          <Input
                            className="form-control-alternative text-right"
                            onChange={handleChange}
                            id="password"
                            value={password}
                            placeholder="كلمة المرور "
                            type="password"
                          />
                        </FormGroup>
                      </Col>
                    </Row>     
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-right mb-4 "style={{ fontSize: '1.5em' }}> الصورة الشخصية </h6>
                  <div className="pl-lg-4">
                    <FormGroup className="text-right">                     
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
          <Button onClick={props.onHide}>خروج</Button>
          <Button variant="primary" onClick={handleAddEmployee}>
           حفظ
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  export default EditEmployeeModal;