import React, { useState } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadLog } from '../services/api'

const LogUpload = () => {
  const [formData, setFormData] = useState({
    service_name: '',
    error_level: 'ERROR',
    error_message: '',
    stack_trace: '',
    raw_log: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await uploadLog(formData)
      setResult({ type: 'success', data: response })
      setFormData({
        service_name: '',
        error_level: 'ERROR',
        error_message: '',
        stack_trace: '',
        raw_log: ''
      })
    } catch (error) {
      setResult({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Upload Error Log</h2>
          <p className="text-sm text-gray-500">Submit error logs for AI analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Name</label>
              <input
                type="text"
                required
                value={formData.service_name}
                onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., user-service, payment-api"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Error Level</label>
              <select
                value={formData.error_level}
                onChange={(e) => setFormData({...formData, error_level: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ERROR">ERROR</option>
                <option value="WARN">WARN</option>
                <option value="FATAL">FATAL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Error Message</label>
            <input
              type="text"
              required
              value={formData.error_message}
              onChange={(e) => setFormData({...formData, error_message: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of the error"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Stack Trace (Optional)</label>
            <textarea
              rows={4}
              value={formData.stack_trace}
              onChange={(e) => setFormData({...formData, stack_trace: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Full stack trace if available"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Raw Log</label>
            <textarea
              rows={6}
              required
              value={formData.raw_log}
              onChange={(e) => setFormData({...formData, raw_log: e.target.value})}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Complete raw log entry"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload & Analyze
              </>
            )}
          </button>
        </form>

        {result && (
          <div className="px-6 pb-6">
            {result.type === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Analysis Complete</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p><strong>Category:</strong> {result.data.ai_analysis.category}</p>
                      <p><strong>Severity:</strong> {result.data.ai_analysis.severity_score}/10</p>
                      <p><strong>Confidence:</strong> {(result.data.ai_analysis.confidence_score * 100).toFixed(1)}%</p>
                      <p><strong>Solution:</strong> {result.data.ai_analysis.suggested_solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <p className="mt-1 text-sm text-red-700">{result.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LogUpload