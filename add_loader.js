const fs = require('fs');

const overlay_html = `
    <!-- Page Loader -->
    <div id="page-loader" class="page-loader">
      <div class="spinner"></div>
    </div>
`;

const css_override = `
/* Page Loader CSS */
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.page-loader.hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #111;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;

const js_override = `
// Page Loader script
document.addEventListener("DOMContentLoaded", function() {
  const loader = document.getElementById("page-loader");
  if (loader) {
    // Hide loader when page is fully loaded
    window.addEventListener("load", function() {
      setTimeout(function() {
        loader.classList.add("hidden");
      }, 300); // slight delay for visual smoothness
    });

    // Show loader when clicking on internal links
    document.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function(e) {
        // Only trigger for same-site, non-hash, non-blank links
        const target = link.getAttribute("target");
        const href = link.getAttribute("href");
        
        if (href && !href.startsWith("#") && !href.startsWith("javascript:") && target !== "_blank") {
          const isInternal = href.indexOf(window.location.host) !== -1 || href.indexOf("http") === -1;
          if (isInternal) {
            e.preventDefault();
            loader.classList.remove("hidden");
            setTimeout(function() {
              window.location.href = href;
            }, 300); // wait for fade in before navigating
          }
        }
      });
    });
  }
});
`;

["index.html", "about.html", "category.html", "contact.html", "single-blog.html"].forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf-8');
        if (!content.includes('id="page-loader"')) {
            content = content.replace('<body>', '<body>' + overlay_html);
            fs.writeFileSync(file, content, 'utf-8');
            console.log("Injected into", file);
        }
    }
});

let cssContent = fs.readFileSync('css/style.css', 'utf-8');
if (!cssContent.includes('/* Page Loader CSS */')) {
    fs.appendFileSync('css/style.css', css_override, 'utf-8');
    console.log("Injected into style.css");
}

let jsContent = fs.readFileSync('js/script.js', 'utf-8');
if (!jsContent.includes('// Page Loader script')) {
    fs.appendFileSync('js/script.js', js_override, 'utf-8');
    console.log("Injected into script.js");
}

console.log("Done.");
