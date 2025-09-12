# Testing Local Completo

## 🧪 Plan de Pruebas

### **Preparación**
1. **Verificar servicios corriendo**:
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   
   # Terminal 3: Testing
   node test-complete.js
   ```

### **Tests Automatizados**

#### ✅ **Test 1: Health Check**
- Verifica que el backend esté corriendo
- Endpoint: `GET /health`

#### ✅ **Test 2: Database Connection**
- Verifica conexión a Supabase
- Endpoint: `GET /api/logs`

#### ✅ **Test 3: AI Analysis**
- 4 escenarios diferentes:
  - Database Error
  - Memory Error  
  - Network Error
  - Authentication Error
- Verifica respuestas de Gemini

#### ✅ **Test 4: Dashboard Metrics**
- Métricas en tiempo real
- Endpoint: `GET /api/reports/metrics`

#### ✅ **Test 5: Report Generation**
- Generación automática de reportes
- Endpoint: `POST /api/ai/generate-report`

#### ✅ **Test 6: Frontend Connection**
- Verifica acceso a http://localhost:5173

### **Tests Manuales**

#### 🖱️ **Frontend Testing**
1. **Abrir** http://localhost:5173
2. **Navegar** entre Dashboard y Upload Logs
3. **Subir log** desde formulario:
   ```
   Service: test-service
   Level: ERROR
   Message: Test error message
   Raw Log: 2024-01-15 10:30:00 ERROR Test error
   ```
4. **Verificar** análisis de IA en tiempo real
5. **Revisar** dashboard actualizado

#### 📊 **Dashboard Testing**
- Métricas actualizadas
- Gráficos funcionando
- Logs recientes visibles
- Categorías distribuidas

### **Criterios de Éxito**

#### ✅ **Backend**
- Health check: 200 OK
- Supabase conectado
- Gemini respondiendo
- Análisis < 5 segundos
- JSON válido siempre

#### ✅ **Frontend**
- Carga sin errores
- Formulario funcional
- Dashboard interactivo
- Gráficos renderizando
- Responsive design

#### ✅ **IA (Gemini)**
- Categorización precisa
- Severidad lógica (1-10)
- Soluciones específicas
- Confianza > 80%
- Tiempo < 3 segundos

### **Troubleshooting**

#### ❌ **Error: Backend no responde**
```bash
# Verificar puerto
netstat -ano | findstr :3001
# Reiniciar backend
cd backend && npm run dev
```

#### ❌ **Error: Gemini API**
```bash
# Verificar API key
node verify-config.js
# Revisar límites de Gemini
```

#### ❌ **Error: Supabase**
```bash
# Verificar conexión
# Revisar variables en .env
# Confirmar tablas creadas
```

#### ❌ **Error: Frontend**
```bash
# Limpiar caché
cd frontend && npm run dev
# Verificar proxy en vite.config.js
```

### **Checklist Pre-Despliegue**

- [ ] Todos los tests automatizados pasan
- [ ] Frontend carga correctamente
- [ ] Upload de logs funciona
- [ ] Dashboard muestra datos
- [ ] Análisis de IA preciso
- [ ] Reportes se generan
- [ ] No hay errores en consola
- [ ] Responsive en móvil
- [ ] Performance aceptable
- [ ] Documentación completa

### **Métricas Esperadas**

| Métrica | Valor Esperado |
|---------|----------------|
| Tiempo de análisis | < 3 segundos |
| Precisión de IA | > 90% |
| Uptime backend | 100% |
| Carga frontend | < 2 segundos |
| Errores | 0 |

¡Una vez que todos los tests pasen, estarás listo para producción! 🚀