const fs = require('fs');
const path = require('path');

// Load translation files to get valid keys
const enTranslations = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/messages/en.json'), 'utf8'));

function getAllValidKeys(obj, prefix = '') {
  const keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllValidKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const validKeys = getAllValidKeys(enTranslations);

// Extract used keys from source files
const usedKeys = new Set();
const srcDir = path.join(__dirname, 'src');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !file.includes('node_modules')) {
      walkDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Match t('...') or t("...")
      const regex = /t\(['"]([^'"]+)['"]\)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    }
  });
}

walkDir(srcDir);

console.log('\n========================================');
console.log('Translation Key Usage Verification');
console.log('========================================\n');

const usedKeyArray = Array.from(usedKeys).sort();
const unusedKeys = validKeys.filter(k => !usedKeys.has(k));
const invalidKeys = usedKeyArray.filter(k => !validKeys.includes(k));

console.log(`Total valid keys in translation files: ${validKeys.length}`);
console.log(`Total unique keys used in code: ${usedKeyArray.length}`);
console.log(`Unused keys: ${unusedKeys.length}`);
console.log(`Invalid keys (used but not defined): ${invalidKeys.length}\n`);

if (invalidKeys.length > 0) {
  console.log('ERROR: Invalid keys found (used but not defined):');
  invalidKeys.forEach(k => console.log(`  - ${k}`));
  console.log();
} else {
  console.log('SUCCESS: All used keys are valid!\n');
}

if (unusedKeys.length > 0) {
  console.log(`Warning: ${unusedKeys.length} unused keys defined but not used in code:\n`);
}

console.log('Keys used in code:');
console.log('----------------------------------------');
usedKeyArray.forEach(k => {
  const status = validKeys.includes(k) ? '✓' : '✗';
  console.log(`${status} ${k}`);
});

process.exit(invalidKeys.length > 0 ? 1 : 0);
