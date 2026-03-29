const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const outputDir = __dirname;

function buildFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace include tags: <!-- @include components/filename.html -->
  const regex = /<!--\s*@include\s+([^ ]+)\s*-->/g;
  content = content.replace(regex, (match, includePath) => {
    const fullIncludePath = path.join(srcDir, includePath);
    if (fs.existsSync(fullIncludePath)) {
      console.log(`  Included: ${includePath}`);
      return fs.readFileSync(fullIncludePath, 'utf-8');
    } else {
      console.warn(`  Warning: Could not find ${includePath}`);
      return match;
    }
  });

  const baseName = path.basename(filePath);
  const outputPath = path.join(outputDir, baseName);
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`Built: ${baseName}`);
}

// Find all HTML files in src/ (not including subdirectories)
fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.html')) {
    buildFile(path.join(srcDir, file));
  }
});
