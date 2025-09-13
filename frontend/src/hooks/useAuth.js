import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedAuth = localStorage.getItem('devops-ai-auth')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const login = () => {
    setIsAuthenticated(true)
    localStorage.setItem('devops-ai-auth', 'true')
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('devops-ai-auth')
  }

  return {
    isAuthenticated,
    loading,
    login,
    logout
  }
}