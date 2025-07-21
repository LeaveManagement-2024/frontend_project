import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Badge,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert
} from "reactstrap"
import Header from "components/Headers/Header.js"
import { 
  getAllFormations, 
  getFormationsByEmployee, 
  addFormation, 
  updateFormation, 
  deleteFormation,
  getEmployeeFormationStats 
} from "./formationApi"
import { getAllEmployees } from "../Employess/employeeApi"
const FormationsManagement = () => {
  const [formations, setFormations] = useState([])
  const [employees, setEmployees] = useState([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('')
  const [modalShow, setModalShow] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentFormation, setCurrentFormation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  
  // État du formulaire
  const [formData, setFormData] = useState({
    nomFormation: '',
    description: '',
    typeFormation: 'INTERNE',
    nomCertification: '',
    dateDebut: '',
    dateFin: '',
    dureeEnJours: '',
    organisme: '',
    cout: '',
    statut: 'PLANIFIEE',
    commentaires: '',
    employeeId: ''
  })

  const typeFormationOptions = [
    { value: 'CERTIFIEE', label: 'Certifiée' },
    { value: 'CONTINUE', label: 'Continue' },
    { value: 'INTERNE', label: 'Interne' }
  ]

  const statutOptions = [
    { value: 'PLANIFIEE', label: 'Planifiée' },
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'TERMINEE', label: 'Terminée' },
    { value: 'ANNULEE', label: 'Annulée' },
    { value: 'REPORTEE', label: 'Reportée' }
  ]

  useEffect(() => {
    fetchAllFormations()
    fetchAllEmployees()
  }, [])

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchFormationsByEmployee(selectedEmployeeId)
    } else {
      fetchAllFormations()
    }
  }, [selectedEmployeeId])

  const fetchAllFormations = async () => {
    setLoading(true)
    try {
      const data = await getAllFormations()
      setFormations(data)
    } catch (error) {
      showMessage('Erreur lors de la récupération des formations', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const fetchFormationsByEmployee = async (employeeId) => {
    setLoading(true)
    try {
      const data = await getFormationsByEmployee(employeeId)
      setFormations(data)
    } catch (error) {
      showMessage('Erreur lors de la récupération des formations', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees()
      setEmployees(data)
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error)
    }
  }

  const showMessage = (msg, type = 'success') => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage('')
      setMessageType('')
    }, 5000)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const calculateDuration = () => {
    if (formData.dateDebut && formData.dateFin) {
      const debut = new Date(formData.dateDebut)
      const fin = new Date(formData.dateFin)
      const diffTime = Math.abs(fin - debut)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      setFormData(prev => ({
        ...prev,
        dureeEnJours: diffDays.toString()
      }))
    }
  }

  useEffect(() => {
    calculateDuration()
  }, [formData.dateDebut, formData.dateFin])

  const resetForm = () => {
    setFormData({
      nomFormation: '',
      description: '',
      typeFormation: 'INTERNE',
      nomCertification: '',
      dateDebut: '',
      dateFin: '',
      dureeEnJours: '',
      organisme: '',
      cout: '',
      statut: 'PLANIFIEE',
      commentaires: '',
      employeeId: ''
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formationData = {
        ...formData,
        employeeId: parseInt(formData.employeeId),
        dureeEnJours: parseInt(formData.dureeEnJours) || 0,
        cout: parseFloat(formData.cout) || 0
      }

      if (editMode && currentFormation) {
        await updateFormation(currentFormation.idFormation, formationData)
        showMessage('Formation modifiée avec succès')
      } else {
        await addFormation(formationData)
        showMessage('Formation ajoutée avec succès')
      }

      setModalShow(false)
      resetForm()
      setEditMode(false)
      setCurrentFormation(null)
      
      // Rafraîchir la liste
      if (selectedEmployeeId) {
        fetchFormationsByEmployee(selectedEmployeeId)
      } else {
        fetchAllFormations()
      }
    } catch (error) {
      showMessage('Erreur lors de la sauvegarde', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (formation) => {
    setCurrentFormation(formation)
    setFormData({
      nomFormation: formation.nomFormation || '',
      description: formation.description || '',
      typeFormation: formation.typeFormation || 'INTERNE',
      nomCertification: formation.nomCertification || '',
      dateDebut: formation.dateDebut || '',
      dateFin: formation.dateFin || '',
      dureeEnJours: formation.dureeEnJours?.toString() || '',
      organisme: formation.organisme || '',
      cout: formation.cout?.toString() || '',
      statut: formation.statut || 'PLANIFIEE',
      commentaires: formation.commentaires || '',
      employeeId: formation.employee?.idE?.toString() || ''
    })
    setEditMode(true)
    setModalShow(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) {
      try {
        await deleteFormation(id)
        showMessage('Formation supprimée avec succès')
        
        // Rafraîchir la liste
        if (selectedEmployeeId) {
          fetchFormationsByEmployee(selectedEmployeeId)
        } else {
          fetchAllFormations()
        }
      } catch (error) {
        showMessage('Erreur lors de la suppression', 'danger')
      }
    }
  }

  const openAddModal = () => {
    resetForm()
    setEditMode(false)
    setCurrentFormation(null)
    setModalShow(true)
  }

  const getStatusBadgeColor = (statut) => {
    const colors = {
      'PLANIFIEE': 'info',
      'EN_COURS': 'primary',
      'TERMINEE': 'success',
      'ANNULEE': 'danger',
      'REPORTEE': 'warning'
    }
    return colors[statut] || 'secondary'
  }

  const getTypeBadgeColor = (type) => {
    const colors = {
      'CERTIFIEE': 'success',
      'CONTINUE': 'info',
      'INTERNE': 'warning'
    }
    return colors[type] || 'secondary'
  }

  return (
    <>
      <Header />
      <Container className="mt-7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">🎓 Gestion des Formations</h3>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" onClick={openAddModal}>
                      <i className="fas fa-plus mr-2"></i>
                      Nouvelle Formation
                    </Button>
                  </div>
                </Row>
                
                {/* Filtre par employé */}
                <Row className="mt-3">
                  <Col md="4">
                    <FormGroup>
                      <Label for="employeeFilter">Filtrer par employé:</Label>
                      <Input
                        type="select"
                        name="employeeFilter"
                        id="employeeFilter"
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      >
                        <option value="">Tous les employés</option>
                        {employees.map(emp => (
                          <option key={emp.idE} value={emp.idE}>
                            {emp.firstName} {emp.lastName}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                {message && (
                  <Alert color={messageType} className="mt-3">
                    {message}
                  </Alert>
                )}
              </CardHeader>

              <CardBody>
                {loading ? (
                  <div className="text-center">
                    <i className="fas fa-spinner fa-spin fa-2x"></i>
                    <p className="mt-2">Chargement...</p>
                  </div>
                ) : (
                  <Table responsive>
                    <thead className="thead-light">
                      <tr>
                        <th>Employé</th>
                        <th>Formation</th>
                        <th>Type</th>
                        <th>Certification</th>
                        <th>Durée</th>
                        <th>Dates</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formations.length > 0 ? (
                        formations.map((formation) => (
                          <tr key={formation.idFormation}>
                            <td>
                              <div>
                                <strong>{formation.employee?.firstName} {formation.employee?.lastName}</strong>
                                <br />
                                <small className="text-muted">ID: {formation.employee?.idE}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{formation.nomFormation}</strong>
                                {formation.organisme && (
                                  <>
                                    <br />
                                    <small className="text-muted">
                                      <i className="fas fa-building mr-1"></i>
                                      {formation.organisme}
                                    </small>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              <Badge color={getTypeBadgeColor(formation.typeFormation)} pill>
                                {typeFormationOptions.find(t => t.value === formation.typeFormation)?.label}
                              </Badge>
                            </td>
                            <td>
                              {formation.nomCertification || (
                                <span className="text-muted">Aucune certification</span>
                              )}
                            </td>
                            <td>
                              <span className="text-primary">
                                <i className="fas fa-calendar-alt mr-1"></i>
                                {formation.dureeEnJours} jour{formation.dureeEnJours > 1 ? 's' : ''}
                              </span>
                              {formation.cout && (
                                <>
                                  <br />
                                  <small className="text-success">
                                    <i className="fas fa-euro-sign mr-1"></i>
                                    {formation.cout} €
                                  </small>
                                </>
                              )}
                            </td>
                            <td>
                              <div>
                                <small className="text-muted">Début:</small> {formation.dateDebut}
                                <br />
                                <small className="text-muted">Fin:</small> {formation.dateFin}
                              </div>
                            </td>
                            <td>
                              <Badge color={getStatusBadgeColor(formation.statut)} pill>
                                {statutOptions.find(s => s.value === formation.statut)?.label}
                              </Badge>
                            </td>
                            <td>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="btn-icon-only text-light"
                                  href="#pablo"
                                  role="button"
                                  size="sm"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-arrow" right>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={() => handleEdit(formation)}
                                  >
                                    <i className="fas fa-edit"></i> Modifier
                                  </DropdownItem>
                                  <DropdownItem
                                    href="#pablo"
                                    onClick={() => handleDelete(formation.idFormation)}
                                    className="text-danger"
                                  >
                                    <i className="fas fa-trash"></i> Supprimer
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center text-muted">
                            <i className="fas fa-graduation-cap fa-3x mb-3 d-block"></i>
                            Aucune formation trouvée
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </div>
        </Row>

        {/* Modal Ajouter/Modifier Formation */}
        <Modal isOpen={modalShow} toggle={() => setModalShow(false)} size="lg">
          <ModalHeader toggle={() => setModalShow(false)}>
            <i className="fas fa-graduation-cap mr-2"></i>
            {editMode ? 'Modifier la Formation' : 'Nouvelle Formation'}
          </ModalHeader>
          
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="employeeId">Employé *</Label>
                    <Input
                      type="select"
                      name="employeeId"
                      id="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Sélectionner un employé</option>
                      {employees.map(emp => (
                        <option key={emp.idE} value={emp.idE}>
                          {emp.firstName} {emp.lastName} (ID: {emp.idE})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
                
                <Col md="6">
                  <FormGroup>
                    <Label for="typeFormation">Type de Formation *</Label>
                    <Input
                      type="select"
                      name="typeFormation"
                      id="typeFormation"
                      value={formData.typeFormation}
                      onChange={handleInputChange}
                      required
                    >
                      {typeFormationOptions.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="nomFormation">Nom de la Formation *</Label>
                    <Input
                      type="text"
                      name="nomFormation"
                      id="nomFormation"
                      placeholder="Ex: Formation Spring Boot"
                      value={formData.nomFormation}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Input
                      type="textarea"
                      name="description"
                      id="description"
                      placeholder="Description détaillée de la formation"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="nomCertification">Nom de la Certification</Label>
                    <Input
                      type="text"
                      name="nomCertification"
                      id="nomCertification"
                      placeholder="Ex: Certificat Spring Professional"
                      value={formData.nomCertification}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                
                <Col md="6">
                  <FormGroup>
                    <Label for="organisme">Organisme Formateur</Label>
                    <Input
                      type="text"
                      name="organisme"
                      id="organisme"
                      placeholder="Ex: Centre de Formation XYZ"
                      value={formData.organisme}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="4">
                  <FormGroup>
                    <Label for="dateDebut">Date de Début *</Label>
                    <Input
                      type="date"
                      name="dateDebut"
                      id="dateDebut"
                      value={formData.dateDebut}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                
                <Col md="4">
                  <FormGroup>
                    <Label for="dateFin">Date de Fin *</Label>
                    <Input
                      type="date"
                      name="dateFin"
                      id="dateFin"
                      value={formData.dateFin}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                
                <Col md="4">
                  <FormGroup>
                    <Label for="dureeEnJours">Durée (jours)</Label>
                    <Input
                      type="number"
                      name="dureeEnJours"
                      id="dureeEnJours"
                      placeholder="Auto-calculé"
                      value={formData.dureeEnJours}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="cout">Coût (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      name="cout"
                      id="cout"
                      placeholder="0.00"
                      value={formData.cout}
                      onChange={handleInputChange}
                    />
                  </FormGroup>
                </Col>
                
                <Col md="6">
                  <FormGroup>
                    <Label for="statut">Statut</Label>
                    <Input
                      type="select"
                      name="statut"
                      id="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                    >
                      {statutOptions.map(statut => (
                        <option key={statut.value} value={statut.value}>
                          {statut.label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <FormGroup>
                    <Label for="commentaires">Commentaires</Label>
                    <Input
                      type="textarea"
                      name="commentaires"
                      id="commentaires"
                      placeholder="Commentaires ou notes sur la formation"
                      value={formData.commentaires}
                      onChange={handleInputChange}
                      rows="2"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            
            <ModalFooter>
              <Button color="secondary" onClick={() => setModalShow(false)}>
                Annuler
              </Button>
              <Button color="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    {editMode ? 'Modifier' : 'Ajouter'}
                  </>
                )}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  )
}

export default FormationsManagement