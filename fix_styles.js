const fs = require('fs');
let html = fs.readFileSync('category.html', 'utf8');

// 1. Remove height: 320px block logic
html = html.replace(/height:\s*\d+px\s*width:\s*100%;/g, 'width: 100%; height: 100%;');

// 2. Fix content flex-grow missing semicolon
html = html.replace(/flex-grow:\s*1\s*width:\s*100%;/g, 'width: 100%; flex-grow: 1;');

// 3. Remove duplicate style tags on img 
html = html.replace(/(<img[^>]*style="[^"]*")\s+style="[^"]*"/g, '$1');

// 4. Remove flex-md-row from inner content that was accidentally added
html = html.replace(/class="blog-post-content([^"]*)flex-md-row([^"]*)"/g, 'class="blog-post-content$1$2"');

// 5. Let's make sure the min-height is 200px instead of 250px so it fits well horizontally
html = html.replace(/min-height:\s*250px/g, 'min-height: 200px');

fs.writeFileSync('category.html', html);
console.log('Fixed category html styles.');
