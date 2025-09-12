require('dotenv').config({ path: './backend/.env' });

console.log('🔍 Verificando configuración...\n');

const checks = [
  { name: 'SUPABASE_URL', value: process.env.SUPABASE_URL },
  { name: 'SUPABASE_ANON_KEY', value: process.env.SUPABASE_ANON_KEY },
  { name: 'GEMINI_API_KEY', value: process.env.GEMINI_API_KEY },
  { name: 'PORT', value: process.env.PORT }
];

let allGood = true;

checks.forEach(check => {
  if (!check.value || check.value.includes('your_') || check.value.includes('xxxxxxxxx')) {
    console.log(`❌ ${check.name}: No configurado correctamente`);
    allGood = false;
  } else {
    console.log(`✅ ${check.name}: Configurado`);
  }
});

if (allGood) {
  console.log('\n🎉 ¡Configuración completa! Puedes continuar con el testing.');
} else {
  console.log('\n⚠️  Completa la configuración antes de continuar.');
}

console.log('\n📝 Próximos pasos:');
console.log('1. cd backend && npm run dev');
console.log('2. cd frontend && npm run dev');
console.log('3. npm test');