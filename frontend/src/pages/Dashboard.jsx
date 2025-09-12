import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { getLogs, getReports } from '../services/api'
import api from '../services/api'

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [metricsRes, logsRes] = await Promise.all([
        api.get('/reports/metrics'),
        getLogs({ limit: 5 })
      ])
      
      setMetrics(metricsRes.data)
      setRecentLogs(logsRes)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (score) => {
    if (score >= 8) return 'text-red-600 bg-red-100'
    if (score >= 6) return 'text-orange-600 bg-orange-100'
    if (score >= 4) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const categoryData = metrics ? Object.entries(metrics.topCategories).map(([name, value]) => ({ name, value })) : []
  const COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">DevOps AI Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalLogs || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">AI Classifications</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalClassifications || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Severity</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.avgSeverity || 0}/10</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalReports || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Categories Chart */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Error Categories</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Recent Logs */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Error Logs</h3>
          <div className="space-y-4">
            {recentLogs.length > 0 ? (
              recentLogs.map((log) => (
                <div key={log.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{log.service_name}</p>
                        <p className="text-sm text-gray-600">{log.error_message}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          log.error_level === 'FATAL' ? 'bg-red-100 text-red-800' :
                          log.error_level === 'ERROR' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {log.error_level}
                        </span>
                        {log.ai_classifications?.[0] && (
                          <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(log.ai_classifications[0].severity_score)}`}>
                            {log.ai_classifications[0].severity_score}/10
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* AI Analysis Details */}
                    {log.ai_classifications?.[0] && (
                      <div className="mt-2 p-3 bg-blue-50 rounded border-l-2 border-blue-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="font-medium text-blue-800">Categoría:</span>
                            <span className="ml-1 text-blue-700">{log.ai_classifications[0].category}</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-800">Confianza:</span>
                            <span className="ml-1 text-blue-700">{(log.ai_classifications[0].confidence_score * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="font-medium text-blue-800">💡 Solución:</span>
                          <p className="text-blue-700 text-sm mt-1">{log.ai_classifications[0].suggested_solution}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                No logs available. Upload some logs to see them here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard