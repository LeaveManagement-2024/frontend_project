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
// core components
import Header2 from "components/Headers/Header2.js";
import AddLeaveModal from './addLeaveModal';
import AddLeavePersonModal from './addLeavePersonModal';
import EditLeaveModal from './editLeaveModal ';
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

} from '../Employess/employeeApi';
import { deleteLeave } from './LeaveApi';
import "../style.css"
const Leave = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [currentPage1, setCurrentPage1] = useState(1);
  const itemsPerPage1 = 5;
  const userId = localStorage.getItem('userId');
  const [leaves, setLeaves] = useState([]);
  const [listsleaves, setListsLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all');
  const [filterOption1, setFilterOption1] = useState('confirmed');
  const [editModalShow, setEditModalShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [editLeave, setEditLeave] = useState([]);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem);
  const indexOfLastItem1 = currentPage1 * itemsPerPage1;
  const indexOfFirstItem1 = indexOfLastItem1 - itemsPerPage1;
  const currentItems1 = listsleaves.slice(indexOfFirstItem1, indexOfLastItem1);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  useEffect(() => {
    fetchLeaves();
    fetchLeavesConfUnconf();
  }, [userId, filterOption, filterOption1]);

  const fetchLeaves = async () => {
    setLoading(true); 
    try {
      let response;
      switch (filterOption) {
        case 'all':
          response = await getAllLeavesByEmployee(userId);
          break;
        case 'confirmed':
          response = await getConfirmedLeavesByEmployee(userId);
          break;
        case 'unconfirmed':
          response = await getUnconfirmedLeavesByEmployee(userId);
          break;
        case 'manager':
          response = await getLeavesToConfirmByManager(userId);
          break;
        case 'responsible':
          response = await getLeavesToConfirmByResponsible(userId);
          break;
        case 'replacement':
          response = await getLeavesToConfirmByRemplacement(userId);
          break;
        default:
          response = await getAllLeavesByEmployee(userId);
          break;
      }
      setLeaves(response);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error);
      setLoading(false);
    }
  };
  const fetchLeavesConfUnconf = async () => {
    setLoading(true); 
    try {
      let response;
      switch (filterOption1) {
        case 'confirmed':
          response = await getListesConfirmedLeaves(userId);
          break;
        case 'unconfirmed':
          response = await getListesLeavesToConfirm(userId);
          break;
        default:
          response = await getListesLeavesToConfirm(userId);
          break;
      }
      setListsLeaves(response);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des congés :", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>; 
  }
  
  const handleDeleteLeave = async (id) => {
    try {
      await deleteLeave(id);
      fetchLeaves();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };
  const confirmLeave = async (ide, idl) => {
    try {
      await postLeavesToConfirmE(ide, idl);
      fetchLeavesConfUnconf();
    } catch (error) {
      console.error('Erreur :', error);
    }
  };
  const unconfirmLeave = async (ide, idl) => {
    try {
      await postLeavesToUnconfirmE(ide, idl);
      fetchLeavesConfUnconf();
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  return (
    <>
      <Header2 />
      <Container className="mt--7" fluid>
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
                      Congés approuvés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('unconfirmed')}>
                      Congés non approuvés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('manager')}>
                      Congés non approuvés par le chef de département
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('responsible')}>
                      Congés non approuvés par le responsable du service
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption('replacement')}>
                      Congés non approuvés par le remplaçant
                    </Dropdown.Item>
                  </DropdownButton>
                  <Button color="primary" onClick={() => setModalShow(true)}>
                    Demander un congé
                  </Button>
                  <AddLeavePersonModal show={modalShow} onHide={() => setModalShow(false)} />
                  <h3 className="mb-0">Tableau des congés</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col">Type de congé</th>
                    <th scope="col">Date de départ</th>
                    <th scope="col">Date de reprise</th>
                    <th scope="col">Chef de département</th>                   
                    <th scope="col">Responsable du service</th>
                    <th scope="col">Nom du remplaçant</th>
                    <th scope="col">Paramètres</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((leave, index) => (
                    <tr
                      key={index}
                      className={
                        leave.managerVisa === 'true' ? 'manager-visa-true' :
                        leave.managerVisa === 'false' ? 'manager-visa-false' : ''
                      }
                    >
                      <th scope="row">{leave?.leaveType?.name}</th>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.startDate}</td>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.endDate}</td>
                      <td>
                        {leave.lmanager?.lastName} {leave.lmanager?.firstName}
                        <Badge color={leave.managerVisa === 'true' ? 'success' : leave.managerVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}} >
                          {leave.managerVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.managerVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.responsible?.lastName} {leave.responsible?.firstName}
                        <Badge color={leave.responsibleVisa === 'true' ? 'success' : leave.responsibleVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}}>
                          {leave.responsibleVisa === 'true' ? (
                            <i className="fas fa-check fa-2x "></i>
                          ) : leave.responsibleVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.replacement?.lastName} {leave.replacement?.firstName}
                        <Badge color={leave.remplecementVisa === 'true' ? 'success' : leave.remplecementVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}}>
                          {leave.remplecementVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.remplecementVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        <UncontrolledDropdown>
                          <DropdownToggle className="btn-icon-only text-light" href="#pablo" role="button" size="sm" color="" onClick={(e) => e.preventDefault()}
                            disabled={leave.managerVisa === 'true'} >
                            <i className="fas fa-ellipsis-v text-dark" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                              Afficher
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

        <Row className="mt-5">
          <div className="col">
            <Card className="bg-default shadow">
              <CardHeader className="bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <DropdownButton id="dropdown-item-button" title="Autres options">
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption1('confirmed')}>
                      Congés approuvés
                    </Dropdown.Item>
                    <Dropdown.Item as="button" className='text-right text-lg' onClick={() => setFilterOption1('unconfirmed')}>
                      Congés non approuvés
                    </Dropdown.Item>
                  </DropdownButton>
                  <h3 className="mb-0 text-white">Tableau des congés</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-dark table-flush" responsive>
                <thead className="text-center thead-dark">
                  <tr>
                    <th scope="col">Nom de l'employé</th>
                    <th scope="col">Date de départ</th>
                    <th scope="col">Date de reprise</th>
                    <th scope="col">Chef de département</th>                   
                    <th scope="col">Responsable du service</th>
                    <th scope="col">Nom du remplaçant</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems1.map((leave, index) => (
                    <tr>
                      <th scope="row">{leave?.employee?.lastName} {leave?.employee?.firstName}</th>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.startDate}</td>
                      <td><i className="ni ni-calendar-grid-58" /> {leave.endDate}</td>
                      <td>
                        {leave.lmanager?.lastName} {leave.lmanager?.firstName}
                        <Badge color={leave.managerVisa === 'true' ? 'success' : leave.managerVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}} >
                          {leave.managerVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.managerVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.responsible?.lastName} {leave.responsible?.firstName}
                        <Badge color={leave.responsibleVisa === 'true' ? 'success' : leave.responsibleVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}}>
                          {leave.responsibleVisa === 'true' ? (
                            <i className="fas fa-check fa-2x "></i>
                          ) : leave.responsibleVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        {leave.replacement?.lastName} {leave.replacement?.firstName}
                        <Badge color={leave.remplecementVisa === 'true' ? 'success' : leave.remplecementVisa === 'false' ? 'warning' : 'secondary'} style={{marginRight:'15px'}}>
                          {leave.remplecementVisa === 'true' ? (
                            <i className="fas fa-check fa-2x"></i>
                          ) : leave.remplecementVisa === 'false' ? (
                            <i className="fas fa-exclamation fa-2x"></i>
                          ) : (
                            'Non défini'
                          )}
                        </Badge>
                      </td>
                      <td>
                        <Button style={{marginLeft:"10px"}}
                          color="primary"
                          onClick={() => confirmLeave(userId, leave.leaveId)}
                        >
                          Approuver
                        </Button>
                        <Button
                          color="primary"
                          onClick={() => unconfirmLeave(userId, leave.leaveId)}
                        >
                          Refuser
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4 bg-default shadow">
                <nav aria-label="...">
                  <Pagination className="pagination justify-content-end mb-0" listClassName="justify-content-end mb-0">
                    <PaginationItem className={currentPage1 === 1 ? 'disabled' : ''}>
                      <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(currentPage1 - 1); }}>
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Précédent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(leaves.length / itemsPerPage1) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage1 === i + 1 ? 'active' : ''}>
                        <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(i + 1); }}>
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage1 === Math.ceil(leaves.length / itemsPerPage1) ? 'disabled' : ''}>
                      <PaginationLink href="#pablo" onClick={(e) => { e.preventDefault(); paginate(currentPage1 + 1); }}>
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