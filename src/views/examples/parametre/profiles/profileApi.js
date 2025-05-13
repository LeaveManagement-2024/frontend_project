import axios from 'axios';

// Base URL de votre API
const API_URL = 'http://localhost:8093/profiles';  // Remplacez par l'URL de votre API

// Fonction pour obtenir tous les posts
export const getAllProfiles = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des Profiles:', error);
    throw error;
  }
};

// Fonction pour obtenir un post par ID
export const getProfileById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Profile avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau post
export const addProfile = async (postNameFr, postNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { postNameFr, postNameAr });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du Profile:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un post
export const updateProfile = async (id, postNameFr, postNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { postNameFr, postNameAr });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du Profile avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un post
export const deleteProfile = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du Profile avec l'ID ${id}:`, error);
    throw error;
  }
};
