"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { HiLogin } from "react-icons/hi"
import "./modern-login-styles.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const dfsd = async (e) => {
    e.preventDefault()
    setError("") // Effacer les erreurs précédentes

    try {
      const response = await axios.post("http://localhost:8093/employee/login", { email, password })

      if (response.data.success) {
        // Rediriger vers le tableau de bord en cas de connexion réussie
        navigate("/index")
      } else {
        // Afficher un message d'erreur en cas d'échec de connexion
      }
    } catch (err) {
      setError("Une erreur s'est produite lors de la connexion. Veuillez réessayer.")
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await axios
        .post("http://localhost:8093/employee/login", {
          email: email,
          password: password,
        })
        .then(
          (res) => {
            console.log(res.data)

            if (res.data.message === "Email Not Exist") {
              setError("L'email n'existe pas")
            } else if (res.data.message === "login Success") {
              localStorage.setItem("userId", res.data.id) // Stocker l'ID de l'utilisateur
              navigate("/admin/index")
            } else {
              setError("Email ou mot de passe incorrect")
            }
          },
          (fail) => {
            console.error(fail) // Erreur !
            setError("Erreur de connexion. Veuillez réessayer.")
          },
        )
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modern-login-container">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-column">
        <Card className="modern-login-card">
          <CardHeader className="modern-login-header">
            <div className="header-content">
              <div className="login-icon">
                <div className="icon-circle">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>
              <div className="header-text">
                <h2 className="login-title">Bienvenue</h2>
                <p className="login-subtitle">Connectez-vous à votre espace</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="modern-login-body">
            <Form role="form" onSubmit={handleSubmit} className="modern-login-form">
              <FormGroup className="modern-form-group">
                <label className="modern-label">
                  <span className="label-text">Adresse e-mail</span>
                  <span className="required-indicator">*</span>
                </label>
                <InputGroup className="modern-input-group">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="modern-input-addon">
                      <i className="fas fa-envelope" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="modern-input"
                    placeholder="Entrez votre email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup className="modern-form-group">
                <label className="modern-label">
                  <span className="label-text">Mot de passe</span>
                  <span className="required-indicator">*</span>
                </label>
                <InputGroup className="modern-input-group">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="modern-input-addon">
                      <i className="fas fa-lock" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    className="modern-input"
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </FormGroup>

              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>{error}</span>
                </div>
              )}

              <div className="login-actions">
                <Button className="modern-login-button" type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="button-spinner"></div>
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <HiLogin className="button-icon" />
                      <span>Se connecter</span>
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>

        <Row className="login-footer">
          <Col xs="6">
            <a className="footer-link" href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="fas fa-key"></i>
              <span>Mot de passe oublié ?</span>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a className="footer-link" href="#pablo" onClick={(e) => e.preventDefault()}>
              <i className="fas fa-user-plus"></i>
              <span>Créer un compte</span>
            </a>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Login
