"use client"

import { useState, useEffect, useRef } from "react"
import {
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Progress,
  Alert,
  Badge,
  ListGroup,
  ListGroupItem
} from "reactstrap"
import AddEmployeeModal from "./addEmployeeModal"
import EditEmployeeModal from "./editEmployeeModal"
import Header from "components/Headers/Header.js"
import { loginEmployee, getAllEmployees, getEmployeeById, deleteEmployee, importEmployeesFromCSV } from "./employeeApi"
import "./modern-employees-styles.css"

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [employee, setEmployee] = useState({})
  const [logInDTO, setLogInDTO] = useState({ email: "", password: "" })
  const [employeeId, setEmployeeId] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [message, setMessage] = useState("")
  const [modalShow, setModalShow] = useState(false)
  const [editModalShow, setEditModalShow] = useState(false)
  const [editemp, setEditemp] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // États pour l'import CSV
  const [importModalShow, setImportModalShow] = useState(false)
  const [csvFile, setCsvFile] = useState(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [showImportResult, setShowImportResult] = useState(false)
  const fileInputRef = useRef(null)

  // ✅ FIX 1: Supprimer la dépendance circulaire dans useEffect
  useEffect(() => {
    fetchAllEmployees()
  }, []) // Dépendance vide pour éviter la boucle infinie

  const fetchAllEmployees = async () => {
    setIsLoading(true)
    try {
      const data = await getAllEmployees()
      setEmployees(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error)
      setMessage("Erreur lors du chargement des employés")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    try {
      const response = await loginEmployee(logInDTO)
      setMessage(response.message)
    } catch (error) {
      console.error("Erreur de connexion:", error)
      setMessage("Erreur de connexion")
    }
  }

  const handleGetEmployeeById = async (idE) => {
    if (!idE) {
      console.error("Erreur : l'ID de l'employé est indéfini.")
      return
    }
    try {
      const data = await getEmployeeById(idE)
      setEmployee(data)
    } catch (error) {
      console.error("Erreur lors de la récupération de l'employé:", error)
      setMessage("Erreur lors de la récupération de l'employé")
    }
  }

  const handleDeleteEmployee = async (idE) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      return
    }
    
    try {
      await deleteEmployee(idE)
      setMessage("L'employé a été supprimé avec succès")
      // ✅ FIX 2: Recharger la liste après suppression
      await fetchAllEmployees()
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error)
      setMessage("Erreur lors de la suppression de l'employé")
    }
  }

  // Fonctions pour l'import CSV
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        alert('Veuillez sélectionner un fichier CSV valide')
        return
      }
      setCsvFile(file)
    }
  }

  const handleImportCSV = async () => {
    if (!csvFile) {
      alert('Veuillez sélectionner un fichier CSV')
      return
    }

    setImportLoading(true)
    setImportResult(null)

    try {
      const result = await importEmployeesFromCSV(csvFile)
      setImportResult(result)
      setShowImportResult(true)
      
      // Si l'import est réussi, actualiser la liste des employés
      if (result.successCount > 0) {
        await fetchAllEmployees()
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      setImportResult({
        totalRecords: 0,
        successCount: 0,
        errorCount: 1,
        errors: ['Erreur lors de l\'import du fichier: ' + error.message]
      })
      setShowImportResult(true)
    } finally {
      setImportLoading(false)
    }
  }

  const resetImport = () => {
    setCsvFile(null)
    setImportResult(null)
    setShowImportResult(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const closeImportModal = () => {
    setImportModalShow(false)
    resetImport()
  }

  const downloadCSVTemplate = () => {
    const csvContent = `firstName,lastName,email,password,phone,ppr,cin,address,hireDate,workLocation,profileName,departmentName,postName
Ahmed,Benali,ahmed.benali@company.com,password123,0612345678,PPR001,CIN001,123 Rue Mohammed V Casablanca,2024-01-15,Bureau Casablanca,Manager,IT,Chef de Projet
Fatima,El Amrani,fatima.elamrani@company.com,password456,0623456789,PPR002,CIN002,456 Avenue Hassan II Rabat,2024-02-01,Bureau Rabat,Employee,RH,Analyste RH`

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', 'template_employees.csv')
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // ✅ FIX 3: Nettoyer l'URL après téléchargement
    URL.revokeObjectURL(url)
  }

  // ✅ FIX 4: Gérer la pagination avec des données vides
  const totalPages = Math.ceil(employees.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem)
  
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // ✅ FIX 5: Callback pour recharger après ajout/modification
  const handleModalClose = () => {
    setModalShow(false)
    fetchAllEmployees() // Recharger la liste
  }

  const handleEditModalClose = () => {
    setEditModalShow(false)
    fetchAllEmployees() // Recharger la liste
  }

  return (
    <>
      <Header />
      <div className="modern-employees-container">
        <Container className="mt-2" fluid>
          <Row>
            <div className="col">
              <Card className="modern-employees-card">
                <CardHeader className="modern-employees-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon">👥</div>
                      <div className="header-text">
                        <h3 className="header-title">Gestion des Employés</h3>
                        <p className="header-subtitle">Gérez votre équipe et les informations des employés</p>
                      </div>
                      <div className="header-actions">
                      <div className="stats-summary">
                        <div className="stat-item">
                          <span className="stat-number">{employees.length}</span>
                          <span className="stat-label">Employés</span>
                        </div>
                      </div>
                      <div></div>
                      <Button 
                        className="modern-import-button mr-10" 
                        color="info"
                        onClick={() => setImportModalShow(true)}
                        style={{ marginRight: '10px' }}
                      >
                        <i className="fas fa-file-upload"></i>
                        Importer CSV
                      </Button>
                      <Button className="modern-add-button" onClick={() => setModalShow(true)}>
                        <i className="fas fa-user-plus"></i>
                        Nouvel employé
                      </Button>
                    </div>
                    </div>
                    
                    {/* ✅ FIX 6: Réorganiser les boutons dans la même div */}
                    
                      
                    </div>
                  
                </CardHeader>

                {/* ✅ FIX 7: Affichage des messages d'erreur/succès */}
                {message && (
                  <Alert 
                    color={message.includes("succès") ? "success" : "danger"} 
                    className="mx-3 mt-3"
                    toggle={() => setMessage("")}
                  >
                    {message}
                  </Alert>
                )}

                <div className="modern-table-container">
                  <Table className="modern-employees-table" responsive>
                    <thead className="modern-table-header">
                      <tr>
                        <th scope="col">👤 Employé</th>
                        <th scope="col">🆔 N° Carte</th>
                        <th scope="col">📧 Email</th>
                        <th scope="col">📞 Téléphone</th>
                        <th scope="col">🏠 Adresse</th>
                        <th scope="col">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="modern-table-body">
                      {isLoading ? (
                        <tr>
                          <td colSpan="6" className="loading-cell">
                            <div className="loading-content">
                              <div className="loading-spinner">
                                <div className="spinner-ring"></div>
                              </div>
                              <span>Chargement des employés...</span>
                            </div>
                          </td>
                        </tr>
                      ) : currentItems.length > 0 ? (
                        currentItems.map((emp, index) => (
                          <tr key={emp.idE} className="modern-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td className="employee-info-cell">
                              <div className="employee-profile">
                                <div className="avatar-container">
                                  <img
                                    className="employee-avatar"
                                    alt={`${emp.firstName} ${emp.lastName}`}
                                    src={emp.image || "https://www.w3schools.com/howto/img_avatar.png"}
                                    onError={(e) => {
                                      e.target.src = "https://www.w3schools.com/howto/img_avatar.png"
                                    }}
                                  />
                                  <div className="avatar-status"></div>
                                </div>
                                <div className="employee-details">
                                  <span className="employee-name">
                                    {emp.firstName} {emp.lastName}
                                  </span>
                                  <span className="employee-id">ID: {emp.idE}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="info-badge">{emp.cin || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="email-text">{emp.email || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="phone-text">{emp.phone || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="address-text" title={emp.address}>
                                  {emp.address?.length > 30 ? `${emp.address.substring(0, 30)}...` : emp.address || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  className="modern-action-button"
                                  href="#pablo"
                                  role="button"
                                  size="md"
                                  color=""
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-ellipsis-v" />
                                </DropdownToggle>
                                <DropdownMenu className="modern-dropdown-menu" right>
                                  <DropdownItem
                                    className="modern-dropdown-action"
                                    href="#pablo"
                                    onClick={() => handleGetEmployeeById(emp.idE)}
                                  >
                                    <i className="fas fa-eye"></i> Afficher
                                  </DropdownItem>
                                  <DropdownItem
                                    className="modern-dropdown-action"
                                    onClick={() => {
                                      setEditModalShow(true)
                                      setEditemp(emp)
                                    }}
                                  >
                                    <i className="fas fa-edit"></i> Modifier
                                  </DropdownItem>
                                  <DropdownItem
                                    className="modern-dropdown-action delete"
                                    onClick={() => handleDeleteEmployee(emp.idE)}
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
                          <td colSpan="6" className="text-center py-4">
                            <div className="no-data-message">
                              <i className="fas fa-users fa-3x text-muted mb-3"></i>
                              <h5 className="text-muted">Aucun employé trouvé</h5>
                              <p className="text-muted">Commencez par ajouter des employés à votre équipe</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* ✅ FIX 8: Afficher la pagination seulement s'il y a des données */}
                {employees.length > 0 && (
                  <CardFooter className="modern-card-footer">
                    <div className="pagination-info">
                      Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, employees.length)} sur{" "}
                      {employees.length} employés
                    </div>
                    <nav aria-label="...">
                      <Pagination className="modern-pagination">
                        <PaginationItem className={currentPage === 1 ? "disabled" : ""}>
                          <PaginationLink
                            className="modern-pagination-link"
                            href="#pablo"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) paginate(currentPage - 1)
                            }}
                            tabIndex="-1"
                          >
                            <i className="fas fa-chevron-left" />
                          </PaginationLink>
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => (
                          <PaginationItem key={i + 1} className={currentPage === i + 1 ? "active" : ""}>
                            <PaginationLink
                              className="modern-pagination-link"
                              href="#pablo"
                              onClick={(e) => {
                                e.preventDefault()
                                paginate(i + 1)
                              }}
                            >
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem className={currentPage === totalPages ? "disabled" : ""}>
                          <PaginationLink
                            className="modern-pagination-link"
                            href="#pablo"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) paginate(currentPage + 1)
                            }}
                          >
                            <i className="fas fa-chevron-right" />
                          </PaginationLink>
                        </PaginationItem>
                      </Pagination>
                    </nav>
                  </CardFooter>
                )}
              </Card>
            </div>
          </Row>

          {/* Modal d'import CSV */}
          <Modal isOpen={importModalShow} toggle={closeImportModal} size="lg">
            <ModalHeader toggle={closeImportModal}>
              <i className="fas fa-file-upload mr-2"></i>
              Importer des employés depuis un fichier CSV
            </ModalHeader>
            <ModalBody>
              {!showImportResult ? (
                <div>
                  <Alert color="info">
                    <strong>📋 Instructions:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Sélectionnez un fichier CSV avec les colonnes requises</li>
                      <li>Le fichier doit contenir les en-têtes exactes</li>
                      <li>Les dates doivent être au format YYYY-MM-DD</li>
                      <li>Téléchargez le modèle ci-dessous si nécessaire</li>
                    </ul>
                  </Alert>

                  <div className="mb-3">
                    <Button 
                      color="secondary" 
                      outline 
                      onClick={downloadCSVTemplate}
                      className="mb-3"
                    >
                      <i className="fas fa-download mr-2"></i>
                      Télécharger le modèle CSV
                    </Button>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="csvFile" className="form-label">
                      <strong>Sélectionner le fichier CSV:</strong>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="csvFile"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="form-control"
                    />
                  </div>

                  {csvFile && (
                    <Alert color="success">
                      <i className="fas fa-check-circle mr-2"></i>
                      Fichier sélectionné: <strong>{csvFile.name}</strong>
                      <br />
                      Taille: {(csvFile.size / 1024).toFixed(2)} KB
                    </Alert>
                  )}

                  {importLoading && (
                    <div className="text-center">
                      <div className="mb-2">
                        <i className="fas fa-spinner fa-spin fa-2x text-primary"></i>
                      </div>
                      <p>Import en cours...</p>
                      <Progress animated value={100} color="primary" />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="text-center mb-4">
                    <i className={`fas fa-2x mb-3 ${importResult.errorCount === 0 ? 'fa-check-circle text-success' : 'fa-exclamation-triangle text-warning'}`}></i>
                    <h4>Résultat de l'import</h4>
                  </div>

                  <Row className="mb-3">
                    <div className="col-md-4 text-center">
                      <Badge color="primary" pill className="p-2">
                        <strong>{importResult.totalRecords}</strong><br />
                        Total
                      </Badge>
                    </div>
                    <div className="col-md-4 text-center">
                      <Badge color="success" pill className="p-2">
                        <strong>{importResult.successCount}</strong><br />
                        Réussis
                      </Badge>
                    </div>
                    <div className="col-md-4 text-center">
                      <Badge color="danger" pill className="p-2">
                        <strong>{importResult.errorCount}</strong><br />
                        Échecs
                      </Badge>
                    </div>
                  </Row>

                  {importResult.errorCount > 0 && (
                    <div>
                      <h5 className="text-danger">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        Erreurs rencontrées:
                      </h5>
                      <ListGroup className="max-height-200" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {importResult.errors.map((error, index) => (
                          <ListGroupItem key={index} color="danger" className="py-1 px-2">
                            <small>{error}</small>
                          </ListGroupItem>
                        ))}
                      </ListGroup>
                    </div>
                  )}

                  {importResult.successCount > 0 && (
                    <Alert color="success" className="mt-3">
                      <i className="fas fa-check mr-2"></i>
                      {importResult.successCount} employé(s) importé(s) avec succès !
                    </Alert>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              {!showImportResult ? (
                <>
                  <Button color="secondary" onClick={closeImportModal}>
                    Annuler
                  </Button>
                  <Button 
                    color="primary" 
                    onClick={handleImportCSV}
                    disabled={!csvFile || importLoading}
                  >
                    {importLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Import en cours...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-upload mr-2"></i>
                        Importer
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button color="secondary" onClick={resetImport}>
                    Nouvel Import
                  </Button>
                  <Button color="primary" onClick={closeImportModal}>
                    Fermer
                  </Button>
                </>
              )}
            </ModalFooter>
          </Modal>

          {/* ✅ FIX 9: Passer les callbacks de fermeture aux modals */}
          <AddEmployeeModal 
            show={modalShow} 
            onHide={handleModalClose}
            onSuccess={fetchAllEmployees} // Callback pour recharger après ajout
          />
          <EditEmployeeModal 
            show={editModalShow} 
            empl={editemp} 
            onHide={handleEditModalClose}
            onSuccess={fetchAllEmployees} // Callback pour recharger après modification
          />
        </Container>
      </div>
    </>
  )
}

export default Employees