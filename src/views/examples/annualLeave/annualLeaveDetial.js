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
} from "reactstrap";
import { useNavigate } from 'react-router-dom';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { MdDelete } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { BsCalendar2XFill } from "react-icons/bs";
import { BsCalendar2CheckFill } from "react-icons/bs";
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
  const {idan}  = useParams();
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
       setMessage(' La désactivation du congé annuel a été effectuée avec succès');
       fetchAllAnnualLeave(idan);
    } catch (error) {
      console.error('Error fetching AnnualLeave:', error);
      setIsError(true);
      setMessage("'La modification du congé annuel a  été effectuée avec succès'");
      fetchAllAnnualLeave(idan);
    }
  };
  const hundelsetOnStatus = async (id) => {
    try {
       await setOnStatus(id);
       setIsError(false);
       setMessage("'  La modification du congé annuel a été effectuée avec succès '" );
       fetchAllAnnualLeave(idan);
       
  
    } catch (error) {
      console.error('Error fetching AnnualLeave:', error);
      setIsError(true);
      setMessage("'La modification du congé annuel n'a pas été effectuée avec succès  '");
      fetchAllAnnualLeave(idan);
    }
  };
  

  const handleDeleteAnnualLeaveLine = async (ide, idal) => {
    if (!ide || !idal) {
      console.error('Invalid IDs:', ide, idal);
      return;
    }
    const confirmDelete = window.confirm(  "'Êtes-vous sûr de vouloir supprimer cet élément ?'");
    if (!confirmDelete) {
      // Si l'utilisateur annule, arrêter la fonction
      return;
    }
    try {
      await deleteAnnualLeaveLine(ide, idal);
      setIsError(false);
      setMessage('Suppression réussie');
      fetchAllAnnualLeaveLine(idan); // Refresh the list
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage('   Impossible de supprimer cet élément    ');
      setIsError(true);
    }
  };
  const handleDeleteAnnualLeave = async (id) => {
    if (!id) {
      console.error('Invalid ID:', id);
      return;
    }

    // Afficher une boîte de confirmation avant la suppression
    const confirmDelete = window.confirm(  "'Êtes-vous sûr de vouloir supprimer cet élément ?'");

    if (!confirmDelete) {
      // Si l'utilisateur annule, arrêter la fonction
      return;
    }

    try {
      await deleteAnnualLeave(id);
      setMessage('  Suppression réussie');
      
      // Naviguer vers une autre page après suppression, par exemple la page d'accueil
      navigate('/admin/annualLeave');  // Changez '/annual-leaves' selon vos besoins
     
    } catch (error) {
      console.error('Error deleting:', error);
      setMessage(`  Impossible de supprimer ce congé annuel  ` );
      setIsError(true);
    }
  };
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(''); // Clear the message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Clear the timeout if the component unmounts
    }
  }, [message]); 
  const handleEditClick = () => {
    setEditModalShow(true);  // Show the edit modal
  };

  const handleUpdate = () => {
    fetchAllAnnualLeave(idan); // Refresh data after update
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = annualLeaveLines.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
           
              <CardHeader className="border-0">
                <div style={{marginBottom:"15px",marginLeft:"680px"}}>
                    {message && (
                      <p 
                        style={{ color: isError ? 'red' : 'green',fontSize:"1.1em" }}>
                        {message}
                      </p>
                    )}
                  </div>
                <div className="d-flex justify-content-between align-items-center">
                  


                <DropdownButton id="dropdown-item-button " className="top-right-button" title="Actions" style={{ direction: 'rtl' }}>
                  <Dropdown.Item as="button" style={{fontSize:"1.1em"}} onClick={handleEditClick}> Modifier les informations  <AiFillEdit /></Dropdown.Item>
                  <UpdateAnnualLeaveModal
                      show={editModalShow}
                      onHide={() => setEditModalShow(false)}
                      annualLeaveData={annualLeave} // Pass current annual leave data
                      onUpdate={handleUpdate}       // Function to refresh the data
                    />
                  <Dropdown.Item as="button" style={{fontSize:"1.1em"}} onClick={() => handleDeleteAnnualLeave(idan) }>Supprimer le congé annuel    <MdDelete /></Dropdown.Item>
                  <Dropdown.Item as="button" style={{fontSize:"1.1em"}} onClick={() => hundelsetOfStatus(idan) } >  Désactiver le congé annuel <BsCalendar2XFill /></Dropdown.Item>
                  <Dropdown.Item as="button" style={{fontSize:"1.1em"}}onClick={() => hundelsetOnStatus(idan) }>Activer le congé annuel   <BsCalendar2CheckFill /></Dropdown.Item>
                </DropdownButton>
                <h1 className="mb-0"> Congé annuel : {annualLeave.label }
                   {/* Display status next to the label */}
      <span style={{ color: annualLeave.status === 'enabled' ? 'green' : 'red', marginLeft: '10px' }}>
        {annualLeave.status === 'enabled' ? 'Activée' : ' Désactivée' }
      </span>
                </h1>

                  <Button color="primary" onClick={() => {setModalShow(true); setIdan(idan)}} >
                  Ajout des employés en congé  
                  </Button>
                  <AddModal idan={idan}  show={modalShow} onHide={() => setModalShow(false)}></AddModal>
                
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center text-lg">
                  <tr className=''>
                    <th scope="col" style={{color:'black',fontSize:'0.8em'}} >Nom de l'employé   </th>
                    <th scope="col" style={{color:'black',fontSize:'0.8em'}} > Nombre de jours d'origine    </th>
                    <th scope="col"  style={{color:'black',fontSize:'0.8em'}}>   Nombre de jours restants   </th>
                    <th scope="col"  style={{color:'black',fontSize:'0.8em'}}> Paramètres </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((all) => (
                    <tr key={all.employee.idE}>
                      <td  style={{color:'black',fontSize:'1em'}} >{all?.employee?.lastNameAr} {all?.employee?.firstNameAr}</td>

                      <td>
                        <div className="password">
                          <input  defaultValue={all.declaredDays} className="input" name="text" type="text" readOnly />
                        </div>
                        </td>
                      <td>
                      <div className="password">
                          <input  defaultValue={all.remainingDays} className="input" name="text" type="text" readOnly />
                        </div>
                        </td>
                      <td >
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
                           
                            <DropdownItem style={{fontSize:"1.1em"}}
                              onClick={() => { setEditModalShow(true); setEditGrade(all); }}
                            >
                              Modifier<AiFillEdit />
                            </DropdownItem>
                            <EditModal 
                              show={editModalShow}
                              grade={editGrade} 
                              onHide={() => setEditModalShow(false)}
                            />
                            <DropdownItem style={{fontSize:"1.1em"}}
                              onClick={() => handleDeleteAnnualLeaveLine(all?.employee?.idE,all?.annualLeave?.annualLeaveId)}
                            >
                              Supprimer<MdDelete />
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
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
                        <span className="sr-only">Precedent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(annualLeaveLines.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(annualLeaveLines.length / itemsPerPage) ? 'disabled' : ''}>
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
      </Container>
    </>
  );
};

export default AnnualLeaveDetial;
