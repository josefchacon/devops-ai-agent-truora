# Guía de Configuración - DevOps AI Agent

## Prerrequisitos

- Node.js 18+
- Cuenta en Supabase
- API Key de OpenAI
- Cuenta en n8n (opcional)
- Bot de Telegram (opcional)

## 1. Configuración de Supabase

1. Crear nuevo proyecto en [Supabase](https://supabase.com)
2. Ejecutar el script SQL en `database/schema.sql`
3. Obtener URL y Anon Key del proyecto

## 2. Configuración del Backend

```bash
cd backend
npm install
cp .env.example .env
```

Editar `.env`:
```
SUPABASE_URL=tu_supabase_url
SUPABASE_ANON_KEY=tu_supabase_anon_key
OPENAI_API_KEY=tu_openai_api_key
PORT=3001
```

Iniciar servidor:
```bash
npm run dev
```

## 3. Configuración del Frontend

```bash
cd frontend
npm install
npm run dev
```

## 4. Configuración de n8n (Opcional)

1. Instalar n8n: `npm install -g n8n`
2. Iniciar: `n8n start`
3. Importar workflow desde `n8n-workflows/log-processing-workflow.json`
4. Configurar credenciales:
   - Supabase: URL y Service Key
   - OpenAI: API Key
   - Telegram: Bot Token

## 5. Testing

### Test de API:
```bash
curl -X POST http://localhost:3001/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "user-service",
    "error_level": "ERROR",
    "error_message": "Database connection failed",
    "raw_log": "2024-01-15 10:30:00 ERROR: Connection to database failed after 30s timeout"
  }'
```

### Test de Frontend:
1. Abrir http://localhost:5173
2. Navegar a "Upload Logs"
3. Subir un log de prueba
4. Verificar análisis en Dashboard

## 6. Despliegue

### Backend (Railway/Render):
1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### Frontend (Vercel/Netlify):
1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Deploy automático

### Base de datos:
- Supabase maneja el hosting automáticamente

## Troubleshooting

### Error: "OpenAI API Key not found"
- Verificar que la variable OPENAI_API_KEY esté configurada
- Revisar que la key sea válida y tenga créditos

### Error: "Supabase connection failed"
- Verificar URL y Anon Key
- Confirmar que las tablas existan en la base de datos

### Error: "CORS issues"
- Verificar configuración de CORS en el backend
- Confirmar que el frontend esté haciendo requests a la URL correcta