/* ==========================================================================
   JBM Media — Shared site script
   Handles the navbar scroll/scale state, the logo swap, and the scroll-reveal
   animation. Loaded once and cached across index.html, paquetes.html and
   contacto.html instead of being duplicated inline on every page.
   ========================================================================== */
(function () {
    'use strict';
 
    var navbar = document.querySelector('.navbar');
    var logoImg = document.getElementById('main-logo');
 
    // Local repo paths (replaces the old hotlinked Google Drive URLs, which
    // were slower and less reliable than serving the images with the site).
    var DEFAULT_LOGO = 'Logo JBM/PNG/1.png';
    var WHITE_LOGO = 'Logo JBM/PNG/2.png';
    var MOBILE_BREAKPOINT = 768;
    var SCROLL_THRESHOLD = 50;
 
    var ticking = false;
 
    function updateNavbarState() {
        var isScrolled = window.scrollY > SCROLL_THRESHOLD;
        var isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
 
        if (navbar) {
            navbar.classList.toggle('scrolled', isScrolled);
        }
        if (logoImg) {
            var nextSrc = (isScrolled || isMobile) ? WHITE_LOGO : DEFAULT_LOGO;
            if (!logoImg.src.endsWith(nextSrc)) {
                logoImg.src = nextSrc;
            }
        }
        ticking = false;
    }
 
    function requestNavbarUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavbarState);
            ticking = true;
        }
    }
 
    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;
 
        if (!('IntersectionObserver' in window)) {
            // Fallback for very old browsers: just show the content.
            reveals.forEach(function (el) { el.classList.add('active'); });
            return;
        }
 
        var revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.15 });
 
        reveals.forEach(function (el) { revealObserver.observe(el); });
    }
 
    // Passive listeners let the browser keep scrolling smooth instead of
    // waiting on this handler before it can paint each frame.
    window.addEventListener('scroll', requestNavbarUpdate, { passive: true });
    window.addEventListener('resize', requestNavbarUpdate);
 
    document.addEventListener('DOMContentLoaded', function () {
        updateNavbarState();
        initScrollReveal();
    });
})();
