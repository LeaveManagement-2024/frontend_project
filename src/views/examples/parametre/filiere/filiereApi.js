import axios from 'axios';

// Base URL de votre API
const API_URL = 'http://localhost:8093/filieres';  // Remplacez par l'URL de votre API

// Fonction pour obtenir tous les filieres
export const getAllFilieres = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des filieres:', error);
    throw error;
  }
};

// Fonction pour obtenir un filiere par ID
export const getFiliereById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du filiere avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau filiere
export const addFiliere = async (filiereNameFr, filiereNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { filiereNameFr, filiereNameAr });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du filiere:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un filiere
export const updateFiliere = async (id, filiereNameFr, filiereNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { filiereNameFr, filiereNameAr });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du filiere avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un filiere
export const deleteFiliere = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du filiere avec l'ID ${id}:`, error);
    throw error;
  }
};
