import React, { useState } from 'react'
import Dashboard from './pages/Dashboard'
import LogUpload from './components/LogUpload'
import Login from './components/Login'
import { useAuth } from './hooks/useAuth'
import { Activity, Upload, BarChart3, LogOut } from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { isAuthenticated, loading, login, logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={login} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">DevOps AI Agent</span>
            </div>
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'dashboard'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  activeTab === 'upload'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Upload className="h-4 w-4 mr-1" />
                Upload Logs
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'upload' && <LogUpload />}
      </main>
    </div>
  )
}

export default App