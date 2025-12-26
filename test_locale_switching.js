#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n========================================');
console.log('Locale Switching & Middleware Test');
console.log('========================================\n');

// Test 1: Check middleware configuration
const middlewarePath = path.join(__dirname, 'src/middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

console.log('1. Middleware Configuration:');
console.log('   ');

const hasLocales = middlewareContent.includes("locales: ['en', 'vi']");
const hasDefaultLocale = middlewareContent.includes("defaultLocale: 'vi'");
const hasMatcher = middlewareContent.includes("matcher:");

console.log(`   ${hasLocales ? '✓' : '✗'} Locales configured: ['en', 'vi']`);
console.log(`   ${hasDefaultLocale ? '✓' : '✗'} Default locale: 'vi'`);
console.log(`   ${hasMatcher ? '✓' : '✗'} Route matcher configured`);

// Test 2: Check locale-aware page structure
console.log('\n2. Locale-aware Page Structure:');
console.log('   ');

const localeDir = path.join(__dirname, 'src/app/[locale]');
const layoutExists = fs.existsSync(path.join(localeDir, 'layout.tsx'));
const pageExists = fs.existsSync(path.join(localeDir, 'page.tsx'));
const authDirExists = fs.existsSync(path.join(localeDir, 'auth'));
const dashboardDirExists = fs.existsSync(path.join(localeDir, 'dashboard'));

console.log(`   ${layoutExists ? '✓' : '✗'} Layout: src/app/[locale]/layout.tsx`);
console.log(`   ${pageExists ? '✓' : '✗'} Page: src/app/[locale]/page.tsx`);
console.log(`   ${authDirExists ? '✓' : '✗'} Auth routes: src/app/[locale]/auth/...`);
console.log(`   ${dashboardDirExists ? '✓' : '✗'} Dashboard route: src/app/[locale]/dashboard/...`);

// Test 3: Check useTranslations hook usage
console.log('\n3. Translation Hook Usage in Pages:');
console.log('   ');

const pagesWithI18n = [];
const srcDir = path.join(__dirname, 'src/app');

function findPagesWithI18n(dir, relativePath = '') {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !file.includes('node_modules')) {
      findPagesWithI18n(fullPath, relativePath + '/' + file);
    } else if (file === 'page.tsx' || file === 'layout.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('useTranslations')) {
        pagesWithI18n.push(relativePath + '/' + file);
      }
    }
  });
}

findPagesWithI18n(srcDir);

console.log(`   Found ${pagesWithI18n.length} pages/layouts using useTranslations:`);
pagesWithI18n.slice(0, 10).forEach(page => {
  console.log(`   ✓ ${page}`);
});
if (pagesWithI18n.length > 10) {
  console.log(`   ... and ${pagesWithI18n.length - 10} more`);
}

// Test 4: Check locale parameter handling
console.log('\n4. Locale Parameter Handling in Routes:');
console.log('   ');

const routeFiles = [
  'src/app/[locale]/auth/login/page.tsx',
  'src/app/[locale]/auth/register/page.tsx',
  'src/app/[locale]/dashboard/page.tsx'
];

let localeParamCheck = 0;
routeFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes('params?.locale') || content.includes('params.locale')) {
      console.log(`   ✓ ${file.replace('src/app/', '').split('/page.tsx')[0]} - locale param used`);
      localeParamCheck++;
    }
  }
});

console.log(`   Verified ${localeParamCheck} of ${routeFiles.length} files handle locale parameter`);

// Test 5: Check i18n.ts configuration
console.log('\n5. i18n Configuration (src/i18n.ts):');
console.log('   ');

const i18nPath = path.join(__dirname, 'src/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

const useGetRequestConfig = i18nContent.includes('getRequestConfig');
const hasFallback = i18nContent.includes("locale = 'vi'");
const dynamicImport = i18nContent.includes('./messages/${locale}.json');

console.log(`   ${useGetRequestConfig ? '✓' : '✗'} Uses getRequestConfig from next-intl`);
console.log(`   ${hasFallback ? '✓' : '✗'} Fallback to Vietnamese locale`);
console.log(`   ${dynamicImport ? '✓' : '✗'} Dynamic message imports by locale`);

// Test 6: Check translation files exist
console.log('\n6. Translation Files:');
console.log('   ');

const messagesDir = path.join(__dirname, 'src/messages');
const enExists = fs.existsSync(path.join(messagesDir, 'en.json'));
const viExists = fs.existsSync(path.join(messagesDir, 'vi.json'));

if (enExists) {
  const enData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));
  console.log(`   ✓ en.json (${Object.keys(enData).length} top-level keys)`);
}
if (viExists) {
  const viData = JSON.parse(fs.readFileSync(path.join(messagesDir, 'vi.json'), 'utf8'));
  console.log(`   ✓ vi.json (${Object.keys(viData).length} top-level keys)`);
}

// Summary
console.log('\n========================================');
console.log('Summary');
console.log('========================================\n');

const allChecks = [
  hasLocales,
  hasDefaultLocale,
  hasMatcher,
  layoutExists,
  pageExists,
  authDirExists,
  dashboardDirExists,
  pagesWithI18n.length > 0,
  localeParamCheck > 0,
  useGetRequestConfig,
  hasFallback,
  dynamicImport,
  enExists,
  viExists
];

const passedChecks = allChecks.filter(check => check).length;
const totalChecks = allChecks.length;

console.log(`Passed: ${passedChecks}/${totalChecks} checks\n`);

if (passedChecks === totalChecks) {
  console.log('SUCCESS: Locale switching infrastructure is properly configured!\n');
  process.exit(0);
} else {
  console.log('WARNING: Some checks failed. Review configuration.\n');
  process.exit(1);
}
