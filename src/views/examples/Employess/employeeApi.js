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
    
    // Debug logging
    console.log('getAllEmployees - Response status:', response.status);
    console.log('getAllEmployees - Response data type:', typeof response.data);
    console.log('getAllEmployees - Is response.data an array?', Array.isArray(response.data));
    
    // The response.data should be an array, but let's handle circular references
    if (Array.isArray(response.data)) {
      console.log('getAllEmployees - Successfully received array with', response.data.length, 'employees');
      
      // Clean the data to remove circular references and unnecessary nested data
      const cleanedEmployees = response.data.map(employee => {
        // Create a clean employee object without deep nested circular references
        const cleanEmployee = {
          idE: employee.idE,
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          phone: employee.phone,
          ppr: employee.ppr,
          cin: employee.cin,
          address: employee.address,
          hireDate: employee.hireDate,
          workLocation: employee.workLocation,
          image: employee.image,
          // Include post info but not the full nested objects
          post: employee.post ? {
            idPost: employee.post.idPost,
            postName: employee.post.postName
          } : null,
          // Include profile info if needed
          profile: employee.profile ? {
            id: employee.profile.id,
            name: employee.profile.name
          } : null
          // Note: We're NOT including formations here to avoid circular references
          // If you need formations, create a separate API call for employee details
        };
        
        return cleanEmployee;
      });
      
      console.log('getAllEmployees - Cleaned employees:', cleanedEmployees.length, 'items');
      if (cleanedEmployees.length > 0) {
        console.log('getAllEmployees - Sample cleaned employee:', cleanedEmployees[0]);
      }
      
      return cleanedEmployees;
    } else {
      console.warn('getAllEmployees - Unexpected response format. Expected array but got:', typeof response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching all employees:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url
    });
    
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
};

const getFilirerByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getDepartment/${id}`);
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

const postLeavesToConfirmE = async (ide, idl) => {
  try {
    const response = await axios.post(`${BASE_URL}/LeavesToConfirmE/${ide}/${idl}`);
    return response.data;
  } catch (error) {
    console.error(`Error:`, error);
    throw error;
  }
};

const postLeavesToUnconfirmE = async (ide, idl) => {
  try {
    const response = await axios.post(`${BASE_URL}/LeavesToUnconfirmE/${ide}/${idl}`);
    return response.data;
  } catch (error) {
    console.error(`Error:`, error);
    throw error;
  }
};

const getDepartmentByEmployee = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/getDepartment/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee Department:', error);
    throw error;
  }
};

const importEmployeesFromCSV = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`http://localhost:8093/employee/import-csv`, {
      method: 'POST',
      body: formData,
      // Ne pas définir Content-Type, le navigateur le fera automatiquement pour FormData
    })

    if (!response.ok) {
      // Si la réponse n'est pas OK, essayons d'abord de lire le texte
      const errorText = await response.text()
      let errorMessage = `Erreur HTTP: ${response.status}`
      
      try {
        // Essayer de parser comme JSON
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorMessage
      } catch {
        // Si ce n'est pas du JSON, utiliser le texte brut
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Erreur lors de l\'import CSV:', error)
    throw error
  }
}

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
  getDepartmentByEmployee,
  importEmployeesFromCSV,
};