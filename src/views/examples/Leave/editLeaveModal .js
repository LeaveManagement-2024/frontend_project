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
import { getLeaveById } from "./LeaveApi";
import { useEffect, useState } from 'react';

const ModifierCongeModal = (props) => {
  const [typesConge, setTypesConge] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [anneesAdministratives, setAnneesAdministratives] = useState([]);
  const [filiere, setFiliere] = useState(null);
  const [anneeId, setAnneeId] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [typeCongeId, setTypeCongeId] = useState('');
  const [remplacantId, setRemplacantId] = useState('');
  const [chefDepartementId, setChefDepartementId] = useState('');
  const [responsableServiceId, setResponsableServiceId] = useState('');
  const userId = localStorage.getItem('userId');
  const [employeId, setEmployeId] = useState('');
  const [erreurs, setErreurs] = useState({});

  const chargerTypesConge = async () => {
    try {
      const data = await getAllLeaveTypes();
      setTypesConge(data);
    } catch (error) {
      console.error('Erreur lors du chargement des types de congé :', error);
    }
  };

  const chargerEmployes = async () => {
    try {
      const data = await getAllEmployees();
      setEmployes(data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés :', error);
    }
  };

  const chargerFiliere = async () => {
    try {
      const data = await getFilirerByEmployee(userId);
      setFiliere(data);
      setResponsableServiceId(data?.service?.respService?.idE);
      setChefDepartementId(data?.service?.departement?.respDepartement?.idE);
    } catch (error) {
      console.error('Erreur lors du chargement de la filière :', error);
    }
  };

  const chargerAnneesAdministratives = async () => {
    try {
      const data = await getAllAnnualLeave();
      setAnneesAdministratives(data);
    } catch (error) {
      console.error('Erreur lors du chargement des années administratives :', error);
    }
  };

  const chargerCongeParId = async (id) => {
    try {
      const data = await getLeaveById(id);
      setDateDebut(data.startDate);
      setDateFin(data.endDate);
      setTypeCongeId(data?.leaveType?.leaveTypeId);
      setEmployeId(data?.employee?.idE);
      setResponsableServiceId(data?.responsible?.idE);
      setChefDepartementId(data?.lmanager?.idE);
      setAnneeId(data?.annualLeave?.annualLeaveId);
      setRemplacantId(data?.replacement?.idE);
    } catch (error) {
      console.error('Erreur lors du chargement du congé :', error);
    }
  };

  useEffect(() => {
    chargerTypesConge();
    chargerEmployes();
    chargerAnneesAdministratives();
    chargerFiliere();
    chargerCongeParId(props.leave.leaveId);
  }, [props.leave.leaveId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'anneeId':
        setAnneeId(value);
        break;
      case 'dateDebut':
        setDateDebut(value);
        break;
      case 'dateFin':
        setDateFin(value);
        break;
      case 'employeId':
        setEmployeId(value);
        break;
      case 'responsableServiceId':
        setResponsableServiceId(value);
        break;
      case 'typeCongeId':
        setTypeCongeId(value);
        break;
      case 'remplacantId':
        setRemplacantId(value);
        break;
      case 'chefDepartementId':
        setChefDepartementId(value);
        break;
      default:
        break;
    }
  };

  const valider = () => {
    let erreursTemp = {};
    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    if (!dateDebut) {
      erreursTemp.dateDebut = "Veuillez entrer la date de début du congé";
    } else if (new Date(dateDebut) <= aujourdHui) {
      erreursTemp.dateDebut = "La date de début doit être après aujourd'hui";
    }

    if (!dateFin) {
      erreursTemp.dateFin = "Veuillez entrer la date de reprise";
    } else if (dateDebut && dateFin && new Date(dateDebut) >= new Date(dateFin)) {
      erreursTemp.dateFin = "La date de reprise doit être après la date de départ";
    }

    if (!typeCongeId) {
      erreursTemp.typeCongeId = "Veuillez choisir un type de congé";
    }

    if (!remplacantId) {
      erreursTemp.remplacantId = "Veuillez choisir un remplaçant";
    }

    if (!anneeId) {
      erreursTemp.anneeId = "Veuillez sélectionner une année administrative";
    }

    setErreurs(erreursTemp);
    return Object.keys(erreursTemp).length === 0;
  };

  const modifierConge = async () => {
    if (valider()) {
      try {
        const congeData = {
          startDate: dateDebut,
          endDate: dateFin,
          employeeId: userId,
          annualLeaveId: anneeId,
          leaveTypeId: typeCongeId,
          replacementId: remplacantId,
          lmanagerId: filiere?.service?.departement?.respDepartement?.idE,
          responsible: filiere?.service?.respService?.idE,
        };

        await axios.put(`http://localhost:8093/leave/update/${props.leave.leaveId}`, congeData);
        window.location.reload();
      } catch (error) {
        console.error('Erreur lors de la modification du congé :', error);
      }
    }
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body>
        <Card className="bg-secondary shadow">
          <CardHeader className="bg-white border-0">
            <h4 className='text-center text-xl'>Modifier la demande de congé</h4>
          </CardHeader>
          <CardBody>
            <Form>
              <div className="pl-lg-4">
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label htmlFor="remplacantId">Nom du remplaçant</label>
                      <Input
                        id="remplacantId"
                        type="select"
                        value={remplacantId}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionner un remplaçant</option>
                        {employes.map(emp => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.lastNameAr} {emp.firstNameAr}
                          </option>
                        ))}
                      </Input>
                      {erreurs.remplacantId && <div className="text-danger">{erreurs.remplacantId}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label htmlFor="typeCongeId">Type de congé</label>
                      <Input
                        id="typeCongeId"
                        type="select"
                        value={typeCongeId}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionner un type</option>
                        {typesConge.map(type => (
                          <option key={type.leaveTypeId} value={type.leaveTypeId}>
                            {type.name}
                          </option>
                        ))}
                      </Input>
                      {erreurs.typeCongeId && <div className="text-danger">{erreurs.typeCongeId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label htmlFor="dateFin">Date de reprise</label>
                      <Input
                        id="dateFin"
                        type="date"
                        value={dateFin}
                        onChange={handleChange}
                      />
                      {erreurs.dateFin && <div className="text-danger">{erreurs.dateFin}</div>}
                    </FormGroup>
                  </Col>
                  <Col lg="6">
                    <FormGroup className="text-right">
                      <label htmlFor="dateDebut">Date de départ</label>
                      <Input
                        id="dateDebut"
                        type="date"
                        value={dateDebut}
                        onChange={handleChange}
                      />
                      {erreurs.dateDebut && <div className="text-danger">{erreurs.dateDebut}</div>}
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col lg="12">
                    <FormGroup className="text-right">
                      <label htmlFor="anneeId">Année administrative</label>
                      <Input
                        id="anneeId"
                        type="select"
                        value={anneeId}
                        onChange={handleChange}
                      >
                        <option value="">Sélectionner une année</option>
                        {anneesAdministratives.map(annee => (
                          <option key={annee.annualLeaveId} value={annee.annualLeaveId}>
                            {annee.label}
                          </option>
                        ))}
                      </Input>
                      {erreurs.anneeId && <div className="text-danger">{erreurs.anneeId}</div>}
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button onClick={props.onHide}>Fermer</Button>
        <Button variant="primary" onClick={modifierConge}>Modifier</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModifierCongeModal;
