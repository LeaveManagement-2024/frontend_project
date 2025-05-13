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
import AddServiceModal from './addServiceModal';
import EditServiceModal from './editServiceModal';
import Header from "components/Headers/Header.js";
import {
  getAllServices,
  getServiceById,
  deleteService,
} from './serviceApi'; 

const Services = () => {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editService, setEditService] = useState([]);

  useEffect(() => {
    fetchAllServices();
  }, [service]);

  const fetchAllServices = async () => {
    try {
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des services :', error);
    }
  };

  const handleGetServiceById = async (idService) => {
    try {
      const data = await getServiceById(idService);
      setService(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du service :', error);
    }
  };

  const handleDeleteService = async (idService) => {
    try {
      await deleteService(idService);
      setMessage('Le service a été supprimé avec succès');
      fetchAllServices(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de la suppression du service :', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
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
                    Ajouter un service
                  </Button>
                  <AddServiceModal show={modalShow} onHide={() => setModalShow(false)}></AddServiceModal>
                  <h3 className="mb-0">Tableau des services</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col">Nom du service (arabe)</th>
                    <th scope="col">Responsable du service</th>
                    <th scope="col">Nom du service (français)</th>
                    <th scope="col">Département</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((service) => (
                    <tr key={service.idService}>
                      <td>{service.serviceNameAr}</td>
                      <td>
                        <Media className="align-items-center">
                          <img
                            className="avatar avatar-sm rounded-circle mr-0"
                            alt="..."
                            src={service?.respService?.image}
                          />
                          <Media>
                            <span className="mb-0 text-sm" style={{ marginRight: '15px' }}>
                              {service?.respService?.firstNameAr} {service?.respService?.lastNameAr}
                            </span>
                          </Media>
                        </Media>
                      </td>
                      <td>{service.serviceNameFr}</td>
                      <td>{service?.departement?.departementNameAr}</td>
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
                              onClick={() => handleGetServiceById(service.idService)}
                            >
                              Voir
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => { setEditModalShow(true); setEditService(service); }}
                            >
                              Modifier
                            </DropdownItem>
                            <EditServiceModal 
                              show={editModalShow}
                              serv={editService} 
                              onHide={() => setEditModalShow(false)}
                            />
                            <DropdownItem
                              onClick={() => handleDeleteService(service.idService)}
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
                        <span className="sr-only">Précédent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(services.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(services.length / itemsPerPage) ? 'disabled' : ''}>
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

export default Services;