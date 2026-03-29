const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
let categoryHtml = fs.readFileSync('category.html', 'utf8');

const sBlogStart = '<section class="blog">';
const sBlogEnd = '</section>';

const indexBlogStartIdx = indexHtml.indexOf(sBlogStart);
let indexBlogEndIdx = indexHtml.indexOf('</section>', indexBlogStartIdx);
// Find the exact closing section of the blog element
// since index.html has multiple sections. It's safe to use the first </section> after <section class="blog">
if (indexBlogStartIdx > -1 && indexBlogEndIdx > -1) {
    let indexBlogContent = indexHtml.substring(indexBlogStartIdx, indexBlogEndIdx + sBlogEnd.length);

    // Adapt text for Category
    indexBlogContent = indexBlogContent.replace('<h2>Articles</h2>', '<h2>Travel</h2>');
    indexBlogContent = indexBlogContent.replace('<p>View the latest news on Blogger</p>', '<p>View the latest news on Travel</p>');

    const catBlogStartIdx = categoryHtml.indexOf(sBlogStart);
    let catBlogEndIdx = categoryHtml.indexOf(sBlogEnd, catBlogStartIdx);

    if (catBlogStartIdx > -1 && catBlogEndIdx > -1) {
        categoryHtml = categoryHtml.substring(0, catBlogStartIdx) + indexBlogContent + categoryHtml.substring(catBlogEndIdx + sBlogEnd.length);

        // Let's also copy the script that makes tabs work
        const scriptMatch = indexHtml.match(/<script>\s*document\.addEventListener\('DOMContentLoaded', function\(\) {[\s\S]*?<\/script>/);
        if (scriptMatch && !categoryHtml.includes('filterLinks.forEach')) {
            categoryHtml = categoryHtml.replace('</body>', scriptMatch[0] + '\n</body>');
        }

        fs.writeFileSync('category.html', categoryHtml);
        console.log('Replaced category grid successfully');
    } else {
        console.log('Could not find blog section in category.html');
    }
} else {
    console.log('Could not find blog section in index.html');
}
