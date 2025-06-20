"use client"

import { useState, useEffect } from "react"
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
} from "reactstrap"
import AddEmployeeModal from "./addEmployeeModal"
import EditEmployeeModal from "./editEmployeeModal"
import Header from "components/Headers/Header.js"
import { loginEmployee, getAllEmployees, getEmployeeById, deleteEmployee } from "./employeeApi"
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

  useEffect(() => {
    fetchAllEmployees()
  }, [employees])

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees()
      setEmployees(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des employés:", error)
    }
  }

  const handleLogin = async () => {
    try {
      const response = await loginEmployee(logInDTO)
      setMessage(response.message)
    } catch (error) {
      console.error("Erreur de connexion:", error)
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
    }
  }

  const handleDeleteEmployee = async (idE) => {
    try {
      await deleteEmployee(idE)
      setMessage("L'employé a été supprimé avec succès")
      fetchAllEmployees() // Actualiser la liste
    } catch (error) {
      console.error("Erreur lors de la suppression de l'employé:", error)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem)
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
                    </div>
                    <div className="header-actions">
                      <div className="stats-summary">
                        <div className="stat-item">
                          <span className="stat-number">{employees.length}</span>
                          <span className="stat-label">Employés</span>
                        </div>
                      </div>
                      <Button className="modern-add-button" onClick={() => setModalShow(true)}>
                        <i className="fas fa-user-plus"></i>
                        Nouvel employé
                      </Button>
                    </div>
                  </div>
                </CardHeader>

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
                      {currentItems.length > 0 ? (
                        currentItems.map((emp, index) => (
                          <tr key={emp.idE} className="modern-table-row" style={{ animationDelay: `${index * 0.05}s` }}>
                            <td className="employee-info-cell">
                              <div className="employee-profile">
                                <div className="avatar-container">
                                  <img
                                    className="employee-avatar"
                                    alt={`${emp.firstName} ${emp.lastName}`}
                                    src={emp.image || "https://www.w3schools.com/howto/img_avatar.png"}
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
                                <span className="info-badge">{emp.cin}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="email-text">{emp.email}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="phone-text">{emp.phone}</span>
                              </div>
                            </td>
                            <td>
                              <div className="info-cell">
                                <span className="address-text" title={emp.address}>
                                  {emp.address?.length > 30 ? `${emp.address.substring(0, 30)}...` : emp.address}
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
                          <td colSpan="6" className="loading-cell">
                            <div className="loading-content">
                              <div className="loading-spinner">
                                <div className="spinner-ring"></div>
                              </div>
                              <span>Chargement des employés...</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

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
                            paginate(currentPage - 1)
                          }}
                          tabIndex="-1"
                        >
                          <i className="fas fa-chevron-left" />
                        </PaginationLink>
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(employees.length / itemsPerPage) }, (_, i) => (
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
                      <PaginationItem
                        className={currentPage === Math.ceil(employees.length / itemsPerPage) ? "disabled" : ""}
                      >
                        <PaginationLink
                          className="modern-pagination-link"
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(currentPage + 1)
                          }}
                        >
                          <i className="fas fa-chevron-right" />
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </nav>
                </CardFooter>
              </Card>
            </div>
          </Row>

          <AddEmployeeModal show={modalShow} onHide={() => setModalShow(false)} />
          <EditEmployeeModal show={editModalShow} empl={editemp} onHide={() => setEditModalShow(false)} />
        </Container>
      </div>
    </>
  )
}

export default Employees
