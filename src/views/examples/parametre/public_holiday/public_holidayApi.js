import axios from 'axios';

// Base URL de votre API
const API_URL = 'http://localhost:8093/publicHoliday';  // Remplacez par l'URL de votre API

// Fonction pour obtenir tous les jours fériés
export const getAllPublicHolidays = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des jours fériés:', error);
    throw error;
  }
};

// Fonction pour obtenir un jour férié par ID
export const getPublicHolidayById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du jour férié avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau jour férié
export const addPublicHoliday = async (holidayName, holidayDate) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { holidayName, holidayDate });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du jour férié:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un jour férié
export const updatePublicHoliday = async (id, holidayName, holidayDate) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { holidayName, holidayDate });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du jour férié avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un jour férié
export const deletePublicHoliday = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du jour férié avec l'ID ${id}:`, error);
    throw error;
  }
};
