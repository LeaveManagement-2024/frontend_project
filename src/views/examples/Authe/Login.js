"use client"

import { useState, useEffect } from "react"
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
  Alert,
} from "reactstrap"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { HiLogin } from "react-icons/hi"
import "./modern-login-styles.css"
import { ROLES, getUserRole } from "../../../routes"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Rediriger si déjà connecté
  useEffect(() => {
    const userRole = getUserRole()
    if (userRole && Object.values(ROLES).includes(userRole)) {
      const from = location.state?.from?.pathname || "/admin/index"
      navigate(from, { replace: true })
    }
  }, [navigate, location])

  // Fonction pour normaliser le rôle reçu de l'API
  const normalizeRole = (profileName) => {
    if (!profileName) return null
    
    const roleName = profileName.toLowerCase().trim()
    
    // Mapper les variations possibles vers nos constantes
    const roleMapping = {
      'user': ROLES.USER,
      'admin': ROLES.ADMIN,
      'superuser': ROLES.SUPERUSER,
      'supeuser': ROLES.SUPERUSER, // Gérer la typo dans votre API
      'super_user': ROLES.SUPERUSER,
      'super-user': ROLES.SUPERUSER,
    }
    
    return roleMapping[roleName] || ROLES.USER // Valeur par défaut
  }

  // Fonction pour obtenir les données utilisateur par ID
  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8093/employee/getById/${userId}`)
      
      if (response.data) {
        const userData = response.data
        const profileName = userData.profile?.profileName
        
        if (!profileName) {
          throw new Error("Profil utilisateur non trouvé")
        }
        
        // Normaliser le rôle
        const normalizedRole = normalizeRole(profileName)
        
        // Stocker les informations dans localStorage
        localStorage.setItem("userId", userData.idE.toString())
        localStorage.setItem("userRole", normalizedRole)
        localStorage.setItem("userData", JSON.stringify({
          id: userData.idE,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          ppr: userData.ppr,
          cin: userData.cin,
          address: userData.address,
          hireDate: userData.hireDate,
          workLocation: userData.workLocation,
          profileName: normalizedRole,
          profileId: userData.profile?.idProfile,
          postName: userData.post?.postName,
          postId: userData.post?.idPost,
          fullName: `${userData.firstName} ${userData.lastName}`.trim()
        }))
        
        console.log(`Connexion réussie - Rôle: ${normalizedRole}`)
        return { success: true, role: normalizedRole, userData }
        
      } else {
        throw new Error("Données utilisateur non trouvées")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error)
      throw new Error("Impossible de récupérer les informations utilisateur")
    }
  }

  // Fonction de redirection selon le rôle
  const redirectByRole = (role) => {
    const from = location.state?.from?.pathname
    let redirectPath = "/admin/index" // Par défaut

    // Si une page spécifique était demandée, essayer d'y rediriger
    if (from && from !== "/auth/login") {
      redirectPath = from
    } else {
      // Sinon, rediriger selon le rôle
      switch (role) {
        case ROLES.SUPERUSER:
          redirectPath = "/admin/Parametre"
          break
        case ROLES.ADMIN:
          redirectPath = "/admin/employees"
          break
        case ROLES.USER:
          redirectPath = "/admin/user-profile"
          break
        default:
          redirectPath = "/admin/index"
      }
    }

    navigate(redirectPath, { replace: true })
  }

  // Fonction principale de connexion
  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Étape 1: Connexion avec email/password
      const loginResponse = await axios.post("http://localhost:8093/employee/login", {
        email: email,
        password: password,
      })

      console.log("Réponse de connexion:", loginResponse.data)

      if (loginResponse.data.message === "Email Not Exist") {
        setError("L'adresse email n'existe pas dans notre système")
        return
      }
      
      if (loginResponse.data.message !== "login Success") {
        setError("Email ou mot de passe incorrect")
        return
      }

      // Étape 2: Récupérer l'ID utilisateur depuis la réponse
      const userId = loginResponse.data.id
      
      if (!userId) {
        setError("Erreur lors de la récupération des informations utilisateur")
        return
      }

      // Étape 3: Récupérer le profil complet avec le rôle
      const profileResult = await fetchUserProfile(userId)
      
      if (profileResult.success) {
        // Étape 4: Redirection selon le rôle
        redirectByRole(profileResult.role)
      }

    } catch (err) {
      console.error("Erreur de connexion:", err)
      
      if (err.response?.status === 401) {
        setError("Identifiants incorrects")
      } else if (err.response?.status === 404) {
        setError("Utilisateur non trouvé")
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Erreur de connexion. Veuillez réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Boutons de test pour le développement
  const handleTestLogin = async (testRole) => {
    if (process.env.NODE_ENV === 'development') {
      setIsLoading(true)
      
      // Simuler les données selon le rôle de test
      const testUserData = {
        user: { id: 1, name: "Utilisateur Test", role: ROLES.USER },
        admin: { id: 2, name: "Admin Test", role: ROLES.ADMIN },
        superuser: { id: 3, name: "SuperUser Test", role: ROLES.SUPERUSER }
      }
      
      const userData = testUserData[testRole]
      
      localStorage.setItem("userId", userData.id.toString())
      localStorage.setItem("userRole", userData.role)
      localStorage.setItem("userData", JSON.stringify({
        id: userData.id,
        firstName: userData.name.split(' ')[0],
        lastName: userData.name.split(' ')[1] || '',
        email: `${testRole}@test.com`,
        profileName: userData.role,
        fullName: userData.name
      }))
      
      setTimeout(() => {
        redirectByRole(userData.role)
        setIsLoading(false)
      }, 500)
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
            {/* Message d'information sur la redirection */}
            {location.state?.from && (
              <Alert color="info" className="mb-3">
                <i className="fas fa-info-circle mr-2"></i>
                <small>Vous devez vous connecter pour accéder à cette page</small>
              </Alert>
            )}

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                <Button 
                  className="modern-login-button" 
                  type="submit" 
                  disabled={isLoading || !email || !password}
                >
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

            {/* Boutons de test en mode développement 
            {process.env.NODE_ENV === 'development' && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e3e3e3' }}>
                <div className="text-center mb-2">
                  <small style={{ color: '#6c757d' }}>Mode développement - Connexion rapide :</small>
                </div>
                <Row>
                  <Col xs="4">
                    <Button 
                      color="info" 
                      size="sm" 
                      block
                      onClick={() => handleTestLogin('user')}
                      disabled={isLoading}
                    >
                      User
                    </Button>
                  </Col>
                  <Col xs="4">
                    <Button 
                      color="warning" 
                      size="sm" 
                      block
                      onClick={() => handleTestLogin('admin')}
                      disabled={isLoading}
                    >
                      Admin
                    </Button>
                  </Col>
                  <Col xs="4">
                    <Button 
                      color="danger" 
                      size="sm" 
                      block
                      onClick={() => handleTestLogin('superuser')}
                      disabled={isLoading}
                    >
                      SuperUser
                    </Button>
                  </Col>
                </Row>
              </div>
            )}*/}
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