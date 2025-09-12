const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const aiService = require('../services/aiService');

// Analizar log específico
router.post('/analyze/:logId', async (req, res) => {
  try {
    const { logId } = req.params;
    
    const { data: log, error } = await supabase
      .from('error_logs')
      .select('*')
      .eq('id', logId)
      .single();

    if (error) throw error;
    if (!log) return res.status(404).json({ error: 'Log not found' });

    const analysis = await aiService.analyzeErrorLog(log);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing log:', error);
    res.status(500).json({ error: 'Error analyzing log' });
  }
});

// Generar reporte de incidentes
router.post('/generate-report', async (req, res) => {
  try {
    const { data: logs, error: logsError } = await supabase
      .from('error_logs')
      .select(`
        *,
        ai_classifications (*)
      `)
      .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('timestamp', { ascending: false });

    if (logsError) throw logsError;

    const classifications = logs.flatMap(log => log.ai_classifications);
    const report = await aiService.generateIncidentReport(logs, classifications);

    const { data: savedReport, error: saveError } = await supabase
      .from('incident_reports')
      .insert({
        title: report.title,
        summary: report.summary,
        affected_services: report.affected_services,
        severity: report.severity,
        error_count: logs.length,
        report_data: report
      })
      .select()
      .single();

    if (saveError) throw saveError;

    res.json(savedReport);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Error generating report' });
  }
});

module.exports = router;