const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Obtener reportes
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Error fetching reports' });
  }
});

// Obtener métricas del dashboard
router.get('/metrics', async (req, res) => {
  try {
    const [logsCount, classificationsCount, reportsCount] = await Promise.all([
      supabase.from('error_logs').select('*', { count: 'exact', head: true }),
      supabase.from('ai_classifications').select('*', { count: 'exact', head: true }),
      supabase.from('incident_reports').select('*', { count: 'exact', head: true })
    ]);

    const { data: severityData } = await supabase
      .from('ai_classifications')
      .select('severity_score')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const { data: categoryData } = await supabase
      .from('ai_classifications')
      .select('category')
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    res.json({
      totalLogs: logsCount.count,
      totalClassifications: classificationsCount.count,
      totalReports: reportsCount.count,
      avgSeverity: severityData.length > 0 
        ? (severityData.reduce((sum, item) => sum + item.severity_score, 0) / severityData.length).toFixed(1)
        : 0,
      topCategories: categoryData.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Error fetching metrics' });
  }
});

module.exports = router;