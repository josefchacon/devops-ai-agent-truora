# Guía de Despliegue

## 1. Despliegue en Railway (Backend)

### Paso a paso:
1. Crear cuenta en [Railway](https://railway.app)
2. Conectar repositorio GitHub
3. Seleccionar carpeta `backend`
4. Configurar variables de entorno:
   ```
   SUPABASE_URL=tu_supabase_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   OPENAI_API_KEY=tu_openai_api_key
   PORT=3001
   ```
5. Deploy automático

### URL del backend desplegado:
```
https://tu-proyecto.railway.app
```

## 2. Despliegue en Vercel (Frontend)

### Paso a paso:
1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio GitHub
3. Configurar:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Variables de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```
5. Deploy automático

## 3. Configuración de Supabase

### Crear proyecto:
1. Ir a [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ejecutar SQL del archivo `database/schema.sql`
4. Opcional: Ejecutar `database/test-data.sql` para datos de prueba

### Obtener credenciales:
- URL: Settings > API > Project URL
- Anon Key: Settings > API > Project API keys

## 4. Testing Post-Despliegue

### Test manual:
1. Abrir frontend desplegado
2. Ir a "Upload Logs"
3. Subir log de prueba
4. Verificar análisis de IA
5. Revisar dashboard

### Test con curl:
```bash
curl -X POST https://tu-backend.railway.app/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "service_name": "test-service",
    "error_level": "ERROR",
    "error_message": "Test error",
    "raw_log": "2024-01-15 10:30:00 ERROR Test error message"
  }'
```

## 5. Monitoreo

### Logs de Railway:
- Dashboard > Deployments > View Logs

### Métricas de Vercel:
- Dashboard > Analytics

### Supabase:
- Dashboard > Logs
- Dashboard > Database > Tables