import Modal from 'react-bootstrap/Modal';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";
import axios from 'axios';

import { getAllLeaveTypes } from "../parametre/leave_type/leaveTypeApi";
import { getAllEmployees, getFilirerByEmployee,getAnnualLeavesLines } from "../Employess/employeeApi";
import { getAllAnnualLeave } from "../annualLeave/annualLeaveAPI";

import { useEffect, useState } from 'react';

const AddLeavePersonModal = (props) => {
  const [leavetypes, setLeaveType] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [anualline, setAnualline] = useState([]);
  const [anuualLeaves, setAnuualLeaves] = useState([]);
  const [filiere, setFiliere] = useState(null);
  const [annualLeaveId, setAnnualLeaveId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [replacementId, setReplacementId] = useState('');
  const [lmanagerId, setLmanagerId] = useState('');
  const [responsible, setResponsible] = useState('');
  const userId = localStorage.getItem('userId');
  const [employeeId,setEmployeeId]=useState(userId);

  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});

  const fetchAllLeaveTypes = async () => {
    try {
      const leavetypeData = await getAllLeaveTypes();
      setLeaveType(leavetypeData);
    } catch (error) {
      console.error('Erreur lors de la récupération des types de congé:', error);
    }
  };

  /* const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  }; */
  const fetchAnnualLeavesLinesByEmployee = async (id) => {
    try {
      const data = await getAnnualLeavesLines(id);
      setAnualline(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes de congé annuel:', error);
    }
  };

  const fetchFiliere = async () => {
    try {
      const data = await getFilirerByEmployee(userId);
      setFiliere(data);    
      setLmanagerId(data?.respDepartement?.idE);
    } catch (error) {
      console.error('Erreur lors de la récupération de la filière:', error);
      console.error('Assurez-vous que l\'ID de l\'employé est correct:', userId);
      console.error('manager:', lmanagerId);
    }
  };

  const fetchAllAnnualLeave = async () => {
    try {
      const data = await getAllAnnualLeave();
      setAnuualLeaves(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des congés annuels:', error);
    }
  };

  useEffect(() => {
    fetchAllLeaveTypes();
    fetchAllAnnualLeave();
    fetchFiliere();
    fetchAnnualLeavesLinesByEmployee(userId);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'annualLeaveId':
        setAnnualLeaveId(value);
        break;
      case 'startDate':
        setStartDate(value);
        break;
      case 'endDate':
        setEndDate(value);
        break;
      case 'employeeId':
        setEmployeeId(value);
        break;
      case 'leaveTypeId':
        setLeaveTypeId(value);
        break;
      case 'replacementId':
        setReplacementId(value);
        break;
      
      default:
        break;
    }
  };

  // Fonction de validation
  const validate = () => {
    let tempErrors = {};
  
    // Obtenir la date d'aujourd'hui sans l'heure
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    if (!startDate) {
      tempErrors.startDate = "Veuillez entrer la date de départ";
    } else if (new Date(startDate) <= today) {
      tempErrors.startDate = "La date de départ doit être après la date d'aujourd'hui";
    }
  
    if (!endDate) {
      tempErrors.endDate = "Veuillez entrer la date de reprise";
    } else if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      tempErrors.endDate = "La date de reprise doit être après la date de départ";
    }
  
    if (!leaveTypeId) {
      tempErrors.leaveTypeId = "Veuillez choisir un type de congé";
    }
  
    if (!replacementId) {
      tempErrors.replacementId = "Veuillez choisir le nom du remplaçant";
    }
  
    if (!annualLeaveId) {
      tempErrors.annualLeaveId = "Veuillez choisir l'année administrative";
    }
  
    setErrors(tempErrors);
  
    return Object.keys(tempErrors).length === 0;
  };

  const handleAddLeave = async () => {
    if (validate()) {
      try {
        const leaveData = {
          startDate,
          endDate,
          employeeId,
          annualLeaveId,
          leaveTypeId,
          replacementId,
          lmanagerId: filiere?.respDepartement?.idE,
        };

        console.log(leaveData);

        const response = await axios.post('http://localhost:8093/leave/save', leaveData);
        console.log(response.data);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de l\'ajout du congé:', error);
      }
    }
  };

  // Fonction pour récupérer les employés sans congé entre la startDate et endDate
  const fetchEmployeesWithoutLeave = async (startDate, endDate) => {
    if (startDate && endDate) {
      try {
        const response = await axios.get(`http://localhost:8093/employee/without-leave`, {
          params: { startDate, endDate },
        });
        setEmployees(response.data); // Mettre à jour la liste des employés
      } catch (error) {
        console.error('Erreur lors de la récupération des employés sans congé:', error);
      }
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchEmployeesWithoutLeave(startDate, endDate);
    }
  }, [startDate, endDate]);

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className='text-center text-xl'>
              Congé administratif personnel
            </h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-first-name">
                        Nom du remplaçant
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="replacementId"
                        placeholder="Nom du remplaçant"
                        type="select"
                        value={replacementId}
                        onChange={handleChange}
                      >
                        <option value="">Choisir un remplaçant</option>
                        {employees.length > 0 && employees.map((emp) => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastName} {emp.firstName}
                          </option>
                        ))}
                      </Input>
                      {errors.replacementId && <div className="text-danger">{errors.replacementId}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-last-name">
                        Type de congé
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="leaveTypeId"
                        placeholder="Congé maladie, congé de maternité"
                        type="select"
                        value={leaveTypeId}
                        onChange={handleChange}
                      >
                        <option value="">Choisir un type de congé</option>
                        {leavetypes.length > 0 && leavetypes.map((lt) => (
                          <option key={lt.leaveTypeId} value={lt.leaveTypeId}>
                            {lt.name}
                          </option>
                        ))}
                      </Input>
                      {errors.leaveTypeId && <div className="text-danger">{errors.leaveTypeId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="input-username">
                        Date de reprise
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="endDate"
                        placeholder="Date de reprise"
                        type="date"
                        value={endDate}
                        onChange={handleChange}
                      />
                      {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label className="form-control-label text-left">
                        Date de départ
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="startDate"
                        placeholder="Date de départ"
                        type="date"
                        value={startDate}
                        onChange={handleChange}
                      />
                      {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label className="form-control-label" htmlFor="annualLeaveId">
                        Année administrative
                      </label>
                      <Input
                        className="form-control-alternative text-right"
                        id="annualLeaveId"
                        placeholder="Année administrative"
                        type="select"
                        value={annualLeaveId}
                        onChange={handleChange}
                      >
                        <option value="">Choisir l'année administrative</option>
                        {anualline.length > 0 && anualline.map((al) => (
                          <option key={al?.annualLeave?.annualLeaveId} value={al?.annualLeave?.annualLeaveId}>
                            {al?.annualLeave?.label}
                          </option>
                        ))}
                      </Input>
                      {errors.annualLeaveId && <div className="text-danger">{errors.annualLeaveId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>Quitter</Button>
        <Button variant="primary" onClick={handleAddLeave}>
          Sauvegarder
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLeavePersonModal;
