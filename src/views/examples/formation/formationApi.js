const API_BASE_URL = 'http://localhost:8093' // Ajustez selon votre configuration

export const getAllFormations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/getAll`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error)
    throw error
  }
}

export const getFormationsByEmployee = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/employee/${employeeId}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des formations de l\'employé:', error)
    throw error
  }
}

export const getFormationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/${id}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error)
    throw error
  }
}

export const addFormation = async (formationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formationData),
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la formation:', error)
    throw error
  }
}

export const updateFormation = async (id, formationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formationData),
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return response.ok
  } catch (error) {
    console.error('Erreur lors de la modification de la formation:', error)
    throw error
  }
}

export const deleteFormation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return response.ok
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error)
    throw error
  }
}

export const getFormationsByType = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/type/${type}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des formations par type:', error)
    throw error
  }
}

export const getEmployeeFormationStats = async (employeeId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/formation/stats/employee/${employeeId}`)
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    throw error
  }
}