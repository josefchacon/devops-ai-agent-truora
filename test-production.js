const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const productionTestLogs = [
  {
    service_name: 'payment-gateway',
    error_level: 'FATAL',
    error_message: 'OutOfMemoryError: Java heap space exceeded',
    stack_trace: 'java.lang.OutOfMemoryError: Java heap space\n\tat com.payment.processor.PaymentHandler.processPayment(PaymentHandler.java:145)\n\tat com.payment.service.PaymentService.handleTransaction(PaymentService.java:89)',
    raw_log: '2024-01-15 14:30:25 FATAL [payment-gateway] OutOfMemoryError: Java heap space exceeded during high-volume transaction processing'
  },
  {
    service_name: 'user-authentication',
    error_level: 'ERROR',
    error_message: 'Database connection pool exhausted',
    stack_trace: 'com.zaxxer.hikari.pool.HikariPool$PoolInitializationException: Failed to initialize pool\n\tat com.auth.database.ConnectionManager.getConnection(ConnectionManager.java:67)',
    raw_log: '2024-01-15 14:32:10 ERROR [user-authentication] Database connection pool exhausted - unable to serve authentication requests'
  },
  {
    service_name: 'notification-service',
    error_level: 'ERROR',
    error_message: 'Redis cluster connection timeout',
    stack_trace: 'redis.clients.jedis.exceptions.JedisConnectionException: Could not get a resource from the pool\n\tat redis.clients.jedis.util.Pool.getResource(Pool.java:53)',
    raw_log: '2024-01-15 14:33:45 ERROR [notification-service] Redis cluster connection timeout after 5000ms - notifications failing'
  }
];

async function testProductionSetup() {
  console.log('🚀 Testing Production Setup with GPT-4...\n');

  // Test 1: Health check
  try {
    const health = await axios.get(`${API_URL}/../health`);
    console.log('✅ Health check:', health.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Upload and analyze logs with GPT-4
  const results = [];
  for (let i = 0; i < productionTestLogs.length; i++) {
    try {
      console.log(`\n📤 Uploading production log ${i + 1}...`);
      console.log(`   Service: ${productionTestLogs[i].service_name}`);
      console.log(`   Error: ${productionTestLogs[i].error_message}`);
      
      const startTime = Date.now();
      const response = await axios.post(`${API_URL}/logs`, productionTestLogs[i]);
      const processingTime = Date.now() - startTime;
      
      console.log('✅ GPT-4 Analysis completed:');
      console.log(`   🏷️  Category: ${response.data.ai_analysis.category}`);
      console.log(`   ⚠️  Severity: ${response.data.ai_analysis.severity_score}/10`);
      console.log(`   🎯 Confidence: ${(response.data.ai_analysis.confidence_score * 100).toFixed(1)}%`);
      console.log(`   ⏱️  Processing: ${processingTime}ms`);
      console.log(`   💡 Solution: ${response.data.ai_analysis.suggested_solution.substring(0, 80)}...`);
      
      if (response.data.ai_analysis.urgency) {
        console.log(`   🚨 Urgency: ${response.data.ai_analysis.urgency}`);
      }
      
      results.push(response.data);
      
    } catch (error) {
      console.log('❌ Upload failed:', error.response?.data || error.message);
    }
  }

  // Test 3: Generate incident report
  if (results.length > 0) {
    try {
      console.log('\n📊 Generating incident report with GPT-4...');
      const reportResponse = await axios.post(`${API_URL}/ai/generate-report`);
      
      console.log('✅ Incident Report Generated:');
      console.log(`   📋 Title: ${reportResponse.data.title}`);
      console.log(`   📝 Summary: ${reportResponse.data.summary}`);
      console.log(`   🎯 Severity: ${reportResponse.data.severity}`);
      console.log(`   🏢 Services: ${reportResponse.data.affected_services.join(', ')}`);
      console.log(`   ⏰ Est. Resolution: ${reportResponse.data.estimated_resolution_time || 'N/A'}`);
      
    } catch (error) {
      console.log('❌ Report generation failed:', error.response?.data || error.message);
    }
  }

  // Test 4: Dashboard metrics
  try {
    console.log('\n📈 Fetching dashboard metrics...');
    const metrics = await axios.get(`${API_URL}/reports/metrics`);
    console.log('✅ Dashboard metrics:');
    console.log(`   📊 Total Logs: ${metrics.data.totalLogs}`);
    console.log(`   🤖 AI Classifications: ${metrics.data.totalClassifications}`);
    console.log(`   📋 Reports: ${metrics.data.totalReports}`);
    console.log(`   ⚠️  Avg Severity: ${metrics.data.avgSeverity}/10`);
  } catch (error) {
    console.log('❌ Metrics fetch failed:', error.message);
  }

  console.log('\n🎉 Production testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Add OpenAI credits to your account');
  console.log('2. Test with real production logs');
  console.log('3. Deploy to Railway/Vercel');
  console.log('4. Record demo video');
}

testProductionSetup();