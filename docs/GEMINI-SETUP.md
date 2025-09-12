# Configuración con Google Gemini

## 🚀 Obtener API Key de Gemini (GRATIS)

### 1. Crear API Key
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Haz clic en "Create API Key"
3. Selecciona tu proyecto de Google Cloud (o crea uno nuevo)
4. Copia la API Key: `AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Configurar Variables de Entorno
Edita `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Ventajas de Gemini vs OpenAI

| Característica | Gemini 1.5 Flash | GPT-4 |
|----------------|-------------------|-------|
| **Costo** | GRATIS (15 req/min) | $0.03/request |
| **Velocidad** | Muy rápido | Moderado |
| **Precisión** | Excelente | Excelente |
| **Límites** | 1M tokens/día gratis | Requiere pago |
| **JSON Mode** | ✅ Nativo | ✅ Disponible |

### 4. Límites Gratuitos de Gemini
- **15 requests por minuto**
- **1,500 requests por día**
- **1 millón de tokens por día**
- **Perfecto para el challenge!**

### 5. Modelos Disponibles
- `gemini-1.5-flash` - Rápido y eficiente (recomendado)
- `gemini-1.5-pro` - Más potente pero más lento
- `gemini-1.0-pro` - Versión estable

### 6. Configuración Implementada

#### Análisis de Logs:
```javascript
generationConfig: {
  temperature: 0.2,        // Respuestas consistentes
  maxOutputTokens: 800,    // Suficiente para análisis
  responseMimeType: 'application/json'  // JSON forzado
}
```

#### Reportes de Incidentes:
```javascript
generationConfig: {
  temperature: 0.3,        // Algo más creativo
  maxOutputTokens: 1200,   // Reportes detallados
  responseMimeType: 'application/json'
}
```

### 7. Testing con Gemini

```bash
# Verificar configuración
node verify-config.js

# Test completo
npm test
```

### 8. Ventajas para el Challenge

✅ **Completamente GRATIS**
✅ **Sin necesidad de tarjeta de crédito**
✅ **Límites generosos para demo**
✅ **Respuestas JSON nativas**
✅ **Velocidad excelente**
✅ **Calidad comparable a GPT-4**

### 9. Fallback Inteligente
Si Gemini falla (límites excedidos):
- Automáticamente usa análisis basado en patrones
- Logs claros del error
- Servicio continúa funcionando

### 10. Optimizaciones Implementadas

#### Rate Limiting Inteligente:
- Respeta límites de 15 req/min
- Cola automática si se excede
- Retry con backoff exponencial

#### Caché de Respuestas:
- Errores similares reutilizan análisis
- Reduce llamadas a la API
- Mejora velocidad de respuesta

## 🎯 Resultado

Con Gemini tendrás:
- **IA de nivel empresarial GRATIS**
- **Análisis precisos y rápidos**
- **Reportes profesionales**
- **Sin costos ocultos**
- **Perfecto para el challenge**

¡Ideal para impresionar sin gastar dinero! 💰