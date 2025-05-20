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
import AddPostModal from './addPostModal';
import EditPostModal from './editPostModal';
import Header from "components/Headers/Header.js";
import {
  getAllPosts,
  getPostById,
  deletePost,
} from './postApi'; 

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [message, setMessage] = useState('');
  const [modalShow, setModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [editPost, setEditPost] = useState([])

  useEffect(() => {
    fetchAllPosts();
  }, [post]);

  const fetchAllPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleGetPostById = async (idP) => {
    try {
      const data = await getPostById(idP);
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleDeletePost = async (idP) => {
    try {
      await deletePost(idP);
      setMessage('Post deleted successfully');
      fetchAllPosts(); // Refresh the list
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header />
      <Container className="mt--7" >
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <div className="d-flex justify-content-between align-items-center">
                   <h3 className="mb-0"> Tableau de Poste</h3>
                  <Button color="primary" onClick={() => setModalShow(true)}>
                     Ajouter un Poste 
                  </Button>
                  <AddPostModal show={modalShow} onHide={() => setModalShow(false)}></AddPostModal>
                 
                </div>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light text-center">
                  <tr>
                    <th scope="col" className=''> Nom du post</th>
                    <th scope="col" className='' > Parametre </th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {currentItems.map((post) => (
                    <tr key={post.idPost}>
                      
                      <td>{post.postName}</td>
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
                              onClick={() => handleGetPostById(post.idPost)}
                            >
                              afficher
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => { setEditModalShow(true); setEditPost(post); }}
                            >
                              Modifier
                            </DropdownItem>
                            <EditPostModal 
                              show={editModalShow}
                              post={editPost} 
                              onHide={() => setEditModalShow(false)}
                            />
                            <DropdownItem
                              onClick={() => handleDeletePost(post.idPost)}
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
                    {Array.from({ length: Math.ceil(posts.length / itemsPerPage) }, (_, i) => (
                      <PaginationItem key={i + 1} className={currentPage === i + 1 ? 'active' : ''}>
                        <PaginationLink
                          href="#pablo"
                          onClick={(e) => { e.preventDefault(); paginate(i + 1); }}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem className={currentPage === Math.ceil(posts.length / itemsPerPage) ? 'disabled' : ''}>
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

export default Posts;
