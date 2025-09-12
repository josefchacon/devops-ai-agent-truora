const axios = require('axios');

// Reemplaza con tus URLs reales
const BACKEND_URL = 'https://tu-proyecto.railway.app';
const FRONTEND_URL = 'https://tu-proyecto.vercel.app';

const testLog = {
  service_name: 'production-test',
  error_level: 'ERROR',
  error_message: 'Production deployment test',
  raw_log: '2024-01-15 10:30:00 ERROR Production test log'
};

async function testProduction() {
  console.log('🚀 Testing Production Deployment\n');

  // Test Backend
  try {
    console.log('1️⃣ Testing Backend...');
    const health = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend Health:', health.data.status);
    
    const logResponse = await axios.post(`${BACKEND_URL}/api/logs`, testLog);
    console.log('✅ Log Analysis:', logResponse.data.ai_analysis.category);
  } catch (error) {
    console.log('❌ Backend Error:', error.message);
  }

  // Test Frontend
  try {
    console.log('\n2️⃣ Testing Frontend...');
    const frontend = await axios.get(FRONTEND_URL);
    console.log('✅ Frontend accessible');
  } catch (error) {
    console.log('❌ Frontend Error:', error.message);
  }

  console.log('\n🎉 Production testing completed!');
  console.log(`\n📱 URLs:`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Backend:  ${BACKEND_URL}`);
}

testProduction();