"use client"

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

import Header2 from "components/Headers/Header2.js"
import AddLeavePersonModal from "./addLeavePersonModal"
import EditLeaveModal from "./editLeaveModal "
import {
  getAllLeavesByEmployee,
  getConfirmedLeavesByEmployee,
  getUnconfirmedLeavesByEmployee,
  getLeavesToConfirmByManager,
  getLeavesToConfirmByResponsible,
  getLeavesToConfirmByRemplacement,
  getListesLeavesToConfirm,
  getListesConfirmedLeaves,
  postLeavesToConfirmE,
  postLeavesToUnconfirmE,
} from "../Employess/employeeApi"
import { deleteLeave } from "./LeaveApi"
import "./modern-leave-styles.css"

const PersonalLeave = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [currentPage1, setCurrentPage1] = useState(1)
  const itemsPerPage1 = 5
  const userId = localStorage.getItem("userId")
  const [leaves, setLeaves] = useState([])
  const [listsleaves, setListsLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterOption, setFilterOption] = useState("all")
  const [filterOption1, setFilterOption1] = useState("confirmed")
  const [editModalShow, setEditModalShow] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [editLeave, setEditLeave] = useState([])
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem)
  const indexOfLastItem1 = currentPage1 * itemsPerPage1
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage1
  const currentItems1 = listsleaves.slice(indexOfFirstItem1, indexOfLastItem1)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  useEffect(() => {
    fetchLeaves()
    fetchLeavesConfUnconf()
  }, [userId, filterOption, filterOption1])

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      let response
      switch (filterOption) {
        case "all":
          response = await getAllLeavesByEmployee(userId)
          break
        case "confirmed":
          response = await getConfirmedLeavesByEmployee(userId)
          break
        case "unconfirmed":
          response = await getUnconfirmedLeavesByEmployee(userId)
          break
        case "manager":
          response = await getLeavesToConfirmByManager(userId)
          break
        case "responsible":
          response = await getLeavesToConfirmByResponsible(userId)
          break
        case "replacement":
          response = await getLeavesToConfirmByRemplacement(userId)
          break
        default:
          response = await getAllLeavesByEmployee(userId)
          break
      }
      setLeaves(response)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error)
      setLoading(false)
    }
  }

  const fetchLeavesConfUnconf = async () => {
    setLoading(true)
    try {
      let response
      switch (filterOption1) {
        case "confirmed":
          response = await getListesConfirmedLeaves(userId)
          break
        case "unconfirmed":
          response = await getListesLeavesToConfirm(userId)
          break
        default:
          response = await getListesLeavesToConfirm(userId)
          break
      }
      setListsLeaves(response)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error)
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

  const confirmLeave = async (ide, idl) => {
    try {
      await postLeavesToConfirmE(ide, idl)
      fetchLeavesConfUnconf()
    } catch (error) {
      console.error("Erreur :", error)
    }
  }

  const unconfirmLeave = async (ide, idl) => {
    try {
      await postLeavesToUnconfirmE(ide, idl)
      fetchLeavesConfUnconf()
    } catch (error) {
      console.error("Erreur :", error)
    }
  }

  const getFilterTitle = (option) => {
    switch (option) {
      case "all":
        return "Tous les congés"
      case "confirmed":
        return "Congés approuvés"
      case "unconfirmed":
        return "Congés non approuvés"
      case "manager":
        return "En attente chef"
      case "responsible":
        return "En attente responsable"
      case "replacement":
        return "En attente remplaçant"
      default:
        return "Filtrer"
    }
  }

  return (
    <>
      <Header2 />
      <div className="modern-personal-leave-container">
        <Container className="mt--7" fluid>
          {/* Première table - Mes congés */}
          <Row>
            <div className="col">
              <Card className="modern-personal-card">
                <CardHeader className="modern-personal-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon">🏖️</div>
                      <div className="header-text">
                        <h3 className="header-title">Mes Congés</h3>
                        <p className="header-subtitle">Gérez vos demandes de congés</p>
                      </div>
                    </div>
                    <div className="header-actions">
                      <div className="modern-dropdown-wrapper">
                        <DropdownButton
                          id="dropdown-item-button"
                          title={getFilterTitle(filterOption)}
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
                            ✅ Congés approuvés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("unconfirmed")}
                          >
                            ⏳ Congés non approuvés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("manager")}
                          >
                            👔 En attente chef de département
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption("responsible")}
                          >
                            🏢 En attente responsable du service
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
                        Demander un congé
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <div className="modern-table-container">
                  <Table className="modern-table" responsive>
                    <thead className="modern-table-header">
                      <tr>
                        <th scope="col">📝 Type de congé</th>
                        <th scope="col">📅 Date de départ</th>
                        <th scope="col">📅 Date de reprise</th>
                        <th scope="col">👔 Chef de département</th>
                        <th scope="col">🔄 Remplaçant</th>
                        <th scope="col">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="modern-table-body">
                      {currentItems.map((leave, index) => (
                        <tr
                          key={index}
                          className={`modern-table-row ${
                            leave.managerVisa === "true"
                              ? "approved-row"
                              : leave.managerVisa === "false"
                                ? "pending-row"
                                : ""
                          }`}
                        >
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
                                    <i className="fas fa-question"></i> Non défini
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
                                    <i className="fas fa-question"></i> Non défini
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
                                  <i className="fas fa-eye"></i> Afficher
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

          {/* Deuxième table - Congés à approuver */}
          <Row className="mt-5">
            <div className="col">
              <Card className="modern-approval-card">
                <CardHeader className="modern-approval-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon">⚖️</div>
                      <div className="header-text">
                        <h3 className="header-title">Congés à Approuver</h3>
                        <p className="header-subtitle">Validez les demandes de congés</p>
                      </div>
                    </div>
                    <div className="header-actions">
                      <div className="modern-dropdown-wrapper">
                        <DropdownButton
                          id="dropdown-item-button-2"
                          title={getFilterTitle(filterOption1)}
                          className="modern-filter-dropdown approval"
                        >
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption1("confirmed")}
                          >
                            ✅ Congés approuvés
                          </Dropdown.Item>
                          <Dropdown.Item
                            as="button"
                            className="modern-dropdown-item"
                            onClick={() => setFilterOption1("unconfirmed")}
                          >
                            ⏳ Congés non approuvés
                          </Dropdown.Item>
                        </DropdownButton>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <div className="modern-table-container approval">
                  <Table className="modern-table approval" responsive>
                    <thead className="modern-table-header approval">
                      <tr>
                        <th scope="col">👤 Employé</th>
                        <th scope="col">📅 Date de départ</th>
                        <th scope="col">📅 Date de reprise</th>
                        <th scope="col">👔 Chef de département</th>
                        <th scope="col">🔄 Remplaçant</th>
                        <th scope="col">⚙️ Actions</th>
                      </tr>
                    </thead>
                    <tbody className="modern-table-body approval">
                      {currentItems1.map((leave, index) => (
                        <tr key={index} className="modern-table-row approval">
                          <td className="employee-cell">
                            <div className="employee-info">
                              <div className="employee-avatar">
                                {leave?.employee?.firstName?.charAt(0)}
                                {leave?.employee?.lastName?.charAt(0)}
                              </div>
                              <div className="employee-name">
                                <strong>
                                  {leave?.employee?.lastName} {leave?.employee?.firstName}
                                </strong>
                              </div>
                            </div>
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
                                    <i className="fas fa-question"></i> Non défini
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
                                    <i className="fas fa-question"></i> Non défini
                                  </>
                                )}
                              </Badge>
                            </div>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Button
                                className="modern-approve-button"
                                onClick={() => confirmLeave(userId, leave.leaveId)}
                              >
                                <i className="fas fa-check"></i>
                                Approuver
                              </Button>
                              <Button
                                className="modern-reject-button"
                                onClick={() => unconfirmLeave(userId, leave.leaveId)}
                              >
                                <i className="fas fa-times"></i>
                                Refuser
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                <CardFooter className="modern-card-footer approval">
                  <div className="pagination-info">
                    Affichage de {indexOfFirstItem1 + 1} à {Math.min(indexOfLastItem1, listsleaves.length)} sur{" "}
                    {listsleaves.length} congés
                  </div>
                  <nav aria-label="...">
                    <Pagination className="modern-pagination">
                      <PaginationItem className={currentPage1 === 1 ? "disabled" : ""}>
                        <PaginationLink
                          className="modern-pagination-link"
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(currentPage1 - 1)
                          }}
                        >
                          <i className="fas fa-chevron-left" />
                        </PaginationLink>
                      </PaginationItem>
                      {Array.from({ length: Math.ceil(listsleaves.length / itemsPerPage1) }, (_, i) => (
                        <PaginationItem key={i + 1} className={currentPage1 === i + 1 ? "active" : ""}>
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
                        className={currentPage1 === Math.ceil(listsleaves.length / itemsPerPage1) ? "disabled" : ""}
                      >
                        <PaginationLink
                          className="modern-pagination-link"
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(currentPage1 + 1)
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

        <AddLeavePersonModal show={modalShow} onHide={() => setModalShow(false)} />
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

export default PersonalLeave
