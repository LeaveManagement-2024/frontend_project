import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:8093/leaveTypes';  // Replace with your actual API URL

// Function to get all leave types
export const getAllLeaveTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave types:', error);
    throw error;
  }
};

// Function to get a leave type by ID
export const getLeaveTypeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching leave type with ID ${id}:`, error);
    throw error;
  }
};

// Function to add a new leave type
export const addLeaveType = async (leaveTypeNameFr, leaveTypeNameAr) => {
  try {
    const response = await axios.post(`${API_URL}/save`, { leaveTypeNameFr, leaveTypeNameAr });
    return response.data;
  } catch (error) {
    console.error('Error adding leave type:', error);
    throw error;
  }
};

// Function to update a leave type
export const updateLeaveType = async (id, leaveTypeNameFr, leaveTypeNameAr) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, { leaveTypeNameFr, leaveTypeNameAr });
    return response.data;
  } catch (error) {
    console.error(`Error updating leave type with ID ${id}:`, error);
    throw error;
  }
};

// Function to delete a leave type
export const deleteLeaveType = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting leave type with ID ${id}:`, error);
    throw error;
  }
};
