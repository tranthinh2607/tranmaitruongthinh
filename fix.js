const fs = require('fs');
let html = fs.readFileSync('category.html', 'utf-8');
html = html.split('excerpt: "${post.excerpt}",').join('excerpt: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor.",');
fs.writeFileSync('category.html', html, 'utf-8');
console.log('Fixed postData array');
