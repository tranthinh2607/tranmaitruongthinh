const fs = require('fs');
['index.html', 'category.html'].forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // 1. Force the card direction to be vertical only, avoiding horizontal squashing
    html = html.replace(/class="blog-post h-100 d-flex flex-column flex-xl-row blog-post-card w-100 mb-4"/g,
        'class="blog-post h-100 d-flex flex-column blog-post-card w-100 mb-4"');

    // 2. Adjust thumbnail container to take full width and fixed height (for uniform image display)
    html = html.replace(/flex-basis: 40%;\s*max-width: 40%;\s*min-width: 120px;/g,
        'width: 100%; height: 220px;');

    // 3. Remove min-height and aspect-ratio remnants from images
    html = html.replace(/min-height:\s*100%;/g, '');
    html = html.replace(/min-height:\s*150px;/g, '');
    html = html.replace(/aspect-ratio:\s*1\/1;/g, '');

    // 4. Update image border radii to top only
    html = html.replace(/border-radius: 12px 0 0 12px;/g, 'border-radius: 12px 12px 0 0;');

    // 5. Adjust content container to take full width and grow dynamically
    html = html.replace(/flex-basis:\s*60%;\s*max-width:\s*60%;/g, 'width: 100%; flex-grow: 1;');
    html = html.replace(/flex-basis:\s*65%/g, 'width: 100%; flex-grow: 1;');

    // Add some padding adjustment to content
    // Remove flex-grow-1 explicitly from text description if it exists to allow proper natural stacking

    fs.writeFileSync(file, html);
    console.log(`Formatted ${file} for balanced vertical cards`);
});
