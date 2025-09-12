const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

class AIService {
  async analyzeErrorLog(errorLog) {
    const prompt = `Eres un experto DevOps AI que analiza logs de errores. Analiza el siguiente log y proporciona un análisis estructurado.

Log de error:
- Servicio: ${errorLog.service_name}
- Nivel: ${errorLog.error_level}
- Mensaje: ${errorLog.error_message}
- Stack Trace: ${errorLog.stack_trace || 'N/A'}
- Timestamp: ${errorLog.timestamp || new Date().toISOString()}

Proporciona:
1. Categoría del error (DATABASE, NETWORK, AUTH, MEMORY, DISK, APPLICATION, SECURITY, CONFIG)
2. Nivel de severidad (1-10, donde 10 es crítico)
3. Solución sugerida específica y accionable
4. Confianza en el análisis (0-1)
5. Posibles causas raíz

Responde ÚNICAMENTE en formato JSON válido:
{
  "category": "string",
  "severity_score": number,
  "suggested_solution": "string",
  "confidence_score": number,
  "root_causes": ["string"],
  "urgency": "LOW|MEDIUM|HIGH|CRITICAL"
}`;

    try {
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
          responseMimeType: 'application/json'
        }
      });

      const response = await result.response;
      const analysis = JSON.parse(response.text());
      console.log(`✅ Análisis Gemini completado para ${errorLog.service_name}`);
      return analysis;
      
    } catch (error) {
      console.log(`⚠️ Error con Gemini, usando fallback: ${error.message}`);
      return this.simulateAIAnalysis(errorLog);
    }
  }

  simulateAIAnalysis(errorLog) {
    const { service_name, error_level, error_message, stack_trace } = errorLog;
    
    // Lógica de clasificación simple
    let category = 'APPLICATION';
    let severity = 5;
    let solution = 'Revisar logs detallados y reintentar la operación';
    
    if (error_message.toLowerCase().includes('database') || error_message.toLowerCase().includes('connection')) {
      category = 'DATABASE';
      severity = 7;
      solution = 'Verificar conexión a base de datos y configuración de red';
    } else if (error_message.toLowerCase().includes('memory') || error_message.toLowerCase().includes('heap')) {
      category = 'MEMORY';
      severity = 8;
      solution = 'Aumentar memoria asignada o optimizar uso de memoria';
    } else if (error_message.toLowerCase().includes('network') || error_message.toLowerCase().includes('timeout')) {
      category = 'NETWORK';
      severity = 6;
      solution = 'Verificar conectividad de red y configuración de timeouts';
    } else if (error_message.toLowerCase().includes('auth') || error_message.toLowerCase().includes('permission')) {
      category = 'AUTH';
      severity = 7;
      solution = 'Verificar credenciales y permisos de acceso';
    }
    
    if (error_level === 'FATAL') severity = Math.min(severity + 2, 10);
    if (error_level === 'WARN') severity = Math.max(severity - 2, 1);
    
    return {
      category,
      severity_score: severity,
      suggested_solution: solution,
      confidence_score: 0.85,
      reasoning: `Análisis basado en patrones de error en ${service_name} con nivel ${error_level}`
    };
  }

  async generateIncidentReport(errorLogs, classifications) {
    const services = [...new Set(errorLogs.map(log => log.service_name))];
    const timeRange = this.getTimeRange(errorLogs);
    const severityDistribution = this.getSeverityDistribution(classifications);
    
    const prompt = `Eres un experto DevOps que genera reportes de incidentes. Analiza los siguientes datos y genera un reporte profesional.

Datos del incidente:
- Servicios afectados: ${services.join(', ')}
- Período: ${timeRange}
- Total de errores: ${errorLogs.length}
- Distribución de severidad: ${JSON.stringify(severityDistribution)}
- Categorías principales: ${this.getTopCategories(classifications)}

Errores recientes (muestra):
${errorLogs.slice(0, 3).map(log => `- ${log.service_name}: ${log.error_message}`).join('\n')}

Genera un reporte ejecutivo que incluya:
1. Título descriptivo del incidente
2. Resumen ejecutivo (2-3 líneas)
3. Impacto en servicios
4. Severidad general del incidente
5. Recomendaciones específicas y accionables
6. Próximos pasos sugeridos

Responde ÚNICAMENTE en formato JSON válido:
{
  "title": "string",
  "summary": "string",
  "affected_services": ["string"],
  "severity": "LOW|MEDIUM|HIGH|CRITICAL",
  "impact_assessment": "string",
  "recommendations": ["string"],
  "next_steps": ["string"],
  "estimated_resolution_time": "string"
}`;

    try {
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1200,
          responseMimeType: 'application/json'
        }
      });

      const response = await result.response;
      const report = JSON.parse(response.text());
      console.log(`✅ Reporte Gemini generado para ${services.length} servicios`);
      return report;
      
    } catch (error) {
      console.log(`⚠️ Error generando reporte con Gemini: ${error.message}`);
      return this.generateFallbackReport(errorLogs, classifications);
    }
  }

  getTimeRange(errorLogs) {
    if (errorLogs.length === 0) return 'N/A';
    const timestamps = errorLogs.map(log => new Date(log.timestamp || log.created_at));
    const earliest = new Date(Math.min(...timestamps));
    const latest = new Date(Math.max(...timestamps));
    return `${earliest.toLocaleString()} - ${latest.toLocaleString()}`;
  }

  getSeverityDistribution(classifications) {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 };
    classifications.forEach(c => {
      if (c.severity_score >= 8) distribution.critical++;
      else if (c.severity_score >= 6) distribution.high++;
      else if (c.severity_score >= 4) distribution.medium++;
      else distribution.low++;
    });
    return distribution;
  }

  getTopCategories(classifications) {
    const categories = {};
    classifications.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([cat, count]) => `${cat}(${count})`)
      .join(', ');
  }

  generateFallbackReport(errorLogs, classifications) {
    const services = [...new Set(errorLogs.map(log => log.service_name))];
    const avgSeverity = classifications.reduce((sum, c) => sum + c.severity_score, 0) / classifications.length;
    
    let severity = 'MEDIUM';
    if (avgSeverity >= 8) severity = 'CRITICAL';
    else if (avgSeverity >= 6) severity = 'HIGH';
    else if (avgSeverity < 4) severity = 'LOW';
    
    return {
      title: `Incidente Multi-Servicio - ${new Date().toLocaleDateString()}`,
      summary: `Detectados ${errorLogs.length} errores en ${services.length} servicio(s) con severidad promedio de ${avgSeverity.toFixed(1)}/10`,
      affected_services: services,
      severity,
      impact_assessment: `Impacto ${severity.toLowerCase()} en ${services.length} servicios críticos`,
      recommendations: [
        'Revisar logs detallados de servicios afectados',
        'Implementar monitoreo proactivo mejorado',
        'Evaluar escalamiento de recursos si es necesario',
        'Configurar alertas automáticas para patrones similares'
      ],
      next_steps: [
        'Investigación inmediata de causa raíz',
        'Implementar fix temporal si es posible',
        'Programar postmortem del incidente'
      ],
      estimated_resolution_time: severity === 'CRITICAL' ? '1-2 horas' : '2-4 horas'
    };
  }
}

module.exports = new AIService();