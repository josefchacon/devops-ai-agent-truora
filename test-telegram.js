require('dotenv').config({ path: './backend/.env' });
const telegramService = require('./backend/services/telegramService');

async function testTelegram() {
  console.log('📱 Testing Telegram Integration...\n');

  // Test 1: Conexión básica
  console.log('1️⃣ Testing connection...');
  const connectionTest = await telegramService.testConnection();
  
  if (connectionTest.success) {
    console.log('✅ Connection test successful!');
  } else {
    console.log('❌ Connection failed:', connectionTest.message);
    return;
  }

  // Test 2: Notificación de error crítico
  console.log('\n2️⃣ Testing critical error notification...');
  
  const mockLogData = {
    service_name: 'payment-gateway',
    error_level: 'FATAL',
    error_message: 'OutOfMemoryError: Java heap space exceeded during payment processing',
    stack_trace: 'java.lang.OutOfMemoryError: Java heap space\n\tat com.payment.processor.PaymentHandler.processPayment(PaymentHandler.java:145)',
    timestamp: new Date().toISOString()
  };

  const mockAiAnalysis = {
    category: 'MEMORY',
    severity_score: 10,
    confidence_score: 0.95,
    suggested_solution: 'Increase Java heap space using -Xmx flag. Monitor memory usage and investigate potential memory leaks in PaymentHandler class.',
    urgency: 'CRITICAL'
  };

  try {
    await telegramService.sendNotification(mockLogData, mockAiAnalysis);
    console.log('✅ Critical error notification sent!');
    console.log('📱 Check your Telegram for the alert message');
  } catch (error) {
    console.log('❌ Notification failed:', error.message);
  }

  // Test 3: Error no crítico (no debería enviar notificación)
  console.log('\n3️⃣ Testing non-critical error (should not notify)...');
  
  const mockLowSeverity = {
    ...mockLogData,
    error_level: 'WARN',
    error_message: 'Minor warning message'
  };

  const mockLowAnalysis = {
    ...mockAiAnalysis,
    severity_score: 5,
    urgency: 'LOW'
  };

  try {
    await telegramService.sendNotification(mockLowSeverity, mockLowAnalysis);
    console.log('✅ Low severity test completed (no notification expected)');
  } catch (error) {
    console.log('❌ Low severity test failed:', error.message);
  }

  console.log('\n🎉 Telegram testing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Telegram for the critical alert');
  console.log('2. If received → run: test-before-deploy.bat');
  console.log('3. If everything works → git push');
}

testTelegram();