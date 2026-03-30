const fs = require('fs');
const cheerio = require('cheerio');

function fixHtml(file) {
    if (!fs.existsSync(file)) return;
    let html = fs.readFileSync(file, 'utf8');
    const $ = cheerio.load(html, { decodeEntities: false });

    // 1. Find all article containers
    $('.blog-post-thumb').each((i, el) => {
        const parentDiv = $(el).closest('div.d-flex.flex-column.flex-md-row');
        if (parentDiv.length > 0) {
            parentDiv.removeClass('d-flex flex-column flex-md-row').addClass('row m-0');
        }

        // 2. Add Bootstrap col classes to thumb
        $(el).addClass('col-md-5 col-12');
        $(el).css('flex-basis', ''); // remove inline
        $(el).css('max-width', '');
        $(el).css('min-height', '250px');
        
        // Remove 'position-relative' if it exists to let image define height naturally
        $(el).removeClass('position-relative');
        
        // 3. Find the img inside and remove absolute positioning
        const img = $(el).find('img');
        if (img.length > 0) {
            img.css('position', '');
            img.css('top', '');
            img.css('left', '');
            img.css('height', '100%');
            img.css('width', '100%');
            img.css('min-height', '250px');
            img.css('object-fit', 'cover');
        }
    });

    $('.blog-post-content').each((i, el) => {
        $(el).addClass('col-md-7 col-12');
        $(el).css('flex-basis', '');
        $(el).css('max-width', '');
    });

    fs.writeFileSync(file, $.html());
    console.log(`Fix applied to ${file}`);
}

['index.html', 'src/index.html', 'category.html'].forEach(fixHtml);
