import axios from 'axios';

// Base URL de votre API
const API_URL = 'http://localhost:8093/departments';  // Remplacez par l'URL de votre API

// Fonction pour obtenir tous les grades
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des Departement:', error);
    throw error;
  }
};

// Fonction pour obtenir un grade par ID
export const getDepartmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du Departement avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour ajouter un nouveau grade
export const addGrade = async (gradeNameFr, gradeNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { gradeNameFr, gradeNameAr });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du grade:', error);
    throw error;
  }
};

// Fonction pour mettre à jour un grade
export const updateGrade = async (id, gradeNameFr, gradeNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { gradeNameFr, gradeNameAr });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du Departement avec l'ID ${id}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un grade
export const deleteDepartment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du Departemente avec l'ID ${id}:`, error);
    throw error;
  }
};
