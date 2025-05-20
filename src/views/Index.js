import { Calendar, momentLocalizer } from 'react-big-calendar';
import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Header from "components/Headers/Header.js";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// Configurer moment pour le français
moment.updateLocale('fr', {
  months: [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ],
  monthsShort: [
    "Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin",
    "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."
  ],
  weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  weekdaysShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  weekdaysMin: ["D", "L", "M", "M", "J", "V", "S"],
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY LT',
    LLLL: 'dddd D MMMM YYYY LT'
  },
  meridiemParse: /AM|PM/,
  isPM: function (input) {
    return input === 'PM';
  },
  meridiem: function (hour, minute, isLower) {
    return hour < 12 ? 'AM' : 'PM';
  },
});

const localizer = momentLocalizer(moment);

const Index = (props) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8093/leave/getAll");
        const leaveData = response.data.map(leave => ({
          title: `Congé pour ${leave.employee.firstName} ${leave.employee.lastName}`,
          start: new Date(leave.startDate),
          end: new Date(leave.endDate)
        }));
        setEvents(leaveData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de congé :", error);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
            
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ 
                  height: '80vh', 
                  padding: '20px', 
                  backgroundColor: '#f8f9fe', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                }}
                messages={{
                  next: "Suivant",
                  previous: "Précédent",
                  today: "Aujourd'hui",
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour",
                  agenda: "Agenda",
                }}
            />
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Index;