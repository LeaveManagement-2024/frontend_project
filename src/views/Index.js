"use client"

import { Calendar, momentLocalizer } from "react-big-calendar"
import { useState, useEffect } from "react"
import axios from "axios"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "./calendar-styles.css"
import Header from "components/Headers/Header.js"
import { Card, CardHeader, CardBody, Container, Row } from "reactstrap"

// Configurer moment pour le français
moment.updateLocale("fr", {
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  monthsShort: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."],
  weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
  weekdaysShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  weekdaysMin: ["D", "L", "M", "M", "J", "V", "S"],
  longDateFormat: {
    LT: "HH:mm",
    LTS: "HH:mm:ss",
    L: "DD/MM/YYYY",
    LL: "D MMMM YYYY",
    LLL: "D MMMM YYYY LT",
    LLLL: "dddd D MMMM YYYY LT",
  },
  meridiemParse: /AM|PM/,
  isPM: (input) => input === "PM",
  meridiem: (hour, minute, isLower) => (hour < 12 ? "AM" : "PM"),
})

const localizer = momentLocalizer(moment)

const Index = (props) => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const response = await axios.get("http://localhost:8093/leave/getAll")
        const leaveData = response.data.map((leave) => ({
          title: `Congé pour ${leave.employee.firstName} ${leave.employee.lastName}`,
          start: new Date(leave.startDate),
          end: new Date(leave.endDate),
        }))
        setEvents(leaveData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données de congé :", error)
      }
    }

    fetchLeaves()
  }, [])

  return (
    <>
      <Header />
      <div className="modern-calendar-container">
        <Container className="mt-2" fluid>
          <Row>
            <div className="col">
              <Card className="modern-calendar-card">
                <CardHeader className="modern-card-header">
                  <div className="header-content">
                    <div className="header-icon">📅</div>
                    <div className="header-text">
                      <h2>Calendrier des Congés</h2>
                      <p>Visualisez tous les congés planifiés</p>
                    </div>
                  </div>
                </CardHeader>

                
                  
                    <Calendar
                      localizer={localizer}
                      events={events}
                      startAccessor="start"
                      endAccessor="end"
                      style={{
                        height: "75vh",
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
      </div>
    </>
  )
}

export default Index
