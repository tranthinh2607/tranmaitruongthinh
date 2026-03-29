const fs = require('fs');

let html = fs.readFileSync('category.html', 'utf8');

const articlesMatch = html.match(/<article[\s\S]*?<\/article>/g);
if (!articlesMatch || articlesMatch.length === 0) {
    console.error('No articles found');
    process.exit(1);
}

// Enhance styles for 1-column ultra wide layout
const enhancedArticles = articlesMatch.map(article => {
    let enhanced = article;
    // Adjust ratios from 45/55 to 40/60
    enhanced = enhanced.replace(/flex-basis:\s*45%;/g, 'flex-basis: 40%;');
    enhanced = enhanced.replace(/max-width:\s*45%;/g, 'max-width: 40%;');

    enhanced = enhanced.replace(/flex-basis:\s*55%;/g, 'flex-basis: 60%;');
    enhanced = enhanced.replace(/max-width:\s*55%;/g, 'max-width: 60%;');

    // Increase min-height for image
    enhanced = enhanced.replace(/min-height:\s*200px;/g, 'min-height: 280px;');

    // Bump title font-size
    enhanced = enhanced.replace(/font-size:\s*1\.25rem/g, 'font-size: 1.5rem');

    // Bump content padding
    enhanced = enhanced.replace(/padding:\s*20px\s*!important/g, 'padding: 30px !important');

    return enhanced;
});

const allArticles = enhancedArticles.join('\n');

const newGrid = `<!-- Articles List 1 Column -->
          <div class="row w-100 m-0">
            <!-- Cột duy nhất -->
            <div class="col-12 d-flex flex-column" style="gap: 30px; padding: 0;">
${allArticles}
            </div>
          </div>`;

// Find start and end markers
const startMarkerMatch = html.match(/<!-- Articles List 2 Columns -->/);
const endMarkerMatch = html.match(/(?:<!-- Dynamic Blog Posts will be rendered here -->\s*)?<!-- Pagination -->|<div class="blog-post-pagination/);

if (!startMarkerMatch || !endMarkerMatch) {
    console.error('Could not find start or end markers');
    process.exit(1);
}

const startIndex = startMarkerMatch.index;
const endIndex = endMarkerMatch.index;

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);

const newHtml = before + newGrid + '\n            ' + after;

fs.writeFileSync('category.html', newHtml);
console.log('Successfully updated category.html to 1 column full width.');
