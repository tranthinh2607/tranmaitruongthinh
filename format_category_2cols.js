const fs = require('fs');

let html = fs.readFileSync('category.html', 'utf8');

// Extract all articles
const articlesMatch = html.match(/<article[\s\S]*?<\/article>/g);
if (!articlesMatch || articlesMatch.length === 0) {
    console.error('No articles found');
    process.exit(1);
}

// Enhance styles for each article making text/images more readable
const enhancedArticles = articlesMatch.map(article => {
    let enhanced = article;
    enhanced = enhanced.replace(/height:\s*220px/g, 'height: 320px');
    enhanced = enhanced.replace(/font-size:\s*0\.95rem/g, 'font-size: 1.25rem');
    enhanced = enhanced.replace(/font-size:\s*0\.8rem/g, 'font-size: 0.95rem');
    enhanced = enhanced.replace(/font-size:\s*0\.65rem/g, 'font-size: 0.75rem');
    enhanced = enhanced.replace(/font-size:\s*0\.75rem/g, 'font-size: 0.85rem');
    enhanced = enhanced.replace(/font-size:\s*0\.7rem/g, 'font-size: 0.85rem');
    return enhanced;
});

// Split into 2 columns
const half = Math.ceil(enhancedArticles.length / 2);
const col1 = enhancedArticles.slice(0, half).join('\n');
const col2 = enhancedArticles.slice(half).join('\n');

const newGrid = `<!-- Articles List 2 Columns -->
          <div class="row w-100 m-0">
            <!-- Cột 1 -->
            <div class="col-xl-6 col-lg-6 col-md-12 d-flex flex-column" style="gap: 20px; padding: 0 10px 0 0">
${col1}
            </div>
            <!-- Cột 2 -->
            <div class="col-xl-6 col-lg-6 col-md-12 d-flex flex-column" style="gap: 20px; padding: 0 0 0 10px">
${col2}
            </div>
          </div>`;

// Replace the old 3 columns block.
const startMarker = '<!-- Articles List 3 Columns -->';
const endMarkerMatch = html.match(/(?:<!-- Dynamic Blog Posts will be rendered here -->\s*)?<!-- Pagination -->|<div class="blog-post-pagination/);

if (!endMarkerMatch) {
    console.error('Could not find end marker');
    process.exit(1);
}

const startIndex = html.indexOf(startMarker);
if (startIndex === -1) {
    console.error('Could not find start marker');
    process.exit(1);
}

const endIndex = endMarkerMatch.index;

const before = html.substring(0, startIndex);
const after = html.substring(endIndex);

const newHtml = before + newGrid + '\n            ' + after;

fs.writeFileSync('category.html', newHtml);
console.log('Successfully updated category.html to 2 columns.');
