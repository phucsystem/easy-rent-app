#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load translation files
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/messages/en.json'), 'utf8'));
const viTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/messages/vi.json'), 'utf8'));

// Collect all keys from translations
function getAllKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

// Get all keys
const enKeys = getAllKeys(enTranslations).sort();
const viKeys = getAllKeys(viTranslations).sort();

let hasErrors = false;

console.log('\n========================================');
console.log('i18n Translation Verification Report');
console.log('========================================\n');

// Check for keys in EN but missing in VI
const missingInVi = enKeys.filter(k => !viKeys.includes(k));
if (missingInVi.length > 0) {
  console.log('ERROR: Keys in en.json but missing in vi.json:');
  missingInVi.forEach(k => console.log(`  - ${k}`));
  console.log();
  hasErrors = true;
}

// Check for keys in VI but missing in EN
const missingInEn = viKeys.filter(k => !enKeys.includes(k));
if (missingInEn.length > 0) {
  console.log('ERROR: Keys in vi.json but missing in en.json:');
  missingInEn.forEach(k => console.log(`  - ${k}`));
  console.log();
  hasErrors = true;
}

if (!hasErrors) {
  console.log('SUCCESS: All translation keys are present in both files!');
  console.log(`Total keys: ${enKeys.length}\n`);
}

// Display statistics
console.log('========================================');
console.log('Translation Statistics');
console.log('========================================');
console.log(`English keys: ${enKeys.length}`);
console.log(`Vietnamese keys: ${viKeys.length}`);
console.log(`Common keys: ${enKeys.filter(k => viKeys.includes(k)).length}\n`);

// List all keys
console.log('All Translation Keys:');
console.log('----------------------------------------');
enKeys.forEach(k => {
  const status = viKeys.includes(k) ? '✓' : '✗';
  console.log(`${status} ${k}`);
});

process.exit(hasErrors ? 1 : 0);
