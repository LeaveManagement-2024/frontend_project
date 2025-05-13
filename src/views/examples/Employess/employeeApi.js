import axios from 'axios';

const BASE_URL = 'http://localhost:8093/employee';

const loginEmployee = async (logInDTO) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, logInDTO);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getAll`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all employees:', error);
    throw error;
  }
};
const getFilirerByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getFiliere/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee filiere:', error);
    throw error;
  }
};

const getEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getById/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    throw error;
  }
};

const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error);
    throw error;
  }
};
const getAllLeavesByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/AllLeaveE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching all leaves for employee ${id}:`, error);
    throw error;
  }
};

const getConfirmedLeavesByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/ConfermedLeaveE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching confirmed leaves for employee ${id}:`, error);
    throw error;
  }
};

const getUnconfirmedLeavesByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/UnconfermedLeaveE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching unconfirmed leaves for employee ${id}:`, error);
    throw error;
  }
};

const getLeavesToConfirmByManager = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/UnconfermedLeaveByManagerE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching leaves to confirm for manager ${id}:`, error);
    throw error;
  }
};
const getLeavesToConfirmByResponsible = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/UnconfermedLeaveByResponsibleE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching leaves to confirm for Responsible ${id}:`, error);
    throw error;
  }
};
const getAnnualLeavesLines = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getAnnualLeavesLines/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching AnnualLeavesLines FOR EMPLOYEE ${id}:`, error);
    throw error;
  }
};
const getLeavesToConfirmByRemplacement = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/UnconfermedLeaveByRemplacmentE/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching leaves to confirm for Remplacement ${id}:`, error);
    throw error;
  }
};
const getListesLeavesToConfirm = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getLeavesToConfirm/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching leaves to confirm ${id}:`, error);
    throw error;
  }
};
const getListesConfirmedLeaves = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getConfirmedLeaves/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ConfirmedLeaves ${id}:`, error);
    throw error;
  }
};
const postLeavesToConfirmE = async (ide,idl) => {
  try {
    const response = await axios.post(`${BASE_URL}/LeavesToConfirmE/${ide}/${idl}`);
    return response.data;
  } catch (error) {
    console.error(`Error  :`, error);
    throw error;
  }
};
const postLeavesToUnconfirmE = async (ide,idl) => {
  try {
    const response = await axios.post(`${BASE_URL}/LeavesToUnconfirmE/${ide}/${idl}`);
    return response.data;
  } catch (error) {
    console.error(`Error  :`, error);
    throw error;
  }
};


export {
  loginEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  getFilirerByEmployee,
  getAllLeavesByEmployee,
  getConfirmedLeavesByEmployee,
  getLeavesToConfirmByManager,
  getUnconfirmedLeavesByEmployee,
  getLeavesToConfirmByResponsible,
  getLeavesToConfirmByRemplacement,
  getAnnualLeavesLines,
  getListesLeavesToConfirm,
  getListesConfirmedLeaves,
  postLeavesToConfirmE,
  postLeavesToUnconfirmE,
};
