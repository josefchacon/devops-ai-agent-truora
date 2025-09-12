const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const testLogs = [
  {
    service_name: 'user-service',
    error_level: 'ERROR',
    error_message: 'Database connection failed',
    stack_trace: 'at Connection.connect (db.js:45)\nat Database.init (database.js:12)',
    raw_log: '2024-01-15 10:30:00 ERROR [user-service] Database connection failed after timeout'
  },
  {
    service_name: 'payment-api',
    error_level: 'FATAL',
    error_message: 'OutOfMemoryError',
    stack_trace: 'java.lang.OutOfMemoryError: Java heap space',
    raw_log: '2024-01-15 11:15:00 FATAL [payment-api] OutOfMemoryError: Java heap space at com.payment.ProcessPayment'
  }
];

async function testAPI() {
  console.log('🧪 Testing DevOps AI Agent API...\n');

  // Test 1: Health check
  try {
    const health = await axios.get(`${API_URL}/../health`);
    console.log('✅ Health check:', health.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Upload logs
  for (let i = 0; i < testLogs.length; i++) {
    try {
      console.log(`\n📤 Uploading log ${i + 1}...`);
      const response = await axios.post(`${API_URL}/logs`, testLogs[i]);
      
      console.log('✅ Log uploaded successfully');
      console.log('📊 AI Analysis:');
      console.log(`   Category: ${response.data.ai_analysis.category}`);
      console.log(`   Severity: ${response.data.ai_analysis.severity_score}/10`);
      console.log(`   Confidence: ${(response.data.ai_analysis.confidence_score * 100).toFixed(1)}%`);
      console.log(`   Solution: ${response.data.ai_analysis.suggested_solution.substring(0, 100)}...`);
      
    } catch (error) {
      console.log('❌ Upload failed:', error.response?.data || error.message);
    }
  }

  // Test 3: Fetch logs
  try {
    console.log('\n📥 Fetching logs...');
    const logs = await axios.get(`${API_URL}/logs?limit=5`);
    console.log(`✅ Retrieved ${logs.data.length} logs`);
  } catch (error) {
    console.log('❌ Fetch failed:', error.message);
  }

  console.log('\n🎉 Testing completed!');
}

testAPI();