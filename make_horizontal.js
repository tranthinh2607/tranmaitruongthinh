const fs = require('fs');

let html = fs.readFileSync('category.html', 'utf8');

// The marker for the 2 columns layout is "<!-- Articles List 2 Columns -->". We will modify everything inside it.
// Actually, let's just globally replace formatting for <article> tags, as there is no single-blog article grid here.
// But just to be safe, only replace within the specific row.
const startMarker = '<!-- Articles List 2 Columns -->';
const endMarker = '<!-- Pagination -->'; // or whatever comes after

const articlesMatch = html.match(/<article[\s\S]*?<\/article>/g);

if (articlesMatch) {
    const horizontalArticles = articlesMatch.map(article => {
        let h = article;
        // 1. Change flex direction to row on medium/large screens
        h = h.replace(/class="([^"]*)d-flex flex-column([^"]*)"/g, 'class="$1d-flex flex-column flex-md-row$2"');

        // 2. Adjust thumbnail container. It was width: 100%; height: 320px; or similar. 
        // We set it to flex-basis: 40%, max-width: 45% on desktop.
        // We can just inject styles via class or inline. Let's replace the inline style of blog-post-thumb.
        h = h.replace(/(class="blog-post-thumb[^"]*"\s*style=")([^"]*)(")/g, (match, prefix, style, suffix) => {
            // Remove previous width/height forcing
            let newStyle = style.replace(/width:\s*100%;/g, '')
                .replace(/height:\s*(220px|320px|100%);/g, '')
                .replace(/max-width:[^;]+;/g, '')
                .replace(/flex-basis:[^;]+;/g, '')
                .replace(/min-width:[^;]+;/g, '');
            // Append the new horizontal widths (45% for image)
            newStyle += ' width: 100%; flex-basis: 45%; max-width: 45%; min-height: 250px;';
            return prefix + newStyle + suffix;
        });

        // 3. Image tag styling. Remove explicit border radius since article container has overflow:hidden and border-radius:12px.
        h = h.replace(/(<img[^>]*style="[^"]*)(border-radius:[^;]+;)([^"]*")/g, '$1$3');

        // 4. Adjust content container. 
        h = h.replace(/(class="blog-post-content[^"]*"\s*style=")([^"]*)(")/g, (match, prefix, style, suffix) => {
            let newStyle = style.replace(/width:\s*100%;/g, '')
                .replace(/max-width:[^;]+;/g, '')
                .replace(/flex-basis:[^;]+;/g, '');
            // Append horizontal widths (55% for text)
            newStyle += ' width: 100%; flex-basis: 55%; max-width: 55%; padding: 20px !important;';
            return prefix + newStyle + suffix;
        });

        // Fix image stretch if it lost height 100%
        h = h.replace(/class="img-fluid w-100 h-100 m-0 p-0"/g, 'class="img-fluid m-0 p-0" style="object-fit: cover; width: 100%; height: 100%; position: absolute; top:0; left:0;"');

        return h;
    });

    let i = 0;
    html = html.replace(/<article[\s\S]*?<\/article>/g, () => {
        return horizontalArticles[i++];
    });

    fs.writeFileSync('category.html', html);
    console.log('Successfully formatted category.html to horizontal cards.');
} else {
    console.log('No articles found to format.');
}
