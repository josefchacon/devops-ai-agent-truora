const axios = require('axios');

const BOT_TOKEN = '8461688792:AAEfoMPlzSxVlBPynm8Vv3J4oWnqwQhFVSY';

async function getChatId() {
  try {
    console.log('🔍 Obteniendo Chat ID...\n');
    
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
    
    if (response.data.ok && response.data.result.length > 0) {
      const updates = response.data.result;
      console.log('✅ Updates encontrados:\n');
      
      updates.forEach((update, index) => {
        if (update.message && update.message.chat) {
          console.log(`Update ${index + 1}:`);
          console.log(`  Chat ID: ${update.message.chat.id}`);
          console.log(`  Nombre: ${update.message.chat.first_name || 'N/A'}`);
          console.log(`  Tipo: ${update.message.chat.type}`);
          console.log(`  Mensaje: "${update.message.text}"`);
          console.log('');
        }
      });
      
      // Mostrar el Chat ID más reciente
      const latestUpdate = updates[updates.length - 1];
      if (latestUpdate.message && latestUpdate.message.chat) {
        console.log('🎯 TU CHAT ID ES:', latestUpdate.message.chat.id);
        console.log('\n📝 Agrega esto a tu .env:');
        console.log(`TELEGRAM_CHAT_ID=${latestUpdate.message.chat.id}`);
      }
      
    } else {
      console.log('⚠️ No se encontraron mensajes.');
      console.log('Asegúrate de:');
      console.log('1. Haber enviado /start al bot');
      console.log('2. Esperar 1-2 minutos');
      console.log('3. Ejecutar este script nuevamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.response) {
      console.log('Respuesta del servidor:', error.response.data);
    }
  }
}

getChatId();