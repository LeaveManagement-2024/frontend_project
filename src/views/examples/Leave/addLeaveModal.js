"use client"

import Modal from "react-bootstrap/Modal"
import { Button, Card, CardHeader, CardBody, FormGroup, Form, Input, Row, Col } from "reactstrap"
import axios from "axios"
import { getAllLeaveTypes } from "../parametre/leave_type/leaveTypeApi"
import { getAllEmployees } from "../Employess/employeeApi"
import { getAllAnnualLeave } from "../annualLeave/annualLeaveAPI"
import { getAllDepartments } from "../parametre/departement/departementApi"
import { useEffect, useState } from "react"
import "./modern-modal-styles.css"

const AddLeaveModal = ({ onHide, onSuccess, ...props }) => {
  // States
  const [leavetypes, setLeaveType] = useState([])
  const [employees, setEmployees] = useState([])
  const [annualLeaves, setAnnualLeaves] = useState([])
  const [departements, setDepartements] = useState([])
  const [services, setServices] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [filiere, setFiliere] = useState([])
  // Form fields
  const [annualLeaveId, setAnnualLeaveId] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [leaveTypeId, setLeaveTypeId] = useState("")
  const [replacementId, setReplacementId] = useState("")
  const [lmanagerId, setLmanagerId] = useState("")

  const [employeeId, setEmployeeId] = useState("")

  const userId = Number.parseInt(localStorage.getItem("userId"))

  // Fetch all data in parallel
  useEffect(() => {
    setLoading(true)
    Promise.all([getAllLeaveTypes(), getAllEmployees(), getAllAnnualLeave(), getAllDepartments()])
      .then(([lt, emps, al, deps]) => {
        setLeaveType(lt)
        setEmployees(emps)
        setAnnualLeaves(al)
        setDepartements(deps)
      })
      .catch((err) => console.error("Erreur chargement données :", err))
      .finally(() => setLoading(false))
  }, [userId])

  // Reset form fields
  const resetForm = () => {
    setAnnualLeaveId("")
    setStartDate("")
    setEndDate("")
    setLeaveTypeId("")
    setReplacementId("")
    setLmanagerId("")

    setEmployeeId("")
    setErrors({})
  }

  // Validation
  const validate = () => {
    const tempErrors = {}
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!startDate) tempErrors.startDate = "Veuillez entrer la date de départ"
    else if (new Date(startDate) <= today) tempErrors.startDate = "La date de départ doit être après aujourd'hui"

    if (!endDate) tempErrors.endDate = "Veuillez entrer la date de retour"
    else if (startDate && new Date(startDate) >= new Date(endDate))
      tempErrors.endDate = "La date de retour doit être après la date de départ"

    if (!leaveTypeId) tempErrors.leaveTypeId = "Veuillez sélectionner le type de congé"
    if (!replacementId) tempErrors.replacementId = "Veuillez sélectionner le remplaçant"

    if (!lmanagerId) tempErrors.lmanagerId = "Veuillez sélectionner le manager"
    if (!employeeId) tempErrors.employeeId = "Veuillez sélectionner l'employé"
    if (!annualLeaveId) tempErrors.annualLeaveId = "Veuillez sélectionner l'année administrative"

    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }

  // Submit
  const handleAddLeave = async () => {
    // if (!validate()) return;
    try {
      const payload = {
        startDate,
        endDate,
        employeeId,
        annualLeaveId,
        leaveTypeId,
        replacementId,
        lmanagerId,
 
      }
      await axios.post("http://localhost:8093/leave/save", payload)
      resetForm()
      onSuccess && onSuccess()
      onHide()
    } catch (error) {
      const payload = {
        startDate,
        endDate,
        employeeId,
        annualLeaveId,
        leaveTypeId,
        replacementId,
        lmanagerId,

      }
      console.error("Erreur lors de l'ajout du congé :", error)
      console.error("Erreur lors de l'ajout du congé :", payload)
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
      onHide={() => {
        resetForm()
        onHide()
      }}
      className="modern-leave-modal"
    >
      <div className="modal-overlay">
        <Modal.Body className="modern-modal-body">
          <Card className="modern-modal-card">
            <CardHeader className="modern-modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <span className="icon-emoji">📝</span>
                </div>
                <div className="header-text">
                  <h4 className="modal-title">Nouveau Congé Administratif</h4>
                  <p className="modal-subtitle">Créer une demande de congé pour un employé</p>
                </div>
                <button
                  className="close-button"
                  onClick={() => {
                    resetForm()
                    onHide()
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </CardHeader>

            <CardBody className="modern-modal-content">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner">
                    <div className="spinner-ring"></div>
                    <p>Chargement des données...</p>
                  </div>
                </div>
              ) : (
                <Form className="modern-form">
                  {/* Manager Selection */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">👔</div>
                      <h5 className="section-title">Responsable</h5>
                    </div>
                    <Row>
                      <Col lg="12">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Manager du département</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="lmanagerId"
                              type="select"
                              value={lmanagerId}
                              onChange={(e) => setLmanagerId(e.target.value)}
                              className={`modern-select ${errors.lmanagerId ? "error" : ""}`}
                            >
                              <option value="">Sélectionner le manager</option>
                              {departements.map((d) => (
                                <option key={d.respDepartement.idE} value={d.respDepartement.idE}>
                                  {d?.respDepartement?.lastName} {d?.respDepartement?.firstName}
                                </option>
                              ))}
                            </Input>
                            <div className="input-icon">
                              <i className="fas fa-user-tie"></i>
                            </div>
                          </div>
                          {errors.lmanagerId && <div className="error-message">{errors.lmanagerId}</div>}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  {/* Employee and Replacement */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">👥</div>
                      <h5 className="section-title">Employés</h5>
                    </div>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Employé concerné</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="employeeId"
                              type="select"
                              value={employeeId}
                              onChange={(e) => setEmployeeId(e.target.value)}
                              className={`modern-select ${errors.employeeId ? "error" : ""}`}
                            >
                              <option value="">Sélectionner l'employé</option>
                              {employees.map((emp) => (
                                <option key={emp.idE} value={emp.idE}>
                                  {emp.lastName} {emp.firstName}
                                </option>
                              ))}
                            </Input>
                            <div className="input-icon">
                              <i className="fas fa-user"></i>
                            </div>
                          </div>
                          {errors.employeeId && <div className="error-message">{errors.employeeId}</div>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Remplaçant</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="replacementId"
                              type="select"
                              value={replacementId}
                              onChange={(e) => setReplacementId(e.target.value)}
                              className={`modern-select ${errors.replacementId ? "error" : ""}`}
                            >
                              <option value="">Sélectionner le remplaçant</option>
                              {employees.map((emp) => (
                                <option key={emp.idE} value={emp.idE}>
                                  {emp.lastName} {emp.firstName}
                                </option>
                              ))}
                            </Input>
                            <div className="input-icon">
                              <i className="fas fa-user-plus"></i>
                            </div>
                          </div>
                          {errors.replacementId && <div className="error-message">{errors.replacementId}</div>}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  {/* Leave Type */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">📋</div>
                      <h5 className="section-title">Type de Congé</h5>
                    </div>
                    <Row>
                      <Col lg="12">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Catégorie de congé</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="leaveTypeId"
                              type="select"
                              value={leaveTypeId}
                              onChange={(e) => setLeaveTypeId(e.target.value)}
                              className={`modern-select ${errors.leaveTypeId ? "error" : ""}`}
                            >
                              <option value="">Sélectionner le type de congé</option>
                              {leavetypes.map((lt) => (
                                <option key={lt.leaveTypeId} value={lt.leaveTypeId}>
                                  {lt.name}
                                </option>
                              ))}
                            </Input>
                            <div className="input-icon">
                              <i className="fas fa-list"></i>
                            </div>
                          </div>
                          {errors.leaveTypeId && <div className="error-message">{errors.leaveTypeId}</div>}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>

                  {/* Dates */}
                  <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">📅</div>
                      <h5 className="section-title">Période</h5>
                    </div>
                    <Row>
                      <Col lg="6">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Date de départ</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="startDate"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className={`modern-input ${errors.startDate ? "error" : ""}`}
                            />
                            <div className="input-icon">
                              <i className="fas fa-calendar-alt"></i>
                            </div>
                          </div>
                          {errors.startDate && <div className="error-message">{errors.startDate}</div>}
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text">Date de retour</span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="endDate"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className={`modern-input ${errors.endDate ? "error" : ""}`}
                            />
                            <div className="input-icon">
                              <i className="fas fa-calendar-check"></i>
                            </div>
                          </div>
                          {errors.endDate && <div className="error-message">{errors.endDate}</div>}
                        </FormGroup>
                      </Col>
                      
                    </Row>
                  </div>
                   <div className="form-section">
                    <div className="section-header">
                      <div className="section-icon">📋</div>
                      <h5 className="section-title">AnuualLeaves</h5>
                    </div>
                    <Row>
                      <Col lg="12">
                        <FormGroup className="modern-form-group">
                          <label className="modern-label">
                            <span className="label-text"> anuualLeaves </span>
                            <span className="required-indicator">*</span>
                          </label>
                          <div className="input-wrapper">
                            <Input
                              id="leaveTypeId"
                              type="select"
                              value={annualLeaveId}
                              onChange={(e) => setAnnualLeaveId(e.target.value)}
                              className={`modern-select ${errors.annualLeaveId ? "error" : ""}`}
                            >
                              <option value="">Leave Annual</option>
                              {annualLeaves.map((al) => (
                                <option key={al.annualLeaveId} value={al.annualLeaveId}>
                                  {al.label}
                                </option>
                              ))}
                            </Input>
                            <div className="input-icon">
                              <i className="fas fa-list"></i>
                            </div>
                          </div>
                          {errors.annualLeaveId && <div className="error-message">{errors.annualLeaveId}</div>}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  
                </Form>
              )}
            </CardBody>
            
          </Card>
        </Modal.Body>

        <Modal.Footer className="modern-modal-footer">
          <div className="footer-actions">
            <Button
              className="cancel-button"
              onClick={() => {
                resetForm()
                onHide()
              }}
            >
              <i className="fas fa-times"></i>
              Annuler
            </Button>
            <Button className="submit-button" onClick={handleAddLeave} disabled={loading}>
              <i className="fas fa-plus"></i>
              {loading ? "Ajout en cours..." : "Créer le congé"}
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  )
}

export default AddLeaveModal
