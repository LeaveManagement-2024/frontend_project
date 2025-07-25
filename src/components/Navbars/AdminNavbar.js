/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { Link } from "react-router-dom";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  loginEmployee,
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getManagerByIdEmp,
  getResponsibleByIdEmp
} from '../../views/examples/Employess/employeeApi'

const AdminNavbar = (props) => {
  const userId = localStorage.getItem('userId');

  const [employee, setEmployee] = useState({});

  useEffect(() => {
    fetchEmployee();
  }, []);
  
  const fetchEmployee = async () => {
    try {
      const data = await getEmployeeById(userId);
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee:', error);
    }
  };


  return (
    <>
      <Navbar className="navbar-top navbar-dark  " expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="h4 mb-0 text-white d-none d-lg-inline-block"
            to="/admin/index"
          >
          
          </Link>
          
          <Nav className="align-items-end d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0" nav>
                <Media className="align-items-center"> 
                    <span className="mb-0 " style={{marginRight:"10px"}}>
                        {employee.lastName}  {employee.firstName}
                    </span>
                    <img className="avatar avatar-md rounded-circle"  style={{height:'47px'}}
                      alt="..."
                      src={employee.image || 'https://www.w3schools.com/howto/img_avatar.png'}
                    />
                 
                  
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">Welcome!...................</h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02" />
                  <span>My profile</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-settings-gear-65" />
                  <span>Settings</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-calendar-grid-58" />
                  <span>Activity</span>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem href="#pablo" onClick={(e) => e.preventDefault()}>
                  <i className="ni ni-user-run" />
                  <span>Logout</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
