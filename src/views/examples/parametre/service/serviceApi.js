import axios from 'axios';

// Base URL de votre API
const API_URL = 'http://localhost:8093/services';  // Remplacez par l'URL de votre API

// Fonction pour obtenir tous les services
export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    throw error;
  }
};

// Fonction pour obtenir un Service par ID
export const getServiceById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Service avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau Service
export const addService = async (ServiceNameFr, ServiceNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { ServiceNameFr, ServiceNameAr });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du Service:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un Service
export const updateService = async (id, ServiceNameFr, ServiceNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { ServiceNameFr, ServiceNameAr });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du Service avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un Service
export const deleteService = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du Service avec l'ID ${id}:`, error);
    throw error;
  }
};
