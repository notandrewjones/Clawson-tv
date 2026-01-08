// build.js - Injects environment variables into the HTML at build time
const fs = require('fs');
const path = require('path');

// Read the template
const templatePath = path.join(__dirname, 'src', 'index.html');
const outputPath = path.join(__dirname, 'public', 'index.html');

let html = fs.readFileSync(templatePath, 'utf8');

// Replace environment variable placeholders
const envVars = {
  'SUPABASE_URL': process.env.SUPABASE_URL || '',
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY || '',
  'RESI_EMBED_ID': process.env.RESI_EMBED_ID || '70c58906-58c6-4306-bdd8-813af42557d5'
};

for (const [key, value] of Object.entries(envVars)) {
  html = html.replace(new RegExp(`__${key}__`, 'g'), value);
}

// Ensure public directory exists
if (!fs.existsSync(path.join(__dirname, 'public'))) {
  fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
}

// Write the output
fs.writeFileSync(outputPath, html);

console.log('Build complete! Environment variables injected.');
console.log('SUPABASE_URL:', envVars.SUPABASE_URL ? '✓ Set' : '✗ Missing');
console.log('SUPABASE_ANON_KEY:', envVars.SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
