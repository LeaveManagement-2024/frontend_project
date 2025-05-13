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
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Grades from "views/examples/parametre/grades/grades";
import Postes from "views/examples/parametre/posts/posts";
import Departments from "views/examples/parametre/departement/departement";
import Filieres from "views/examples/parametre/filiere/filiere";
import Services from "views/examples/parametre/service/service";
import PublicHoliday from "views/examples/parametre/public_holiday/public_holliday";
import Profiles from "views/examples/parametre/profiles/profiles";
import Index from "views/Index";
import routes from "routes.js";
import LeaveTypes from "views/examples/parametre/leave_type/leave_type"
import AnnualLeaveDetial from "views/examples/annualLeave/annualLeaveDetial"
const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
           <Route path="/grades" element={<Grades />} />
           <Route path="/posts" element={<Postes />} />
           <Route path="/departments" element={<Departments />} />
           <Route path="/filieres" element={<Filieres />} />
           <Route path="/services" element={<Services />} />
           <Route path="/public-holiday" element={<PublicHoliday />} />
           <Route path="/profiles" element={<Profiles />} />
           <Route path="/leaveType" element={<LeaveTypes />} />
           <Route path="/annualLeaveDetial/:idan" element={<AnnualLeaveDetial/>} />
           <Route path="/index" element={<Index />} />
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
