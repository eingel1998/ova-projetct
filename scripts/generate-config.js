const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '..', 'public', 'config.template.json');
const outputPath = path.join(__dirname, '..', 'public', 'config.json');

let config = fs.readFileSync(templatePath, 'utf8');

// Replace placeholders with Vercel env vars (or default to empty for local)
config = config
  .replace('__SUPABASE_URL__', process.env.SUPABASE_URL || '')
  .replace('__SUPABASE_ANON_KEY__', process.env.SUPABASE_ANON_KEY || '');

fs.writeFileSync(outputPath, config);
console.log('✅ config.json generado con variables de entorno');
