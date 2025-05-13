// src/components/Header.js
import { useEffect, useState } from "react";
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import {
  getNewLeaveRequests,
  getTotalEmployees,
  getUnconfirmedLeaves,
  getNumberOfEmployeesOnLeaveToday,
  getNumberOfEmployeesOnLeaveTomorrow,
  getCountNewEmployees,
  getCountOldEmployees,
  numberLeaveEndYesterday,
} from "../../services/statisticsApi";
import "../../views/examples/style.css";

const Header = () => {
  const [newLeaveRequests, setNewLeaveRequests] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [unconfirmedLeaves, setUnconfirmedLeaves] = useState(0);
  const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState(0);
  const [employeesOnLeaveTomorrow, setEmployeesOnLeaveTomorrow] = useState(0);
  const [countNewEmployees, setCountNewEmployees] = useState(0);
  const [countOldEmployees, setCountOldEmployees] = useState(0);
  const [leaveEndYesterday, setLeaveEndYesterday] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newLeave = await getNewLeaveRequests();
        const totalEmp = await getTotalEmployees();
        const unconfirmed = await getUnconfirmedLeaves();
        const leaveToday = await getNumberOfEmployeesOnLeaveToday();
        const leaveTomorrow = await getNumberOfEmployeesOnLeaveTomorrow();
        const newEmp = await getCountNewEmployees();
        const oldEmp = await getCountOldEmployees();
        const endYesterday = await numberLeaveEndYesterday();
        setNewLeaveRequests(newLeave);
        setTotalEmployees(totalEmp);
        setUnconfirmedLeaves(unconfirmed);
        setEmployeesOnLeaveToday(leaveToday);
        setCountNewEmployees(newEmp);
        setCountOldEmployees(oldEmp);
        setEmployeesOnLeaveTomorrow(leaveTomorrow);
        setLeaveEndYesterday(endYesterday);
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: "Employés en congé",
      value: employeesOnLeaveToday,
      icon: "ni ni-calendar-grid-58",
      color: "bg-danger",
    },
    {
      label: "Congés en attente",
      value: unconfirmedLeaves,
      icon: "fas fa-chart-pie",
      color: "bg-warning",
    },
    {
      label: "Congés pour demain",
      value: employeesOnLeaveTomorrow,
      icon: "fas fa-users",
      color: "bg-yellow",
    },
    {
      label: "Employés présents aujourd’hui",
      value: leaveEndYesterday,
      icon: "fas fa-percent",
      color: "bg-info",
    },
  ];

  return (
    <div className="header bg-gradient-success pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            {cards.map((card, index) => (
              <Col lg="6" xl="3" key={index} className="mb-4">
                <Card className="card-blurHeader card-custom"
                onClick={() => console.log(`Clic sur ${card.label}`)} >

                  <CardBody className="d-flex justify-content-between align-items-center">
                    <div className="text-left">
                      <h5 className="text-uppercase text-lg mb-1">{card.label} : {card.value}</h5>
                      <p className="text-muted text-sm mb-0">Cliquez pour voir plus</p>
                    </div>
                    <div className={`icon icon-shape text-white rounded-circle shadow ${card.color}`}>
                      <i className={card.icon} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
