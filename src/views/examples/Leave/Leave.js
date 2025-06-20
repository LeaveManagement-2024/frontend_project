import { useState, useEffect } from "react"
import {
  Badge,
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
  Button,
  Table,
  Container,
  Row,
} from "reactstrap"
import Dropdown from "react-bootstrap/Dropdown"
import DropdownButton from "react-bootstrap/DropdownButton"

import Header from "components/Headers/Header.js"
import AddLeaveModal from "./addLeaveModal"
import EditLeaveModal from "./editLeaveModal "
import {
  deleteLeave,
  getAllLeaves,
  ConfermedLeave,
  UnconfermedLeave,
  UnconfermedLeaveByManager,
  UnconfermedLeaveByResponsible,
  UnconfermedLeaveByRemplacment,
} from "./LeaveApi"
import "./modern-leave-styles.css"

const Leave = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const userId = localStorage.getItem("userId")
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOption, setFilterOption] = useState("all")
  const [editModalShow, setEditModalShow] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [editLeave, setEditLeave] = useState([])
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    fetchLeaves()
  }, [userId, filterOption])

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      let response
      switch (filterOption) {
        case "all":
          response = await getAllLeaves()
          break
        case "confirmed":
          response = await ConfermedLeave()
          break
        case "unconfirmed":
          response = await UnconfermedLeave()
          break
        case "manager":
          response = await UnconfermedLeaveByManager()
          break
        case "responsible":
          response = await UnconfermedLeaveByResponsible()
          break
        case "replacement":
          response = await UnconfermedLeaveByRemplacment()
          break
        default:
          response = await getAllLeaves()
          break
      }
      setLeaves(response)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors du chargement des congés :", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="modern-loading-container">
        <div className="modern-spinner">
          <div className="spinner-ring"></div>
          <p>Chargement des congés...</p>
        </div>
      </div>
    )
  }

  const handleDeleteLeave = async (id) => {
    try {
      await deleteLeave(id)
      fetchLeaves()
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
    }
  }

  const getFilterTitle = () => {
    switch (filterOption) {
      case "all":
        return "Tous les congés"
      case "confirmed":
        return "Congés confirmés"
      case "unconfirmed":
        return "Congés non confirmés"
      case "manager":
        return "En attente responsable"
      case "responsible":
        return "En attente service"
      case "replacement":
        return "En attente remplaçant"
      default:
        return "Filtrer les congés"
    }
  }

  return (
    <>
      <Header />
      <div className="modern-leave-container">
        <Container className="mt-2" fluid>
          <Row>
            <div className="col">
              <Card className="modern-leave-card">
                <CardHeader className="modern-card-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon">🏖️</div>
                      <div className="header-text">
                        <h3 className="header-title">Gestion des Congés</h3>
                        <p className="header-subtitle">Gérez et suivez tous les congés de l'équipe</p>
                      </div>
                    </div>
                    <div className="header-actions">
                      <div className="modern-dropdown-wrapper">
                        <DropdownButton
                          id="dropdown-item-button"
                          title={getFilterTitle()}
                          className="modern-filter-dropdown"
                        >
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("all")}
                          >
                            📋 Tous les congés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("confirmed")}
                          >
                            ✅ Congés confirmés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("unconfirmed")}
                          >
                            ⏳ Congés non confirmés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("manager")}
                          >
                            👔 En attente responsable
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("responsible")}
                          >
                            🏢 En attente service
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("replacement")}
                          >
                            🔄 En attente remplaçant
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                      <Button className="modern-add-button" onClick={() => setModalShow(true)}>
                        <i className="fas fa-plus"></i>
                        Nouveau congé
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <div className="modern-table-container">
                  <Table className="modern-table" responsive>
                    <thead className="modern-table-header">
                      <tr>
                        <th scope="col">👤 Employé</th>
                        <th scope="col">📝 Type de congé</th>
                        <th scope="col">📅 Date de départ</th>
                        <th scope="col">📅 Date de retour</th>
                        <th scope="col">👔 Responsable</th>
                        <th scope="col">🔄 Remplaçant</th>
                        <th scope="col">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="modern-table-body">
                      {currentItems.map((leave, index) => (
                        <tr key={index} className="modern-table-row">
                          <td className="employee-cell">
                            <div className="employee-info">
                              <div className="employee-avatar">
                                {leave.employee?.firstName?.charAt(0)}
                                {leave.employee?.lastName?.charAt(0)}
                              </div>
                              <div className="employee-name">
                                <strong>
                                  {leave.employee?.lastName} {leave.employee?.firstName}
                                </strong>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="leave-type-badge">{leave?.leaveType?.name}</span>
                          </td>
                          <td>
                            <div className="date-cell">
                              <i className="fas fa-calendar-alt"></i>
                              {leave.startDate}
                            </div>
                          </td>
                          <td>
                            <div className="date-cell">
                              <i className="fas fa-calendar-check"></i>
                              {leave.endDate}
                            </div>
                          </td>
                          <td>
                            <div className="approval-cell">
                              <div className="approver-name">
                                {leave.lmanager?.lastName} {leave.lmanager?.firstName}
                              </div>
                              <Badge
                                className={`modern-status-badge ${
                                  leave.managerVisa === "true"
                                    ? "approved"
                                    : leave.managerVisa === "false"
                                      ? "pending"
                                      : "unspecified"
                                }`}
                              >
                                {leave.managerVisa === "true" ? (
                                  <>
                                    <i className="fas fa-check"></i> Approuvé
                                  </>
                                ) : leave.managerVisa === "false" ? (
                                  <>
                                    <i className="fas fa-clock"></i> En attente
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-question"></i> Non spécifié
                                  </>
                                )}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div className="approval-cell">
                              <div className="approver-name">
                                {leave.replacement?.lastName} {leave.replacement?.firstName}
                              </div>
                              <Badge
                                className={`modern-status-badge ${
                                  leave.remplecementVisa === "true"
                                    ? "approved"
                                    : leave.remplecementVisa === "false"
                                      ? "pending"
                                      : "unspecified"
                                }`}
                              >
                                {leave.remplecementVisa === "true" ? (
                                  <>
                                    <i className="fas fa-check"></i> Approuvé
                                  </>
                                ) : leave.remplecementVisa === "false" ? (
                                  <>
                                    <i className="fas fa-clock"></i> En attente
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-question"></i> Non spécifié
                                  </>
                                )}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="modern-action-button"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                                disabled={leave.managerVisa === "true"}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu className="modern-dropdown-menu" right>
                                <DropdownItem
                                  className="modern-dropdown-action"
                                  href="#pablo"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="fas fa-eye"></i> Voir
                                </DropdownItem>
                                <DropdownItem
                                  className="modern-dropdown-action"
                                  href="#pablo"
                                  onClick={() => {
                                    setEditModalShow(true)
                                    setEditLeave(leave)
                                  }}
                                >
                                  <i className="fas fa-edit"></i> Modifier
                                </DropdownItem>
                                <DropdownItem
                                  className="modern-dropdown-action delete"
                                  href="#pablo"
                                  onClick={() => handleDeleteLeave(leave.leaveId)}
                                >
                                  <i className="fas fa-trash"></i> Supprimer
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <CardFooter className="modern-card-footer">
                  <div className="pagination-info">
                    Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, leaves.length)} sur {leaves.length}{" "}
                    congés
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
                        >
                          <i className="fas fa-chevron-left" />
                        </PaginationLink>
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(leaves.length / itemsPerPage) }, (_, i) => (
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
                        className={currentPage === Math.ceil(leaves.length / itemsPerPage) ? "disabled" : ""}
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
        </Container>

        <AddLeaveModal show={modalShow} onHide={() => setModalShow(false)} />
        <EditLeaveModal
          show={editModalShow}
          leave={editLeave}
          onHide={() => {
            setEditModalShow(false)
          }}
        />
      </div>
    </>
  )
}

export default Leave
