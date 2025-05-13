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
import AddProfileModal from './addProfileModal';
import EditProfileModal from './editProfileModal';
import Header from "components/Headers/Header.js";
import {
  getAllProfiles,
  getProfileById,
  deleteProfile,
} from './profileApi'; 

const Profiles = () => {
  const [profils, setProfils] = useState([]);
  const [profil, setProfil] = useState({});
  const [pageActuelle, setPageActuelle] = useState(1);
  const elementsParPage = 10;
  const [message, setMessage] = useState('');
  const [modalAjoutVisible, setModalAjoutVisible] = useState(false);
  const [modalEditionVisible, setModalEditionVisible] = useState(false);
  const [profilAEditer, setProfilAEditer] = useState([])

  useEffect(() => {
    recupererTousLesProfils();
  }, [profil]);

  const recupererTousLesProfils = async () => {
    try {
      const data = await getAllProfiles();
      setProfils(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des profils :', error);
    }
  };

  const recupererProfilParId = async (idProfil) => {
    try {
      const data = await getProfileById(idProfil);
      setProfil(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil :', error);
    }
  };

  const supprimerProfil = async (idProfil) => {
    try {
      await deleteProfile(idProfil);
      setMessage('Le profil a été supprimé avec succès.');
      recupererTousLesProfils(); // Actualiser la liste
    } catch (error) {
      console.error('Erreur lors de la suppression du profil :', error);
    }
  };

  const indexDernierElement = pageActuelle * elementsParPage;
  const indexPremierElement = indexDernierElement - elementsParPage;
  const elementsCourants = profils.slice(indexPremierElement, indexDernierElement);
  const paginer = (numeroPage) => setPageActuelle(numeroPage);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid style={{ direction: 'rtl' }}>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <Button color="primary" onClick={() => setModalAjoutVisible(true)}>
                    Ajouter un profil
                  </Button>
                  <AddProfileModal show={modalAjoutVisible} onHide={() => setModalAjoutVisible(false)} />
                  <h3 className="mb-0">Table des profils</h3>
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col" className='text-lg'>Nom du profil</th>
                    <th scope="col" className='text-lg'>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {elementsCourants.map((profil) => (
                    <tr key={profil.idProfile}>
                      <td>{profil.profileName}</td>
                      <td>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            href="#"
                            role="button"
                            size="md"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem onClick={() => recupererProfilParId(profil.idProfile)}>
                              Voir
                            </DropdownItem>
                            <DropdownItem onClick={() => { setModalEditionVisible(true); setProfilAEditer(profil); }}>
                              Modifier
                            </DropdownItem>
                            <EditProfileModal 
                              show={modalEditionVisible}
                              profile={profilAEditer} 
                              onHide={() => setModalEditionVisible(false)}
                            />
                            <DropdownItem onClick={() => supprimerProfil(profil.idProfile)}>
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
                  <Pagination className="pagination justify-content-start mb-0" listClassName="justify-content-end mb-0">
                    <PaginationItem className={pageActuelle === 1 ? 'disabled' : ''}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); paginer(pageActuelle - 1); }}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Précédent</span>
                      </PaginationLink>
                    </PaginationItem>
                    {Array.from({ length: Math.ceil(profils.length / elementsParPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={pageActuelle === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => { e.preventDefault(); paginer(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={pageActuelle === Math.ceil(profils.length / elementsParPage) ? 'disabled' : ''}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); paginer(pageActuelle + 1); }}
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

export default Profiles;
