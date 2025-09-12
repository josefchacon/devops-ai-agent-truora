import axios from 'axios'

const API_BASE_URL = 'https://devops-ai-agent-truora-production.up.railway.app/api'

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