const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const testScenarios = [
  {
    name: 'Database Error',
    log: {
      service_name: 'user-service',
      error_level: 'ERROR',
      error_message: 'Connection to database failed',
      stack_trace: 'at Connection.connect (db.js:45)\nat Database.init (database.js:12)',
      raw_log: '2024-01-15 10:30:00 ERROR [user-service] Connection to database failed after 30s timeout'
    }
  },
  {
    name: 'Memory Error',
    log: {
      service_name: 'payment-api',
      error_level: 'FATAL',
      error_message: 'OutOfMemoryError: Java heap space',
      stack_trace: 'java.lang.OutOfMemoryError: Java heap space\nat com.payment.ProcessPayment.handle(ProcessPayment.java:89)',
      raw_log: '2024-01-15 11:15:00 FATAL [payment-api] OutOfMemoryError: Java heap space during payment processing'
    }
  },
  {
    name: 'Network Error',
    log: {
      service_name: 'notification-service',
      error_level: 'ERROR',
      error_message: 'Connection timeout to external API',
      stack_trace: 'at HttpClient.request (http.js:234)\nat NotificationService.send (notification.js:67)',
      raw_log: '2024-01-15 12:45:00 ERROR [notification-service] Connection timeout to external API after 5000ms'
    }
  },
  {
    name: 'Authentication Error',
    log: {
      service_name: 'auth-service',
      error_level: 'WARN',
      error_message: 'Invalid JWT token provided',
      stack_trace: 'at JWTValidator.validate (jwt.js:123)\nat AuthMiddleware.check (auth.js:45)',
      raw_log: '2024-01-15 13:20:00 WARN [auth-service] Invalid JWT token provided by user 12345'
    }
  }
];

async function runCompleteTest() {
  console.log('🧪 TESTING COMPLETO - DevOps AI Agent\n');
  console.log('========================================\n');

  // Test 1: Health Check
  console.log('1️⃣ HEALTH CHECK');
  try {
    const health = await axios.get(`${API_URL}/../health`);
    console.log('✅ Backend funcionando:', health.data.status);
  } catch (error) {
    console.log('❌ Backend no disponible:', error.message);
    return;
  }

  // Test 2: Database Connection
  console.log('\n2️⃣ DATABASE CONNECTION');
  try {
    const logs = await axios.get(`${API_URL}/logs?limit=1`);
    console.log('✅ Supabase conectado correctamente');
  } catch (error) {
    console.log('❌ Error de conexión a Supabase:', error.message);
    return;
  }

  // Test 3: AI Analysis for each scenario
  console.log('\n3️⃣ ANÁLISIS DE IA CON GEMINI');
  const results = [];
  
  for (let i = 0; i < testScenarios.length; i++) {
    const scenario = testScenarios[i];
    console.log(`\n📋 Escenario ${i + 1}: ${scenario.name}`);
    console.log(`   Servicio: ${scenario.log.service_name}`);
    console.log(`   Error: ${scenario.log.error_message}`);
    
    try {
      const startTime = Date.now();
      const response = await axios.post(`${API_URL}/logs`, scenario.log);
      const processingTime = Date.now() - startTime;
      
      const analysis = response.data.ai_analysis;
      
      console.log('✅ Análisis Gemini completado:');
      console.log(`   🏷️  Categoría: ${analysis.category}`);
      console.log(`   ⚠️  Severidad: ${analysis.severity_score}/10`);
      console.log(`   🎯 Confianza: ${(analysis.confidence_score * 100).toFixed(1)}%`);
      console.log(`   ⏱️  Tiempo: ${processingTime}ms`);
      console.log(`   🚨 Urgencia: ${analysis.urgency || 'N/A'}`);
      console.log(`   💡 Solución: ${analysis.suggested_solution.substring(0, 60)}...`);
      
      results.push({
        scenario: scenario.name,
        analysis,
        processingTime,
        success: true
      });
      
    } catch (error) {
      console.log('❌ Error en análisis:', error.response?.data?.error || error.message);
      results.push({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  }

  // Test 4: Dashboard Metrics
  console.log('\n4️⃣ DASHBOARD METRICS');
  try {
    const metrics = await axios.get(`${API_URL}/reports/metrics`);
    console.log('✅ Métricas obtenidas:');
    console.log(`   📊 Total Logs: ${metrics.data.totalLogs}`);
    console.log(`   🤖 Clasificaciones: ${metrics.data.totalClassifications}`);
    console.log(`   📋 Reportes: ${metrics.data.totalReports}`);
    console.log(`   ⚠️  Severidad Promedio: ${metrics.data.avgSeverity}/10`);
    console.log(`   📈 Top Categorías:`, Object.keys(metrics.data.topCategories).slice(0, 3));
  } catch (error) {
    console.log('❌ Error obteniendo métricas:', error.message);
  }

  // Test 5: Incident Report Generation
  console.log('\n5️⃣ GENERACIÓN DE REPORTES');
  try {
    const report = await axios.post(`${API_URL}/ai/generate-report`);
    console.log('✅ Reporte generado:');
    console.log(`   📋 Título: ${report.data.title}`);
    console.log(`   📝 Resumen: ${report.data.summary.substring(0, 80)}...`);
    console.log(`   🎯 Severidad: ${report.data.severity}`);
    console.log(`   🏢 Servicios: ${report.data.affected_services?.join(', ') || 'N/A'}`);
    console.log(`   ⏰ Resolución: ${report.data.estimated_resolution_time || 'N/A'}`);
  } catch (error) {
    console.log('❌ Error generando reporte:', error.response?.data?.error || error.message);
  }

  // Test 6: Frontend Connection
  console.log('\n6️⃣ FRONTEND CONNECTION');
  try {
    const frontendResponse = await axios.get('http://localhost:5173', { timeout: 3000 });
    console.log('✅ Frontend accesible en http://localhost:5173');
  } catch (error) {
    console.log('⚠️  Frontend no disponible - asegúrate de ejecutar: cd frontend && npm run dev');
  }

  // Summary
  console.log('\n========================================');
  console.log('📊 RESUMEN DE TESTING');
  console.log('========================================');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`✅ Análisis exitosos: ${successful}/${total}`);
  console.log(`⚡ Tiempo promedio: ${Math.round(results.filter(r => r.success).reduce((sum, r) => sum + r.processingTime, 0) / successful)}ms`);
  
  if (successful === total) {
    console.log('\n🎉 ¡TODOS LOS TESTS PASARON!');
    console.log('✅ El agente está listo para producción');
  } else {
    console.log('\n⚠️  Algunos tests fallaron - revisar configuración');
  }
  
  console.log('\n📋 Próximos pasos:');
  console.log('1. Probar interfaz web en http://localhost:5173');
  console.log('2. Subir logs manualmente desde el frontend');
  console.log('3. Verificar dashboard y métricas');
  console.log('4. Si todo funciona → proceder con despliegue');
}

runCompleteTest();