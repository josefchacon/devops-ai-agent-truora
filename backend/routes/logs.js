const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const aiService = require('../services/aiService');

// Subir logs de errores
router.post('/', async (req, res) => {
  try {
    const { service_name, error_level, error_message, stack_trace, raw_log } = req.body;

    // Insertar log en base de datos
    const { data: logData, error: logError } = await supabase
      .from('error_logs')
      .insert({
        service_name,
        error_level,
        error_message,
        stack_trace,
        raw_log,
        ip_address: req.ip,
        user_agent: req.get('User-Agent')
      })
      .select()
      .single();

    if (logError) throw logError;

    // Analizar con IA
    const startTime = Date.now();
    const aiAnalysis = await aiService.analyzeErrorLog(logData);
    const processingTime = Date.now() - startTime;

    // Guardar clasificación de IA
    const { data: classificationData, error: classError } = await supabase
      .from('ai_classifications')
      .insert({
        error_log_id: logData.id,
        category: aiAnalysis.category,
        severity_score: aiAnalysis.severity_score,
        confidence_score: aiAnalysis.confidence_score,
        suggested_solution: aiAnalysis.suggested_solution,
        processing_time_ms: processingTime
      })
      .select()
      .single();

    if (classError) throw classError;

    res.json({
      log: logData,
      classification: classificationData,
      ai_analysis: aiAnalysis
    });
  } catch (error) {
    console.error('Error processing log:', error);
    res.status(500).json({ error: 'Error processing log' });
  }
});

// Obtener logs con paginación
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, service, level } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('error_logs')
      .select(`
        *,
        ai_classifications (*)
      `)
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (service) query = query.eq('service_name', service);
    if (level) query = query.eq('error_level', level);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

module.exports = router;