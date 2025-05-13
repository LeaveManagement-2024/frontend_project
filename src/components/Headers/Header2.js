// src/components/Header.js
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
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
import "../../views/examples/style.css"

const Header2 = () => {
  const [newLeaveRequests, setNewLeaveRequests] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [unconfirmedLeaves, setUnconfirmedLeaves] = useState(0);
  const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState(0);
  const [employeesOnLeaveTomorrow, setEmployeesOnLeaveTomorrow] = useState(0);
  const [countNewEmployees, setCountNewEmployees] = useState(0);
  const [countOldEmployees, setCountOldEmployees] = useState(0);
  const [LeaveEndYesterday, setLeaveEndYesterday] = useState(0);


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
        const EndYesterday = await numberLeaveEndYesterday();
        setNewLeaveRequests(newLeave);
        setTotalEmployees(totalEmp);
        setUnconfirmedLeaves(unconfirmed);
        setEmployeesOnLeaveToday(leaveToday);
        setCountNewEmployees(newEmp);
        setCountOldEmployees(oldEmp);
        setEmployeesOnLeaveTomorrow(leaveTomorrow);
        setLeaveEndYesterday(EndYesterday);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="header bg-gradient-success pb-8 pt-5 pt-md-8">
      <Container fluid style={{ direction: 'rtl' }}>
        <div className="header-body">
         
        </div>
      </Container>
    </div>
  );
};

export default Header2;
