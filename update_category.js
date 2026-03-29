const fs = require('fs');
let html = fs.readFileSync('category.html', 'utf-8');

// Replace the postData objects
html = html.replace(/title: "Five Things You Need to Know",?/g, 'title: "Five Things You Need to Know",\n            author: "Mary",\n            excerpt: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor."');

// Replace author name in template
html = html.replace(/>Mary<\/a>/g, '>${post.author}</a>');

// Replace excerpt in template
html = html.replace(/Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor\./g, '${post.excerpt}');

fs.writeFileSync('category.html', html, 'utf-8');
console.log('Update complete');
