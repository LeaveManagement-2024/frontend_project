import axios from 'axios';


const API_URL = 'http://localhost:8093/leave'; 


export const getAllLeaves = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};
export const ConfermedLeave = async () => {
  try {
    const response = await axios.get(`${API_URL}/ConfermedLeave`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};
export const UnconfermedLeave = async () => {
  try {
    const response = await axios.get(`${API_URL}/UnconfermedLeave`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};
export const UnconfermedLeaveByManager = async () => {
  try {
    const response = await axios.get(`${API_URL}/UnconfermedLeaveByManager`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};
export const UnconfermedLeaveByResponsible = async () => {
  try {
    const response = await axios.get(`${API_URL}/UnconfermedLeaveByResponsible`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};
export const UnconfermedLeaveByRemplacment = async () => {
  try {
    const response = await axios.get(`${API_URL}/UnconfermedLeaveByRemplacment`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leaves:', error);
    throw error;
  }
};


export const getLeaveById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du leave avec l'ID ${id}:`, error);
    throw error;
  }
};


export const addleave = async (gradeNameFr, gradeNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { gradeNameFr, gradeNameAr });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du leave:', error);
    throw error;
  }
};


export const updateLeave = async (id, gradeNameFr, gradeNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { gradeNameFr, gradeNameAr });
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du leave avec l'ID ${id}:`, error);
    throw error;
  }
};


export const deleteLeave = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression du leave avec l'ID ${id}:`, error);
    throw error;
  }
};

