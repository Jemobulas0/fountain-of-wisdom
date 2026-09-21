/* ══════════════════════════════════════════════════════════
   MOBILE-TOC.JS - mobile "Contents" block + floating
   "Back to contents" button. Shared by hero pages, item pages
   and guide pages.

   Generates the list from the section headings actually on the
   page, so no page needs hand-editing beyond loading this file:
     .section-title       hero + item pages (inside .section cards)
     .section-break-title guide pages (inside .section-break)

   All layout, sizing and visibility rules live in mobile.css.
   The elements this script injects are display:none above the
   768px breakpoint, so desktop is unaffected. This script only
   builds DOM, toggles classes and drives scrolling.

   Static pages (items, guides): builds itself on load.
   Hero pages: hero-loader.js renders the sections after a fetch,
   so it calls FoWMobileToc.init() once they exist. This script
   skips its own auto-run when #hero-sections is present.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var HEADINGS = '.section-title, .section-break-title';

  function scrollBehavior() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce ? 'auto' : 'smooth';
  }

  // Where the block goes: directly under the page title.
  //   hero + item pages: the .header card holds the name -> attach under it
  //   guide pages: the h1 holds the title -> standalone card under it
  function findAnchor() {
    var header = document.querySelector('.page > .header');
    if (header) return { node: header, variant: 'attached' };
    var title = document.querySelector('h1.article-title');
    if (title) return { node: title, variant: 'standalone' };
    return null;
  }

  function init() {
    if (document.querySelector('.fow-mtoc')) return;   // already built

    var anchor = findAnchor();
    if (!anchor) return;

    // One entry per heading, in page order. The scroll target is the guide's
    // .section-break wrapper when there is one (it already carries the nav
    // scroll-margin), otherwise the heading itself. Element references are
    // kept in closure rather than looked up by id, so this works regardless of
    // whether the guide's own desktop ToC script has (re)assigned ids.
    var entries = [];
    Array.prototype.forEach.call(document.querySelectorAll(HEADINGS), function (h) {
      var label = h.textContent.trim();
      if (!label) return;
      entries.push({ label: label, target: h.closest('.section-break') || h });
    });
    if (entries.length < 2) return;   // same "fewer than 2 sections" rule as the desktop guide ToC

    // ── Contents block ────────────────────────────────────────
    var root = document.createElement('div');
    root.className = 'fow-mtoc fow-mtoc--' + anchor.variant;

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'fow-mtoc-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'fow-mtoc-list');
    toggle.innerHTML = '<span class="fow-mtoc-label">Contents</span>' +
                       '<span class="fow-mtoc-arrow" aria-hidden="true">▸</span>';

    var list = document.createElement('div');
    list.className = 'fow-mtoc-list';
    list.id = 'fow-mtoc-list';
    list.setAttribute('role', 'navigation');
    list.setAttribute('aria-label', 'Contents');

    entries.forEach(function (entry) {
      var a = document.createElement('a');
      a.className = 'fow-mtoc-link';
      a.href = entry.target.id ? '#' + entry.target.id : '#';
      a.textContent = entry.label;
      a._target = entry.target;
      list.appendChild(a);
    });

    root.appendChild(toggle);
    root.appendChild(list);

    anchor.node.parentNode.insertBefore(root, anchor.node.nextSibling);

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    toggle.addEventListener('click', function () {
      setOpen(!root.classList.contains('is-open'));
    });

    list.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.fow-mtoc-link') : null;
      if (!a || !a._target) return;
      e.preventDefault();
      // Collapse first so the layout is final before the scroll distance is measured.
      setOpen(false);
      a._target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    });

    // ── Floating back-to-contents button ──────────────────────
    var back = document.createElement('button');
    back.type = 'button';
    back.className = 'fow-mtoc-back';
    back.setAttribute('aria-label', 'Back to contents');
    back.innerHTML = '<span class="fow-mtoc-back-arrow" aria-hidden="true">▸</span>';
    document.body.appendChild(back);

    back.addEventListener('click', function () {
      setOpen(true);
      root.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      toggle.focus({ preventScroll: true });
    });

    // Visible only while the Contents block is out of view, and never while the
    // footer is on screen (so it can't sit on top of the footer links).
    var contentsInView = true;
    var footerInView = false;
    function syncBack() {
      back.classList.toggle('is-visible', !contentsInView && !footerInView);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (records) {
        contentsInView = records[records.length - 1].isIntersecting;
        syncBack();
      }).observe(root);

      var footer = document.querySelector('footer');
      if (footer) {
        new IntersectionObserver(function (records) {
          footerInView = records[records.length - 1].isIntersecting;
          syncBack();
        }).observe(footer);
      }
    }
  }

  window.FoWMobileToc = { init: init };

  if (!document.getElementById('hero-sections')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
