import React, { useState, useEffect } from 'react';
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
  Button,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import Header from "components/Headers/Header.js";
import AddLeaveModal from './addLeaveModal';

import EditLeaveModal from './editLeaveModal ';
import {
  getAllLeavesByEmployee,
  getConfirmedLeavesByEmployee,
  getUnconfirmedLeavesByEmployee,
  getLeavesToConfirmByManager,
  getLeavesToConfirmByResponsible,
  getLeavesToConfirmByRemplacement,
} from '../Employess/employeeApi';
import { 
   deleteLeave,
   getAllLeaves,
   ConfermedLeave ,
   UnconfermedLeave,
   UnconfermedLeaveByManager,
   UnconfermedLeaveByResponsible,
   UnconfermedLeaveByRemplacment
  } from './LeaveApi';
import "../style.css"
const Leave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const userId = localStorage.getItem('userId');
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');
  const [editModalShow, setEditModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [editLeave, setEditLeave] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchLeaves();
  }, [userId, filterOption]);

  const fetchLeaves = async () => {
    setLoading(true); 
    try {
      let response;
      switch (filterOption) {
        case 'all':
          response = await getAllLeaves();
          break;
        case 'confirmed':
          response = await ConfermedLeave();
          break;
        case 'unconfirmed':
          response = await UnconfermedLeave();
          break;
        case 'manager':
          response = await UnconfermedLeaveByManager();
          break;
        case 'responsible':
          response = await UnconfermedLeaveByResponsible();
          break;
        case 'replacement':
          response = await UnconfermedLeaveByRemplacment();
          break;
        default:
          response = await getAllLeaves();
          break;
      }
      setLeaves(response);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des congés :", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>; // Ou un composant spinner
  }
  
  const handleDeleteLeave = async (id) => {
    try {
      await deleteLeave(id);
      fetchLeaves();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <DropdownButton id="dropdown-item-button" title="Autres options">
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('all')}>
                      Tous les congés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('confirmed')}>
                      Congés confirmés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('unconfirmed')}>
                      Congés non confirmés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('manager')}>
                      Congés non confirmés par le responsable
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('responsible')}>
                      Congés non confirmés par le responsable de service
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('replacement')}>
                      Congés non confirmés par le remplaçant
                    </Dropdown.Item>
                  </DropdownButton>
                  <Button color="primary" onClick={() => setModalShow(true)}>
                     Demander un congé pour l'employé
                  </Button>
                  <AddLeaveModal show={modalShow} onHide={() => setModalShow(false)} />
                  <h3 className="mb-0">Tableau des congés</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col" >Nom de l'employé</th>
                    <th scope="col">Type de congé</th>
                    <th scope="col">Date de départ</th>
                    <th scope="col">Date de retour</th>
                    <th scope="col">Responsable du département</th>                   
                    <th scope="col">Responsable de service</th>
                    <th scope="col">Nom du remplaçant</th>
                    <th scope="col">Paramètres</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((leave, index) => (
                    <tr key={index}>
                      <th>{leave.lmanager?.lastNameAr} {leave.lmanager?.firstNameAr}</th>
                      <td scope="row">{leave?.leaveType?.name}</td>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.startDate}</td>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.endDate}</td>
                      <td>
                        {leave.lmanager?.lastNameAr} {leave.lmanager?.firstNameAr}
                        <Badge color={leave.managerVisa === 'true' ? 'success' : leave.managerVisa === 'false' ? 'warning' : 'secondary'}>
                          {leave.managerVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.managerVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non spécifié'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.responsible?.lastNameAr} {leave.responsible?.firstNameAr}
                        <Badge color={leave.responsibleVisa === 'true' ? 'success' : leave.responsibleVisa === 'false' ? 'warning' : 'secondary'}>
                          {leave.responsibleVisa === 'true' ? (
                            <i className="fas fa-check fa-2x "></i>
                          ) : leave.responsibleVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non spécifié'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.replacement?.lastNameAr} {leave.replacement?.firstNameAr}
                        <Badge color={leave.remplecementVisa === 'true' ? 'success' : leave.remplecementVisa === 'false' ? 'warning' : 'secondary'}>
                          {leave.remplecementVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.remplecementVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non spécifié'
                          )}
                        </Badge> 
                      </td>
                      <td>
                        <UncontrolledDropdown>
                          <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}
                            disabled={leave.managerVisa === 'true'}>
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                              Voir
                            </DropdownItem>
                            <DropdownItem href="#pablo" onClick={() => {
                              setEditModalShow(true);
                              setEditLeave(leave);
                            }}>
                              Modifier
                            </DropdownItem>
                            <EditLeaveModal
                              show={editModalShow}
                              leave={editLeave}
                              onHide={() => { setEditModalShow(false); }}
                            />
                            <DropdownItem href="#pablo" onClick={() => handleDeleteLeave(leave.leaveId)}>
                              Supprimer
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                    <PaginationItem className={currentPage === 1 ? 'disabled' : ''}>
                      <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}>
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Précédent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(leaves.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(i + 1); }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(leaves.length / itemsPerPage) ? 'disabled' : ''}>
                      <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}>
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
      </Container>
    </>
  );
};

export default Leave;
