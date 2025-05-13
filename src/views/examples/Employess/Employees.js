import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Button,
  Col,
  Input,
  FormGroup,
  CardBody,
} from "reactstrap";
import AddEmployeeModal from './addEmployeeModal';
import EditEmployeeModal from './editEmployeeModal';
import Header from "components/Headers/Header.js";
import {
  loginEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
} from './employeeApi';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState({});
  const [logInDTO, setLogInDTO] = useState({ email: '', password: '' });
  const [employeeId, setEmployeeId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editemp, setEditemp] = useState([]);

  useEffect(() => {
    fetchAllEmployees();
  }, [employees]);

  const fetchAllEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des employés:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginEmployee(logInDTO);
      setMessage(response.message);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  const handleGetEmployeeById = async (idE) => {
    if (!idE) {
      console.error('Erreur : l\'ID de l\'employé est indéfini.');
      return;
    }
    try {
      const data = await getEmployeeById(idE);
      setEmployee(data);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'employé:', error);
    }
  };

  const handleDeleteEmployee = async (idE) => {
    try {
      await deleteEmployee(idE);
      setMessage('L\'employé a été supprimé avec succès');
      fetchAllEmployees(); // Actualiser la liste
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'employé:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employees.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <Button color="primary" onClick={() => setModalShow(true)}>
                    Ajouter un employé
                  </Button>
                  <AddEmployeeModal show={modalShow} onHide={() => setModalShow(false)}></AddEmployeeModal>
                  <h3 className="mb-0">Tableau des employés</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col">Nom complet</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Numéro de carte d'identité</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Téléphone</th>
                    <th scope="col">Adresse personnelle</th>
                    <th scope="col">Paramètres</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.length > 0 ? (
                    currentItems.map((emp) => (
                      <tr key={emp.idE}>
                        <th scope="row">
                          <Media className="align-items-center">
                            <img className="avatar rounded-circle mr-3"
                              alt="..."
                              src={emp.image}
                            />
                            <Media>
                              <span className="mb-0 text-sm mx-3">
                                {emp.firstNameAr} {emp.lastNameAr}
                              </span>
                            </Media>
                          </Media>
                        </th>
                        <td>{emp?.grade?.gradeNameAr}</td>
                        <td>{emp.cin}</td>
                        <td>{emp.email}</td>
                        <td>{emp.phone}</td>
                        <td>{emp.addressAr}</td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="md"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                href="#pablo"
                                onClick={() => handleGetEmployeeById(emp.idE)}
                              >
                                Voir
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => { setEditModalShow(true); setEditemp(emp); }}
                              >
                                Modifier
                              </DropdownItem>
                              <EditEmployeeModal 
                                show={editModalShow}
                                empl={editemp} 
                                onHide={() => { setEditModalShow(false); }}
                              />
                              <DropdownItem
                                onClick={() => handleDeleteEmployee(emp.idE)}
                              >
                                Supprimer
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Chargement...</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4 text-right">
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-start mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Précédent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(employees.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(employees.length / itemsPerPage) ? 'disabled' : ''}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Suivant</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        {/* Exemple pour le formulaire d'ajout/modification des employés */}
      </Container>
    </>
  );
};

export default Employees;
