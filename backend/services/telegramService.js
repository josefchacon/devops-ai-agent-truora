const axios = require('axios');

class TelegramService {
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
    this.baseURL = `https://api.telegram.org/bot${this.botToken}`;
  }

  async sendNotification(logData, aiAnalysis) {
    if (!this.botToken || !this.chatId) {
      console.log('⚠️ Telegram not configured, skipping notification');
      return;
    }

    try {
      // Solo notificar errores críticos (severidad >= 8)
      if (aiAnalysis.severity_score < 8) {
        return;
      }

      const message = this.formatMessage(logData, aiAnalysis);
      
      await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });

      console.log('✅ Telegram notification sent successfully');
    } catch (error) {
      console.error('❌ Error sending Telegram notification:', error.message);
    }
  }

  formatMessage(logData, aiAnalysis) {
    const urgencyEmoji = this.getUrgencyEmoji(aiAnalysis.severity_score);
    const categoryEmoji = this.getCategoryEmoji(aiAnalysis.category);
    
    return `
${urgencyEmoji} <b>ALERTA CRÍTICA - DevOps AI Agent</b>

${categoryEmoji} <b>Servicio:</b> ${logData.service_name}
⚠️ <b>Nivel:</b> ${logData.error_level}
📊 <b>Severidad:</b> ${aiAnalysis.severity_score}/10
🎯 <b>Confianza:</b> ${(aiAnalysis.confidence_score * 100).toFixed(1)}%
📂 <b>Categoría:</b> ${aiAnalysis.category}

🔍 <b>Error:</b>
<code>${logData.error_message}</code>

💡 <b>Solución Sugerida:</b>
${aiAnalysis.suggested_solution.substring(0, 200)}...

⏰ <b>Timestamp:</b> ${new Date().toLocaleString('es-ES')}

🔗 <a href="https://devops-ai-agent-truora.vercel.app">Ver Dashboard</a>
    `.trim();
  }

  getUrgencyEmoji(severity) {
    if (severity >= 9) return '🚨';
    if (severity >= 8) return '⚠️';
    return '🔔';
  }

  getCategoryEmoji(category) {
    const emojis = {
      'DATABASE': '🗄️',
      'MEMORY': '💾',
      'NETWORK': '🌐',
      'AUTH': '🔐',
      'APPLICATION': '⚙️',
      'SECURITY': '🛡️',
      'CONFIG': '📋'
    };
    return emojis[category] || '📋';
  }

  // Método para testing
  async testConnection() {
    if (!this.botToken || !this.chatId) {
      return { success: false, message: 'Bot token or chat ID not configured' };
    }

    try {
      await axios.post(`${this.baseURL}/sendMessage`, {
        chat_id: this.chatId,
        text: '🤖 DevOps AI Agent - Test de conexión exitoso!'
      });
      return { success: true, message: 'Test message sent successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = new TelegramService();