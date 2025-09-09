const fs = require('fs');
const path = require('path');

// Simple deployment verification script
console.log('Deployment Verification Script');
console.log('==============================');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('✅ Build output (dist) folder exists');

  // List contents
  const files = fs.readdirSync(distPath);
  console.log('📁 Files in dist folder:');
  files.forEach((file) => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    console.log(`   - ${file} (${stats.size} bytes)`);
  });

  // Check for index.html
  if (files.includes('index.html')) {
    console.log('✅ index.html found - ready for deployment');
  } else {
    console.log('❌ index.html missing - build may have failed');
  }
} else {
  console.log('❌ Build output folder (dist) not found');
  console.log('   Run "npm run build" first');
}

console.log('\nNext steps:');
console.log('1. Ensure build is successful');
console.log('2. Use Netlify CLI: npx netlify deploy --prod --dir=dist');
console.log('3. Or drag & drop dist folder to Netlify dashboard');
