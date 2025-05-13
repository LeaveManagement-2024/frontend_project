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
import { getAllEmployees, getFilirerByEmployee } from "../Employess/employeeApi";
import { getAllAnnualLeave } from "../annualLeave/annualLeaveAPI";
import { getAllDepartments } from "../parametre/departement/departementApi";
import { getAllServices } from '../parametre/service/serviceApi';
import { useEffect, useState } from 'react';

const AddLeavePersonModal = ({ onHide, onSuccess, ...props }) => {
  // States
  const [leavetypes, setLeaveType] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [annualLeaves, setAnnualLeaves] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [services, setServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [filiere, setFiliere] = useState([]);
  // Form fields
  const [annualLeaveId, setAnnualLeaveId] = useState('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [leaveTypeId, setLeaveTypeId] = useState('');
  const [replacementId, setReplacementId] = useState('');
  const [lmanagerId, setLmanagerId] = useState('');
  const [responsible, setResponsible] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const userId = parseInt(localStorage.getItem('userId'), 10);

  // Fetch all data in parallel
  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllLeaveTypes(),
      getAllEmployees(),
      getAllAnnualLeave(),
      getFilirerByEmployee(userId),
      getAllDepartments(),
      getAllServices(),
    ])
      .then(([lt, emps, al, fil, deps, servs]) => {
        setLeaveType(lt);
        setEmployees(emps);
        setAnnualLeaves(al);
        setFiliere(fil);
        setDepartements(deps);
        setServices(servs);
      })
      .catch(err => console.error('Erreur chargement données :', err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Reset form fields
  const resetForm = () => {
    setAnnualLeaveId('');
    setStartDate('');
    setEndDate('');
    setLeaveTypeId('');
    setReplacementId('');
    setLmanagerId('');
    setResponsible('');
    setEmployeeId('');
    setErrors({});
  };

  // Validation
  const validate = () => {
    const tempErrors = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    if (!startDate) tempErrors.startDate = "Veuillez entrer la date de départ";
    else if (new Date(startDate) <= today) tempErrors.startDate = "La date de départ doit être après aujourd'hui";

    if (!endDate) tempErrors.endDate = "Veuillez entrer la date de retour";
    else if (startDate && new Date(startDate) >= new Date(endDate)) tempErrors.endDate = "La date de retour doit être après la date de départ";

    if (!leaveTypeId) tempErrors.leaveTypeId = "Veuillez sélectionner le type de congé";
    if (!replacementId) tempErrors.replacementId = "Veuillez sélectionner le remplaçant";
    if (!responsible) tempErrors.responsible = "Veuillez sélectionner le responsable";
    if (!lmanagerId) tempErrors.lmanagerId = "Veuillez sélectionner le manager";
    if (!employeeId) tempErrors.employeeId = "Veuillez sélectionner l'employé";
    if (!annualLeaveId) tempErrors.annualLeaveId = "Veuillez sélectionner l'année administrative";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit
  const handleAddLeave = async () => {
    // if (!validate()) return;
    try {
      const payload = { startDate, endDate, employeeId, annualLeaveId, leaveTypeId, replacementId, lmanagerId, responsible };
      await axios.post('http://localhost:8093/leave/save', payload);
      resetForm();
      onSuccess && onSuccess();
      onHide();
    } catch (error) {
      const payload = { startDate, endDate, employeeId, annualLeaveId, leaveTypeId, replacementId, lmanagerId, responsible };
      console.error('Erreur lors de l\'ajout du congé :', error);
      console.error('Erreur lors de l\'ajout du congé :', payload);
    }
  };

  return (
    <Modal {...props} size="lg" centered onHide={() => { resetForm(); onHide(); }}>
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className='text-center text-xl'>Congé administratif des employés</h4>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <Form>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label>Nom du responsable</label>
                      <Input id="responsible" type="select" value={responsible} onChange={e => setResponsible(e.target.value)}>
                        <option value="">Sélectionner le responsable</option>
                        {services.map(s => (
                          <option key={s.respService.idE} value={s.respService.idE}>
                            {s.respService.lastName} {s.respService.firstName}
                          </option>
                        ))}
                      </Input>
                      {errors.responsible && <div className="text-danger">{errors.responsible}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label>Nom du manager</label>
                      <Input id="lmanagerId" type="select" value={lmanagerId} onChange={e => setLmanagerId(e.target.value)}>
                        <option value="">Sélectionner le manager</option>
                        {departements.map(d => (
                          <option key={d.respDepartement.idE} value={d.respDepartement.idE}>
                            {d.respDepartement.lastName} {d.respDepartement.firstName}
                          </option>
                        ))}
                      </Input>
                      {errors.lmanagerId && <div className="text-danger">{errors.lmanagerId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label>Nom du remplaçant</label>
                      <Input id="replacementId" type="select" value={replacementId} onChange={e => setReplacementId(e.target.value)}>
                        <option value="">Sélectionner le remplaçant</option>
                        {employees.map(emp => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastName} {emp.firstName}
                          </option>
                        ))}
                      </Input>
                      {errors.replacementId && <div className="text-danger">{errors.replacementId}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label>Nom de l'employé</label>
                      <Input id="employeeId" type="select" value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
                        <option value="">Sélectionner l'employé</option>
                        {employees.map(emp => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastName} {emp.firstName}
                          </option>
                        ))}
                      </Input>
                      {errors.employeeId && <div className="text-danger">{errors.employeeId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup>
                      <label>Type de congé</label>
                      <Input id="leaveTypeId" type="select" value={leaveTypeId} onChange={e => setLeaveTypeId(e.target.value)}>
                        <option value="">Sélectionner le type de congé</option>
                        {leavetypes.map(lt => (
                          <option key={lt.leaveTypeId} value={lt.leaveTypeId}>{lt.name}</option>
                        ))}
                      </Input>
                      {errors.leaveTypeId && <div className="text-danger">{errors.leaveTypeId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup>
                      <label>Date de départ</label>
                      <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                      {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup>
                      <label>Date de retour</label>
                      <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                      {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            )}
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <Button color="secondary" onClick={() => { resetForm(); onHide(); }}>Fermer</Button>
        <Button color="primary" onClick={handleAddLeave} disabled={loading}>Ajouter</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddLeavePersonModal;
