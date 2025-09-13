import axios from 'axios'

// Detectar entorno automáticamente
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' 
    ? 'http://localhost:3001/api' 
    : 'https://devops-ai-agent-truora-production.up.railway.app/api')

console.log('🔗 API URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const uploadLog = async (logData) => {
  const response = await api.post('/logs', logData)
  return response.data
}

export const getLogs = async (params = {}) => {
  const response = await api.get('/logs', { params })
  return response.data
}

export const getReports = async () => {
  const response = await api.get('/reports')
  return response.data
}

export default api