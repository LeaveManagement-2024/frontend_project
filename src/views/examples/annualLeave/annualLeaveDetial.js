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
  Table,
  Container,
  Row,
  Button,
  CardBody,
  Alert,
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { MdDelete, MdEdit, MdMoreVert } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { BsCalendar2XFill, BsCalendar2CheckFill, BsPersonPlus } from "react-icons/bs";
import { IoMdSettings } from "react-icons/io";
import { useParams } from 'react-router-dom';
import AddModal from './addEmpInAL';
import EditModal from './editModal';
import Header from "components/Headers/Header.js";
import {
  getAnnualLeaveLineById,
  deleteAnnualLeaveLine,
  deleteAnnualLeave,
  setOfStatus,
  setOnStatus,
  getAnnualLeaveById,
} from './annualLeaveAPI';
import "../../examples/style.css"
import UpdateAnnualLeaveModal from './updateAnnualLeave ';

const AnnualLeaveDetial = () => {
  const [annualLeaveLines, setAnnualLeaveLines] = useState([]);
  const [annualLeave, setAnnualLeave] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editGrade, setEditGrade] = useState([])
  const [editIdan, setIdan] = useState('')
  const { idan } = useParams();
  const navigate = useNavigate();
  const [isError, setIsError] = useState(false);
  const [editModalShow2, setEditModalShow2] = useState(false);

  useEffect(() => {
    fetchAllAnnualLeaveLine(idan);
    fetchAllAnnualLeave(idan);
  }, []);

  const fetchAllAnnualLeaveLine = async (id) => {
    try {
      const data = await getAnnualLeaveLineById(id);
      setAnnualLeaveLines(data);
    } catch (error) {
      console.error('Error fetching AnnualLeaveLines:', error);
    }
  };

  const fetchAllAnnualLeave = async (id) => {
    try {
      const data = await getAnnualLeaveById(id);
      setAnnualLeave(data);
    } catch (error) {
      console.error('Error fetching AnnualLeave:', error);
    }
  };

  const hundelsetOfStatus = async (id) => {
    try {
      await setOfStatus(id);
      setIsError(false);
      setMessage('La désactivation du congé annuel a été effectuée avec succès');
      fetchAllAnnualLeave(idan);
    } catch (error) {
      console.error('Error fetching AnnualLeave:', error);
      setIsError(true);
      setMessage("La modification du congé annuel a été effectuée avec succès");
      fetchAllAnnualLeave(idan);
    }
  };

  const hundelsetOnStatus = async (id) => {
    try {
      await setOnStatus(id);
      setIsError(false);
      setMessage("La modification du congé annuel a été effectuée avec succès");
      fetchAllAnnualLeave(idan);
    } catch (error) {
      console.error('Error fetching AnnualLeave:', error);
      setIsError(true);
      setMessage("La modification du congé annuel n'a pas été effectuée avec succès");
      fetchAllAnnualLeave(idan);
    }
  };

  const handleDeleteAnnualLeaveLine = async (ide, idal) => {
    if (!ide || !idal) {
      console.error('Invalid IDs:', ide, idal);
      return;
    }
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
    if (!confirmDelete) {
      return;
    }
    try {
      await deleteAnnualLeaveLine(ide, idal);
      setIsError(false);
      setMessage('Suppression réussie');
      fetchAllAnnualLeaveLine(idan);
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage('Impossible de supprimer cet élément');
      setIsError(true);
    }
  };

  const handleDeleteAnnualLeave = async (id) => {
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }

    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
    if (!confirmDelete) {
      return;
    }

    try {
      await deleteAnnualLeave(id);
      setMessage('Suppression réussie');
      navigate('/admin/annualLeave');
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage('Impossible de supprimer ce congé annuel');
      setIsError(true);
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleEditClick = () => {
    setEditModalShow(true);
  };

  const handleUpdate = () => {
    fetchAllAnnualLeave(idan);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = annualLeaveLines.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt-4" fluid>
        <Row>
          <div className="col">
            {/* Message d'alerte moderne */}
            {message && (
              <Alert 
                color={isError ? 'danger' : 'success'} 
                className="shadow-sm border-0 mb-4"
                style={{
                  borderLeft: `4px solid ${isError ? '#dc3545' : '#28a745'}`,
                  borderRadius: '8px'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className={`fas ${isError ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2`}></i>
                  {message}
                </div>
              </Alert>
            )}

            <Card className="shadow-lg border-0" style={{ borderRadius: '12px' }}>
              <CardHeader className="border-0 bg-gradient-primary text-white" style={{ borderRadius: '12px 12px 0 0' }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-1 text-white">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      Congé annuel : {annualLeave.label}
                    </h2>
                    <Badge 
                      color={annualLeave.status === 'enabled' ? 'success' : 'warning'} 
                      pill 
                      className="px-3 py-2"
                      style={{ fontSize: '0.85rem' }}
                    >
                      <i className={`fas ${annualLeave.status === 'enabled' ? 'fa-check-circle' : 'fa-pause-circle'} mr-1`}></i>
                      {annualLeave.status === 'enabled' ? 'Activé' : 'Désactivé'}
                    </Badge>
                  </div>

                  <div className="d-flex gap-2">
                    <Button 
                      color="light" 
                      size="sm"
                      onClick={() => { setModalShow(true); setIdan(idan) }}
                      className="d-flex align-items-center shadow-sm"
                      style={{ borderRadius: '8px' }}
                    >
                      <BsPersonPlus className="mr-1" />
                      Ajouter des employés
                    </Button>

                    <DropdownButton 
                      id="dropdown-actions" 
                      title={<><IoMdSettings className="mr-1" />Actions</>}
                      variant="outline-light"
                      size="sm"
                      className="shadow-sm"
                    >
                      <Dropdown.Item onClick={handleEditClick}>
                        <AiFillEdit className="mr-2" />
                        Modifier les informations
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => hundelsetOfStatus(idan)}>
                        <BsCalendar2XFill className="mr-2" />
                        Désactiver le congé
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => hundelsetOnStatus(idan)}>
                        <BsCalendar2CheckFill className="mr-2" />
                        Activer le congé
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={() => handleDeleteAnnualLeave(idan)} className="text-danger">
                        <MdDelete className="mr-2" />
                        Supprimer le congé
                      </Dropdown.Item>
                    </DropdownButton>
                  </div>
                </div>
              </CardHeader>

              <CardBody className="p-0">
                <Table className="align-items-center table-flush mb-0" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th className="border-0 text-center" style={{ 
                        color: '#6c757d', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        padding: '1rem'
                      }}>
                        <i className="fas fa-user mr-2"></i>
                        Nom de l'employé
                      </th>
                      <th className="border-0 text-center" style={{ 
                        color: '#6c757d', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        padding: '1rem'
                      }}>
                        <i className="fas fa-calendar-day mr-2"></i>
                        Jours d'origine
                      </th>
                      <th className="border-0 text-center" style={{ 
                        color: '#6c757d', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        padding: '1rem'
                      }}>
                        <i className="fas fa-clock mr-2"></i>
                        Jours restants
                      </th>
                      <th className="border-0 text-center" style={{ 
                        color: '#6c757d', 
                        fontWeight: '600', 
                        fontSize: '0.875rem',
                        padding: '1rem'
                      }}>
                        <i className="fas fa-cogs mr-2"></i>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((all, index) => (
                      <tr key={all.employee.idE} className={index % 2 === 0 ? 'bg-light' : ''}>
                        <td className="text-center" style={{ padding: '1rem' }}>
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="avatar avatar-sm rounded-circle bg-primary text-white mr-3 d-flex align-items-center justify-content-center">
                              {all?.employee?.firstName?.charAt(0)}
                            </div>
                            <span style={{ color: '#495057', fontWeight: '500', fontSize: '0.95rem' }}>
                              {all?.employee?.lastName} {all?.employee?.firstName}
                            </span>
                          </div>
                        </td>
                        <td className="text-center" style={{ padding: '1rem' }}>
                          <Badge color="info" pill className="px-3 py-2" style={{ fontSize: '0.9rem' }}>
                            {all.declaredDays} jours
                          </Badge>
                        </td>
                        <td className="text-center" style={{ padding: '1rem' }}>
                          <Badge 
                            color={all.remainingDays > 5 ? 'success' : all.remainingDays > 0 ? 'warning' : 'danger'} 
                            pill 
                            className="px-3 py-2" 
                            style={{ fontSize: '0.9rem' }}
                          >
                            {all.remainingDays} jours
                          </Badge>
                        </td>
                        <td className="text-center" style={{ padding: '1rem' }}>
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn btn-sm btn-outline-secondary border-0"
                              style={{ borderRadius: '8px' }}
                            >
                              <MdMoreVert />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow shadow" right>
                              <DropdownItem
                                onClick={() => { setEditModalShow(true); setEditGrade(all); }}
                                className="d-flex align-items-center"
                              >
                                <MdEdit className="mr-2 text-primary" />
                                Modifier
                              </DropdownItem>
                              <Dropdown.Divider />
                              <DropdownItem
                                onClick={() => handleDeleteAnnualLeaveLine(all?.employee?.idE, all?.annualLeave?.annualLeaveId)}
                                className="d-flex align-items-center text-danger"
                              >
                                <MdDelete className="mr-2" />
                                Supprimer
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>

              <CardFooter className=" border-0" style={{ borderRadius: '0 0 12px 12px' }}>
                <nav aria-label="pagination">
                  <Pagination className="justify-content-center mb-0">
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) paginate(currentPage - 1); }}
                        className="border-0"
                      >
                        <i className="fas fa-chevron-left" />
                      </PaginationLink>
                    </PaginationItem>
                    
                    {Array.from({ length: Math.ceil(annualLeaveLines.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} active={currentPage === i + 1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                          className="border-0"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem disabled={currentPage === Math.ceil(annualLeaveLines.length / itemsPerPage)}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); if (currentPage < Math.ceil(annualLeaveLines.length / itemsPerPage)) paginate(currentPage + 1); }}
                        className="border-0"
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

        {/* Modales */}
        <AddModal 
          idan={idan} 
          show={modalShow} 
          onHide={() => setModalShow(false)}
        />
        
        <EditModal 
          show={editModalShow}
          grade={editGrade} 
          onHide={() => setEditModalShow(false)}
        />
        
        <UpdateAnnualLeaveModal
          show={editModalShow}
          onHide={() => setEditModalShow(false)}
          annualLeaveData={annualLeave}
          onUpdate={handleUpdate}
        />
      </Container>
    </>
  );
};

export default AnnualLeaveDetial;