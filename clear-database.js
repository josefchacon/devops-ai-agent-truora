require('dotenv').config({ path: './backend/.env' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function clearDatabase() {
  console.log('🗑️  Clearing database...\n');

  try {
    // 1. Eliminar clasificaciones de IA (primero por foreign key)
    console.log('1️⃣ Deleting AI classifications...');
    const { error: classError } = await supabase
      .from('ai_classifications')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (classError) {
      console.error('❌ Error deleting classifications:', classError);
    } else {
      console.log('✅ AI classifications deleted');
    }

    // 2. Eliminar logs de errores
    console.log('\n2️⃣ Deleting error logs...');
    const { error: logsError } = await supabase
      .from('error_logs')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (logsError) {
      console.error('❌ Error deleting logs:', logsError);
    } else {
      console.log('✅ Error logs deleted');
    }

    // 3. Eliminar reportes de incidentes
    console.log('\n3️⃣ Deleting incident reports...');
    const { error: reportsError } = await supabase
      .from('incident_reports')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (reportsError) {
      console.error('❌ Error deleting reports:', reportsError);
    } else {
      console.log('✅ Incident reports deleted');
    }

    // 4. Verificar que todo esté limpio
    console.log('\n4️⃣ Verifying cleanup...');
    
    const [logsCount, classCount, reportsCount] = await Promise.all([
      supabase.from('error_logs').select('id', { count: 'exact', head: true }),
      supabase.from('ai_classifications').select('id', { count: 'exact', head: true }),
      supabase.from('incident_reports').select('id', { count: 'exact', head: true })
    ]);

    console.log(`📊 Remaining records:`);
    console.log(`   Error logs: ${logsCount.count || 0}`);
    console.log(`   AI classifications: ${classCount.count || 0}`);
    console.log(`   Incident reports: ${reportsCount.count || 0}`);

    if ((logsCount.count || 0) === 0 && (classCount.count || 0) === 0 && (reportsCount.count || 0) === 0) {
      console.log('\n🎉 Database successfully cleared!');
      console.log('\n📋 Next steps:');
      console.log('1. Refresh dashboard - should show 0 logs');
      console.log('2. Upload demo logs for clean video');
      console.log('3. Record impressive demo with fresh data');
    } else {
      console.log('\n⚠️  Some records may still exist');
    }

  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

// Confirmación de seguridad
console.log('⚠️  WARNING: This will DELETE ALL DATA from the database!');
console.log('📊 Current environment:', process.env.SUPABASE_URL ? 'Connected to Supabase' : 'No connection');
console.log('\n🤔 Are you sure you want to continue?');
console.log('💡 Press Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

setTimeout(() => {
  clearDatabase();
}, 5000);