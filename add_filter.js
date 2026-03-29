const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const categories = [
    'Travel', 'Travel', 'Travel', 'Travel', 'Travel',
    'Lifestyle', 'Lifestyle', 'Lifestyle', 'Lifestyle', 'Lifestyle',
    'Nature', 'Nature', 'Nature', 'Nature', 'Nature'
];

let count = 0;
html = html.replace(/<div class="blog-post-tag[^>]*>[\s\S]*?<a[^>]*>(.*?)<\/a>/g, (match, p1) => {
    let cat = categories[count] || 'Travel';
    count++;
    return match.replace(p1, cat);
});

const script = `
<script>
document.addEventListener('DOMContentLoaded', function() {
  const filterLinks = document.querySelectorAll('.custom-category-nav .nav-link');
  const articles = document.querySelectorAll('.blog-post-card');

  filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      // Reset all links to default styling
      filterLinks.forEach(l => {
        l.classList.remove('active');
        l.style.backgroundColor = '#f8f9fa';
        l.style.color = '#333';
        l.classList.add('text-dark');
      });

      // Set active styles for the clicked link
      this.classList.add('active');
      this.style.backgroundColor = '#333';
      this.style.color = '#fff';
      this.classList.remove('text-dark');

      const selectedCategory = this.textContent.trim();

      // Filter logic
      articles.forEach(article => {
        const articleCategory = article.querySelector('.blog-post-tag a').textContent.trim();
        
        if (selectedCategory === 'All' || articleCategory === selectedCategory) {
          article.style.setProperty('display', 'flex', 'important');
        } else {
          article.style.setProperty('display', 'none', 'important');
        }
      });
    });
  });
});
</script>
`;

if (!html.includes('filterLinks.forEach')) {
    html = html.replace('</body>', script + '\n</body>');
}

fs.writeFileSync('index.html', html);
console.log('Done mapping categories and injecting script');
