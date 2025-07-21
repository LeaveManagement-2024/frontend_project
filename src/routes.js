/*!
=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Page produit : https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licence sous MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Développé par Creative Tim
=========================================================

* Le copyright ci-dessus et cette autorisation doivent être inclus dans toutes les copies ou parties substantielles du logiciel.
*/
import React from 'react';
import Index from "views/Index.js";
import Profile from "views/examples/profilePerso/Profile";
import Register from "views/examples/Authe/Register.js";
import Login from "views/examples/Authe/Login.js";
import Leave from "views/examples/Leave/Leave";
import Employees from "views/examples/Employess/Employees";
import SaisieFormation from "views/examples/formation/GestionFormations";

import Parametre from "views/examples/parametre/parametre";
import AnnualLeave from "views/examples/annualLeave/annualLeave";
import LeavePerson from "views/examples/Leave/LeavePerson";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

var routes = [
  {
    path: "/index",
    name: "Tableau de bord",
    icon: "fa-solid fa-gauge text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/user-profile",
    name: "Profil de l'utilisateur",
    icon: "fa-solid fa-user text-primary",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/Leave",
    name: "Congés généraux",
    icon: "fa-solid fa-calendar text-primary" ,
    component: <Leave />,
    layout: "/admin",
  },
  {
    path: "/LeavePerson",
    name: "Congés personnels",
    icon: "fa-solid fa-calendar-days text-primary" ,
    component: <LeavePerson />,
    layout: "/admin",
  },
  {
    path: "/Parametre",
    name: "Paramètres",
    icon: "fa-solid fa-gears text-primary",
    component: <Parametre />,
    layout: "/admin",
  },
  {
    path: "/SaisieFormation",
    name: "SaisieFormation",
    icon: "fa-solid fa-gears text-primary",
    component: <SaisieFormation />,
    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employés",
    icon: "fa-solid fa-user-tie text-primary" ,
    component: <Employees />,
    layout: "/admin",
    
  },
  {
    path: "/annualLeave",
    name: "Congés annuels",
    icon: "fa-regular fa-calendar-days text-primary"  ,
    component: <AnnualLeave />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Connexion",
    icon: "fa-solid fa-key text-primary"  ,
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Inscription",
    icon: "fa-solid fa-address-card text-primary" ,
    component: <Register />,
    layout: "/auth",
    
  },
  
 
];

export default routes;
