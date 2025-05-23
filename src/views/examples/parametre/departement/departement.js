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
  UncontrolledTooltip,

} from "reactstrap";
import AddDepartmentModal from './addDepartementModal';
import EditDepartmentModal from './editDepartementModal';
import Header from "components/Headers/Header.js";
import {
  getAllDepartments,
  getDepartmentById,
  deleteDepartment,
} from './departementApi'; 

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editDept, setEditDept] = useState([])

  useEffect(() => {
    fetchAllDepartments();
  }, [department]);

  const fetchAllDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleGetDepartmentById = async (idD) => {
    try {
      const data = await getDepartmentById(idD);
      setDepartment(data);
    } catch (error) {
      console.error('Error fetching department:', error);
    }
  };

  const handleDeleteDepartment = async (idD) => {
    try {
      await deleteDepartment(idD);
      setMessage('Department deleted successfully');
      fetchAllDepartments(); // Refresh the list
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid >
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0"> Tableau de Departement</h3>
                  <Button color="primary" onClick={() => setModalShow(true)}>
                    Ajouter Departement 
                  </Button>
                  <AddDepartmentModal show={modalShow} onHide={() => setModalShow(false)}></AddDepartmentModal>
                  
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col"> Nom de Departement</th>
                    <th scope="col"> Responsable de departement </th>
                    <th scope="col "> plus de Parametre</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((dept) => (
                    <tr key={dept.idDepartement}>
                      <td>{dept.departementName}</td>
                      <td >

                      <Media className="align-items-center">
                        
                            <img    className="avatar avatar-sm rounded-circle" 
                              alt="..."
                              src={dept?.respDepartement?.image ||"https://fakeimg.pl/600x400?text=employe" }
                            />
                         
                          <Media>
                            <span className="mb-0 text-sm" style={{marginRight:'15px'}}>
                              {dept.respDepartement?.firstName} {dept.respDepartement?.lastName}
                            </span>
                          </Media>
                        </Media>
                        
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
                            <DropdownItem
                              onClick={() => handleGetDepartmentById(dept.idDepartement)}
                            >
                              afficher
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => { setEditModalShow(true); setEditDept(dept); }}
                            >
                              Modifier
                            </DropdownItem>
                            <EditDepartmentModal 
                              show={editModalShow}
                              dep={editDept} 
                              onHide={() => setEditModalShow(false)}
                            />
                            
                            <DropdownItem
                              onClick={() => handleDeleteDepartment(dept.idDepartement )}
                            >
                              Supprimer
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
                        <span className="sr-only">السابق</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(departments.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(departments.length / itemsPerPage) ? 'disabled' : ''}>
                      <PaginationLink
                        href="#pablo"
                        onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">التالي</span>
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

export default Departments;

