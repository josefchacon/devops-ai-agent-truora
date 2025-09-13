# 📱 Configuración de Telegram

## 🤖 **Crear Bot de Telegram**

### **1. Crear Bot:**
1. Abre Telegram
2. Busca: `@BotFather`
3. Envía: `/newbot`
4. Nombre del bot: `DevOps AI Agent Bot`
5. Username: `devops_ai_agent_bot` (debe ser único)
6. **Copia el token**: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### **2. Obtener Chat ID:**

#### **Opción A - Chat Personal:**
1. Envía mensaje a tu bot: `/start`
2. Ve a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
3. Busca `"chat":{"id":123456789`
4. **Copia el chat ID**: `123456789`

#### **Opción B - Grupo:**
1. Agrega el bot a un grupo
2. Envía: `/start` en el grupo
3. Ve a: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
4. **Chat ID será negativo**: `-123456789`

## ⚙️ **Configurar Variables**

### **En .env local:**
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### **En Railway (Producción):**
1. Ve a tu proyecto Railway
2. **Variables** → **New Variable**
3. Agregar:
   ```
   TELEGRAM_BOT_TOKEN = 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID = 123456789
   ```

## 🧪 **Testing**

### **1. Test Local:**
```bash
# Ejecutar backend
cd backend && npm run dev

# En otro terminal, probar endpoint
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "test-telegram",
    "error_level": "FATAL",
    "error_message": "Test critical error for Telegram",
    "raw_log": "2024-01-15 10:30:00 FATAL Test error"
  }'
```

### **2. Verificar Notificación:**
Deberías recibir mensaje en Telegram con:
- 🚨 Alerta crítica
- 📊 Severidad y confianza
- 💡 Solución sugerida
- 🔗 Link al dashboard

## 📋 **Formato de Notificación**

```
🚨 ALERTA CRÍTICA - DevOps AI Agent

🗄️ Servicio: payment-gateway
⚠️ Nivel: FATAL
📊 Severidad: 10/10
🎯 Confianza: 95.0%
📂 Categoría: MEMORY

🔍 Error:
OutOfMemoryError: Java heap space exceeded

💡 Solución Sugerida:
Increase Java heap space using -Xmx flag...

⏰ Timestamp: 15/1/2024 14:30:25

🔗 Ver Dashboard
```

## 🎯 **Configuración para Demo**

### **Solo errores críticos:**
- Severidad >= 8/10
- Niveles: FATAL, ERROR críticos
- No spam con warnings

### **Mensaje profesional:**
- Emojis para categorías
- Información técnica precisa
- Link directo al dashboard
- Timestamp en español

## 🔧 **Troubleshooting**

### **Bot no responde:**
- Verificar token correcto
- Bot debe estar iniciado (`/start`)

### **No llegan notificaciones:**
- Verificar chat ID correcto
- Revisar logs del backend
- Probar con severidad >= 8

### **Error 403:**
- Usuario debe iniciar conversación con bot
- En grupos, bot debe ser admin