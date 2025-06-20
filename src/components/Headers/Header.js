"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, Container, Row, Col } from "reactstrap"
import {
  getNewLeaveRequests,
  getTotalEmployees,
  getUnconfirmedLeaves,
  getNumberOfEmployeesOnLeaveToday,
  getNumberOfEmployeesOnLeaveTomorrow,
  getCountNewEmployees,
  getCountOldEmployees,
  numberLeaveEndYesterday,
} from "../../services/statisticsApi"
import "./modern-header-styles.css"

const Header = () => {
  const [newLeaveRequests, setNewLeaveRequests] = useState(0)
  const [totalEmployees, setTotalEmployees] = useState(0)
  const [unconfirmedLeaves, setUnconfirmedLeaves] = useState(0)
  const [employeesOnLeaveToday, setEmployeesOnLeaveToday] = useState(0)
  const [employeesOnLeaveTomorrow, setEmployeesOnLeaveTomorrow] = useState(0)
  const [countNewEmployees, setCountNewEmployees] = useState(0)
  const [countOldEmployees, setCountOldEmployees] = useState(0)
  const [leaveEndYesterday, setLeaveEndYesterday] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newLeave = await getNewLeaveRequests()
        const totalEmp = await getTotalEmployees()
        const unconfirmed = await getUnconfirmedLeaves()
        const leaveToday = await getNumberOfEmployeesOnLeaveToday()
        const leaveTomorrow = await getNumberOfEmployeesOnLeaveTomorrow()
        const newEmp = await getCountNewEmployees()
        const oldEmp = await getCountOldEmployees()
        const endYesterday = await numberLeaveEndYesterday()
        setNewLeaveRequests(newLeave)
        setTotalEmployees(totalEmp)
        setUnconfirmedLeaves(unconfirmed)
        setEmployeesOnLeaveToday(leaveToday)
        setCountNewEmployees(newEmp)
        setCountOldEmployees(oldEmp)
        setEmployeesOnLeaveTomorrow(leaveTomorrow)
        setLeaveEndYesterday(endYesterday)
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques :", error)
      }
    }

    fetchData()
  }, [])

  const cards = [
    {
      label: "Employés en congé",
      value: employeesOnLeaveToday,
      icon: "🏖️",
      gradient: "from-red-500 to-pink-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      trend: "+2.5%",
      description: "Aujourd'hui",
    },
    {
      label: "Congés en attente",
      value: unconfirmedLeaves,
      icon: "⏳",
      gradient: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      trend: "+12%",
      description: "À valider",
    },
    {
      label: "Congés pour demain",
      value: employeesOnLeaveTomorrow,
      icon: "📅",
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      trend: "-5%",
      description: "Planifiés",
    },
    {
      label: "Employés présents",
      value: leaveEndYesterday,
      icon: "👥",
      gradient: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      trend: "+8%",
      description: "Aujourd'hui",
    },
  ]

  return (
    <div className="modern-header-container">
      <Container fluid>
        <div className="modern-header-body">
          {/* Titre principal */}
          <div className="header-title-section">
            <div className="title-content">
              <h1 className="main-title">Tableau de Bord</h1>
              <p className="main-subtitle">Vue d'ensemble des statistiques en temps réel</p>
            </div>
          </div>

          {/* Cartes de statistiques */}
          <Row className="stats-row">
            {cards.map((card, index) => (
              <Col lg="6" xl="3" key={index} className="mb-4">
                <Card
                  className="modern-stats-card"
                  onClick={() => console.log(`Clic sur ${card.label}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardBody className="modern-card-body">
                    <div className="card-content">
                      <div className="stats-header">
                        <div className={`stats-icon ${card.bgColor}`}>
                          <span className="icon-emoji">{card.icon}</span>
                        </div>
                        <div className="trend-indicator">
                          <span className={`trend-value ${card.textColor}`}>{card.trend}</span>
                        </div>
                      </div>

                      <div className="stats-body">
                        <div className="stats-value">
                          <span className="value-number">{card.value}</span>
                          <span className="value-label">{card.label}</span>
                        </div>
                        <div className="stats-description">
                          <span className="description-text">{card.description}</span>
                          <span className="action-hint">Cliquez pour détails</span>
                        </div>
                      </div>

                      <div className={`stats-gradient bg-gradient-to-r ${card.gradient}`}></div>
                    </div>

                    {/* Effet de brillance au hover */}
                    <div className="card-shine"></div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Section d'informations supplémentaires */}
          <div className="additional-info">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-icon">📊</div>
                <div className="info-content">
                  <span className="info-label">Total Employés</span>
                  <span className="info-value">{totalEmployees}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">📝</div>
                <div className="info-content">
                  <span className="info-label">Nouvelles Demandes</span>
                  <span className="info-value">{newLeaveRequests}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">👤</div>
                <div className="info-content">
                  <span className="info-label">Nouveaux Employés</span>
                  <span className="info-value">{countNewEmployees}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon">🏢</div>
                <div className="info-content">
                  <span className="info-label">Employés Anciens</span>
                  <span className="info-value">{countOldEmployees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Header
