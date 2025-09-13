const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

const testScenarios = [
  // ERRORES CRÍTICOS (FATAL)
  {
    name: 'Critical Memory Failure',
    log: {
      service_name: 'payment-gateway',
      error_level: 'FATAL',
      error_message: 'OutOfMemoryError: Java heap space exceeded',
      stack_trace: 'java.lang.OutOfMemoryError: Java heap space\nat com.payment.processor.PaymentHandler.processPayment(PaymentHandler.java:145)',
      raw_log: '2024-01-15 14:30:25 FATAL [payment-gateway] OutOfMemoryError: Java heap space exceeded during high-volume transaction processing'
    }
  },
  {
    name: 'Database Complete Failure',
    log: {
      service_name: 'core-database',
      error_level: 'FATAL',
      error_message: 'Database server unreachable - all connections lost',
      stack_trace: 'at DatabasePool.getConnection(DatabasePool.java:234)\nat TransactionManager.begin(TransactionManager.java:67)',
      raw_log: '2024-01-15 14:32:10 FATAL [core-database] All database connections lost - server unreachable for 5 minutes'
    }
  },
  {
    name: 'Security Breach Alert',
    log: {
      service_name: 'security-monitor',
      error_level: 'FATAL',
      error_message: 'Potential security breach detected - unauthorized access attempt',
      stack_trace: 'at SecurityFilter.validateAccess(SecurityFilter.java:89)\nat AuthenticationService.authenticate(AuthenticationService.java:156)',
      raw_log: '2024-01-15 14:35:45 FATAL [security-monitor] Multiple failed admin login attempts from suspicious IP: 192.168.1.100'
    }
  },
  
  // ERRORES ALTOS (ERROR)
  {
    name: 'API Gateway Timeout',
    log: {
      service_name: 'api-gateway',
      error_level: 'ERROR',
      error_message: 'Upstream service timeout - request failed',
      stack_trace: 'at HttpClient.executeRequest(HttpClient.java:445)\nat GatewayService.forwardRequest(GatewayService.java:123)',
      raw_log: '2024-01-15 14:40:12 ERROR [api-gateway] Upstream timeout after 30s - user-service not responding'
    }
  },
  {
    name: 'File System Error',
    log: {
      service_name: 'file-storage',
      error_level: 'ERROR',
      error_message: 'Disk space critically low - unable to write files',
      stack_trace: 'at FileWriter.write(FileWriter.java:234)\nat StorageService.saveFile(StorageService.java:89)',
      raw_log: '2024-01-15 14:42:30 ERROR [file-storage] Disk usage at 98% - cannot save uploaded files'
    }
  },
  {
    name: 'Cache Service Down',
    log: {
      service_name: 'redis-cache',
      error_level: 'ERROR',
      error_message: 'Redis connection lost - cache unavailable',
      stack_trace: 'at RedisClient.connect(RedisClient.java:156)\nat CacheService.get(CacheService.java:45)',
      raw_log: '2024-01-15 14:45:15 ERROR [redis-cache] Connection to Redis server lost - falling back to database'
    }
  },
  {
    name: 'Email Service Failure',
    log: {
      service_name: 'notification-service',
      error_level: 'ERROR',
      error_message: 'SMTP server connection failed - emails not being sent',
      stack_trace: 'at SMTPClient.send(SMTPClient.java:234)\nat EmailService.sendEmail(EmailService.java:67)',
      raw_log: '2024-01-15 14:47:22 ERROR [notification-service] SMTP connection timeout - 150 emails queued'
    }
  },
  {
    name: 'Load Balancer Error',
    log: {
      service_name: 'load-balancer',
      error_level: 'ERROR',
      error_message: 'All backend servers marked as unhealthy',
      stack_trace: 'at HealthChecker.checkHealth(HealthChecker.java:123)\nat LoadBalancer.route(LoadBalancer.java:89)',
      raw_log: '2024-01-15 14:50:10 ERROR [load-balancer] No healthy backend servers available - routing failed'
    }
  },
  
  // ADVERTENCIAS (WARN)
  {
    name: 'High CPU Usage',
    log: {
      service_name: 'user-service',
      error_level: 'WARN',
      error_message: 'CPU usage above 85% for extended period',
      stack_trace: '',
      raw_log: '2024-01-15 14:52:30 WARN [user-service] CPU usage at 87% for last 10 minutes - consider scaling'
    }
  },
  {
    name: 'JWT Token Expiration',
    log: {
      service_name: 'auth-service',
      error_level: 'WARN',
      error_message: 'High number of expired JWT tokens detected',
      stack_trace: 'at JWTValidator.validate(jwt.js:123)\nat AuthMiddleware.check(auth.js:45)',
      raw_log: '2024-01-15 14:55:15 WARN [auth-service] 200+ expired JWT tokens in last hour - users may need to re-login'
    }
  },
  {
    name: 'Slow Database Queries',
    log: {
      service_name: 'analytics-service',
      error_level: 'WARN',
      error_message: 'Database queries taking longer than expected',
      stack_trace: 'at QueryExecutor.execute(QueryExecutor.java:234)\nat AnalyticsService.generateReport(AnalyticsService.java:89)',
      raw_log: '2024-01-15 14:58:45 WARN [analytics-service] Query execution time: 15.2s (threshold: 5s)'
    }
  },
  {
    name: 'Memory Usage Warning',
    log: {
      service_name: 'image-processor',
      error_level: 'WARN',
      error_message: 'Memory usage approaching limit',
      stack_trace: '',
      raw_log: '2024-01-15 15:02:10 WARN [image-processor] Heap usage at 78% - consider garbage collection'
    }
  },
  
  // INFORMACIÓN (INFO)
  {
    name: 'Service Startup',
    log: {
      service_name: 'order-service',
      error_level: 'INFO',
      error_message: 'Service started successfully',
      stack_trace: '',
      raw_log: '2024-01-15 15:05:00 INFO [order-service] Service initialized - ready to accept requests'
    }
  },
  {
    name: 'Scheduled Backup',
    log: {
      service_name: 'backup-service',
      error_level: 'INFO',
      error_message: 'Daily backup completed successfully',
      stack_trace: '',
      raw_log: '2024-01-15 15:08:30 INFO [backup-service] Database backup completed - 2.3GB archived'
    }
  },
  {
    name: 'User Registration',
    log: {
      service_name: 'user-service',
      error_level: 'INFO',
      error_message: 'New user registration completed',
      stack_trace: '',
      raw_log: '2024-01-15 15:12:15 INFO [user-service] User registration successful - ID: 12345'
    }
  },
  
  // DEBUG
  {
    name: 'Cache Hit Rate',
    log: {
      service_name: 'cache-monitor',
      error_level: 'DEBUG',
      error_message: 'Cache performance metrics',
      stack_trace: '',
      raw_log: '2024-01-15 15:15:45 DEBUG [cache-monitor] Cache hit rate: 94.2% - performance optimal'
    }
  },
  {
    name: 'API Response Time',
    log: {
      service_name: 'performance-monitor',
      error_level: 'DEBUG',
      error_message: 'API endpoint response time tracking',
      stack_trace: '',
      raw_log: '2024-01-15 15:18:20 DEBUG [performance-monitor] /api/users endpoint avg response: 120ms'
    }
  },
  
  // ERRORES ADICIONALES PARA VARIEDAD
  {
    name: 'Configuration Error',
    log: {
      service_name: 'config-service',
      error_level: 'ERROR',
      error_message: 'Missing required environment variable',
      stack_trace: 'at ConfigLoader.load(ConfigLoader.java:67)\nat Application.start(Application.java:23)',
      raw_log: '2024-01-15 15:20:10 ERROR [config-service] Required env var DATABASE_URL not found'
    }
  },
  {
    name: 'Network Partition',
    log: {
      service_name: 'cluster-manager',
      error_level: 'ERROR',
      error_message: 'Network partition detected between nodes',
      stack_trace: 'at ClusterHealth.checkNodes(ClusterHealth.java:145)\nat ClusterManager.monitor(ClusterManager.java:89)',
      raw_log: '2024-01-15 15:22:35 ERROR [cluster-manager] Node communication lost - potential split-brain scenario'
    }
  },
  {
    name: 'Rate Limit Exceeded',
    log: {
      service_name: 'rate-limiter',
      error_level: 'WARN',
      error_message: 'API rate limit exceeded for client',
      stack_trace: 'at RateLimiter.checkLimit(RateLimiter.java:123)\nat APIGateway.processRequest(APIGateway.java:67)',
      raw_log: '2024-01-15 15:25:00 WARN [rate-limiter] Client 192.168.1.50 exceeded 1000 req/min limit'
    }
  }
];

async function runCompleteTest() {
  console.log('🧪 TESTING COMPLETO - DevOps AI Agent\n');
  console.log('📊 Cargando 20+ logs de demostración para video\n');
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