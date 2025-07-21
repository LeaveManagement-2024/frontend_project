import { useState, useEffect } from "react"
import { Badge, Card, CardHeader, Button, Container, Row } from "reactstrap"
// Composants principaux
import Header from "components/Headers/Header.js"
import { Link } from "react-router-dom"
import { getAllAnnualLeave } from "./annualLeaveAPI"
import AddAnnualLeaveModal from "./addAnnualLeave"
import "./modern-annual-leave-styles.css"

const AnnualLeave = () => {
  const [annualLeaves, setAnnualLeaves] = useState([])
  const [modalShow, setModalShow] = useState(false)

  useEffect(() => {
    fetchAllAnnualLeaves()
  }, [])

  const fetchAllAnnualLeaves = async () => {
    try {
      const data = await getAllAnnualLeave()
      setAnnualLeaves(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des congés annuels :", error)
    }
  }

  const handleCloseModal = () => {
    console.log("Fermeture du modal")
    setModalShow(false)
  }

  return (
    <>
      <Header />
      <div className="modern-annual-leave-container">
        <Container className="mt-2" fluid>
          <Row>
            <div className="col">
              <Card className="modern-annual-leave-card">
                <CardHeader className="modern-annual-leave-header">
                  <div className="header-content">
                    <div className="header-left">
                      <div className="header-icon">📅</div>
                      <div className="header-text">
                        <h3 className="header-title">Congés Annuels</h3>
                        <p className="header-subtitle">Gérez les périodes de congés annuels</p>
                      </div>
                    </div>
                    
                  </div>
                  <div className="header-actions">
                      <div className="stats-summary">
                        <div className="stat-item">
                          <span className="stat-number">{annualLeaves.length}</span>
                          <span className="stat-label">Périodes</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-number">
                            {annualLeaves.filter((anl) => anl.status === "enabled").length}
                          </span>
                          <span className="stat-label">Actives</span>
                        </div>
                      </div>
                      
                    </div>
                      <Button className="modern-add-button text-right" onClick={() => setModalShow(true)}>
                        <i className="fas fa-plus"></i>
                        Ajouter un congé annuel
                      </Button>
                </CardHeader>

                <div className="modern-cards-container">
                  <div className="annual-leave-grid">
                    {annualLeaves.map((anl, index) => (
                      <Link
                        to={`/admin/annualLeaveDetial/${anl.annualLeaveId}`}
                        key={anl.annualLeaveId}
                        className="card-link"
                      >
                        <div className="modern-annual-card" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="card-header-section">
                            <div className="card-icon">
                              <i className="fas fa-calendar-alt"></i>
                            </div>
                            <div className="status-badge">
                              <Badge
                                className={`modern-status-badge ${anl.status === "enabled" ? "active" : "inactive"}`}
                              >
                                {anl.status === "enabled" ? (
                                  <>
                                    <i className="fas fa-check-circle"></i>
                                    Activé
                                  </>
                                ) : (
                                  <>
                                    <i className="fas fa-pause-circle"></i>
                                    Désactivé
                                  </>
                                )}
                              </Badge>
                            </div>
                          </div>

                          <div className="card-content">
                            <h4 className="card-title">Congé annuel {anl.label}</h4>

                            <div className="date-info">
                              <div className="date-item">
                                <div className="date-icon">
                                  <i className="fas fa-play"></i>
                                </div>
                                <div className="date-details">
                                  <span className="date-label">Début</span>
                                  <span className="date-value">{anl.startDate}</span>
                                </div>
                              </div>

                              <div className="date-separator">
                                <div className="separator-line"></div>
                                <div className="separator-dot"></div>
                              </div>

                              <div className="date-item">
                                <div className="date-icon">
                                  <i className="fas fa-stop"></i>
                                </div>
                                <div className="date-details">
                                  <span className="date-label">Fin</span>
                                  <span className="date-value">{anl.endDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card-footer-section">
                            <div className="action-hint">
                              <span>Cliquez pour voir les détails</span>
                            </div>
                            <div className="card-arrow">
                              <i className="fas fa-arrow-right"></i>
                            </div>
                          </div>

                          <div className="card-shine"></div>
                        </div>
                      </Link>
                    ))}

                    {/* Carte d'ajout rapide */}
                    <div className="modern-annual-card add-card" onClick={() => setModalShow(true)}>
                      <div className="add-card-content">
                        <div className="add-icon">
                          <i className="fas fa-plus"></i>
                        </div>
                        <h4 className="add-title">Ajouter une période</h4>
                        <p className="add-subtitle">Créer un nouveau congé annuel</p>
                      </div>
                      <div className="add-card-bg"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Row>
        </Container>

        <AddAnnualLeaveModal show={modalShow} onHide={handleCloseModal} />
      </div>
    </>
  )
}

export default AnnualLeave
