$(document).ready(function(){"use strict";document.getElementById("copyrightYear").innerHTML=(new Date).getFullYear(),$(".widget-slider").slick({dots:!1,infinite:!0,speed:300,slidesToShow:1,slidesToScroll:1,arrows:!0,autoplay:!0,responsive:[{breakpoint:992,settings:{slidesToShow:1,slidesToScroll:1}},{breakpoint:768,settings:{slidesToShow:1,slidesToScroll:1}}]}),$(window).on("scroll",function(){$(window).scrollTop()?$("nav").addClass("nav-bg"):$("nav").removeClass("nav-bg")})});
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
