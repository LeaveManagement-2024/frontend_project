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
import AddFiliereModal from './addFiliereModal';
import EditFiliereModal from './editFiliereModal';
import Header from "components/Headers/Header.js";
import {
  getAllFilieres,
  getFiliereById,
  deleteFiliere,
} from './filiereApi'; 

const Filieres = () => {
  const [filieres, setFilieres] = useState([]);
  const [filiere, setFiliere] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editFiliere, setEditFiliere] = useState([])

  useEffect(() => {
    fetchAllFilieres();
  }, [filiere]);

  const fetchAllFilieres = async () => {
    try {
      const data = await getAllFilieres();
      setFilieres(data);
    } catch (error) {
      console.error('Error fetching filières:', error);
    }
  };

  const handleGetFiliereById = async (idFiliere) => {
    try {
      const data = await getFiliereById(idFiliere);
      setFiliere(data);
    } catch (error) {
      console.error('Error fetching filière:', error);
    }
  };

  const handleDeleteFiliere = async (idFiliere) => {
    try {
      await deleteFiliere(idFiliere);
      setMessage('تم حذف التخصص بنجاح');
      fetchAllFilieres(); // Refresh the list
    } catch (error) {
      console.error('Error deleting filière:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filieres.slice(indexOfFirstItem, indexOfLastItem);
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
                    إضافة شعبة
                  </Button>
                  <AddFiliereModal show={modalShow} onHide={() => setModalShow(false)}></AddFiliereModal>
                  <h3 className="mb-0">جدول الشعب</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col"> اسم الشعبة</th>
                    <th scope="col">Nom de filiere </th>
                    <th scope="col">المصلحة</th>
                    <th scope="col">القسم </th>
                    <th scope="col">الإعدادات</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((filiere) => (
                    <tr key={filiere.idService}>
                      <td>{filiere.filiereNameAr}</td>
                      <td>{filiere.filiereNameFr}</td>
                      <td>{filiere?.service?.serviceNameAr}</td>
                      <td>{filiere?.service?.departement?.departementNameAr}</td>
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
                              onClick={() => handleGetFiliereById(filiere.idFiliere)}
                            >
                              عرض
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => { setEditModalShow(true); setEditFiliere(filiere); }}
                            >
                              تعديل
                            </DropdownItem>
                            <EditFiliereModal 
                              show={editModalShow}
                              fil={editFiliere} 
                              onHide={() => setEditModalShow(false)}
                            />
                            <DropdownItem
                              onClick={() => handleDeleteFiliere(filiere.idFiliere)}
                            >
                              حذف
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
                    {Array.from({ length: Math.ceil(filieres.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(filieres.length / itemsPerPage) ? 'disabled' : ''}>
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

export default Filieres;
