const fs = require('fs');

const scriptContent = fs.readFileSync('pagination_script.html', 'utf8');

['index.html', 'category.html'].forEach(file => {
    let html = fs.readFileSync(file, 'utf8');

    // Replace old filter script with the new paginated one
    const regex = /<script>[\s\S]*?const filterLinks = document\.querySelectorAll[\s\S]*?<\/script>/;

    if (regex.test(html)) {
        html = html.replace(regex, scriptContent);
        fs.writeFileSync(file, html);
        console.log("Successfully updated " + file);
    } else {
        html = html.replace('</body>', scriptContent + '\n</body>');
        fs.writeFileSync(file, html);
        console.log("Appended script to " + file);
    }
});
