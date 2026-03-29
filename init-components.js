const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const componentsDir = path.join(srcDir, 'components');

if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir);

const rawHtml = fs.readFileSync('index.html', 'utf-8');

// 1. Extract Head
// Matches from <head> to </head>
const headMatch = rawHtml.match(/<head>([\s\S]*?)<\/head>/);
if (headMatch) {
  fs.writeFileSync(path.join(componentsDir, 'head.html'), `<head>${headMatch[1]}</head>`, 'utf-8');
}

// 2. Extract Loader
const loaderMatch = rawHtml.match(/<!-- Page Loader -->\s*<div id="page-loader" class="page-loader">[\s\S]*?<\/div>\s*<\/div>/);
if (loaderMatch) {
  fs.writeFileSync(path.join(componentsDir, 'loader.html'), loaderMatch[0], 'utf-8');
}

// 3. Extract Navbar
const navbarMatch = rawHtml.match(/<!-- Navbar Start -->\s*<nav[\s\S]*?<\/nav>\s*<!-- Navbar End -->/);
if (navbarMatch) {
  fs.writeFileSync(path.join(componentsDir, 'navbar.html'), navbarMatch[0], 'utf-8');
}

// 4. Extract Footer
const footerMatch = rawHtml.match(/<section class="footer">[\s\S]*?(?=<!-- Google Map -->|<\/body>)/);
if (footerMatch) {
  fs.writeFileSync(path.join(componentsDir, 'footer.html'), footerMatch[0], 'utf-8');
}

// 5. Extract Scripts
const scriptsMatch = rawHtml.match(/<!-- Google Map -->[\s\S]*?(?=<\/body>)/);
if (scriptsMatch) {
  fs.writeFileSync(path.join(componentsDir, 'scripts.html'), scriptsMatch[0], 'utf-8');
}

// 6. Create src/index.html
let srcIndex = rawHtml;
srcIndex = srcIndex.replace(/<head>[\s\S]*?<\/head>/, '<!-- @include components/head.html -->');
srcIndex = srcIndex.replace(/<!-- Page Loader -->\s*<div id="page-loader" class="page-loader">[\s\S]*?<\/div>\s*<\/div>/, '    <!-- @include components/loader.html -->');
srcIndex = srcIndex.replace(/<!-- Navbar Start -->\s*<nav[\s\S]*?<\/nav>\s*<!-- Navbar End -->/, '    <!-- @include components/navbar.html -->');
srcIndex = srcIndex.replace(/<section class="footer">[\s\S]*?(?=<!-- Google Map -->|<\/body>)/, '    <!-- @include components/footer.html -->\n\n    ');
srcIndex = srcIndex.replace(/<!-- Google Map -->[\s\S]*?(?=<\/body>)/, '<!-- @include components/scripts.html -->\n  ');

fs.writeFileSync(path.join(srcDir, 'index.html'), srcIndex, 'utf-8');

console.log('Successfully created components and src/index.html template!');
