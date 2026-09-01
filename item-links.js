/* ═══════════════════════════════════════════════════════════
   ITEM-LINKS.JS — coverage-aware item mentions on static pages.

   The item counterpart of hero-links.js. Any element written as
     <span class="item-link" data-tooltip="item" data-item="<id>">…</span>
   (anything carrying data-tooltip="item" + data-item) is turned into a
   real link when that item has a page, and left as plain, non-navigable
   markup when it doesn't. <id> may be the item's canonical id or its
   legacy/CDN id — data/item-pages.json maps both to the page.

   Load it after data/tooltips.js on any static page that has these
   mentions. NOT needed on hero_template.html — hero-loader.js applies
   the same registry there as it builds the page.

   Tooltips are handled entirely by tooltips.js (data/items.json) via
   event delegation and are never touched here. Coverage decides the
   link; data/items.json decides the tooltip; the two never interact —
   so an item can become clickable later with no change to its tooltip.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Resolve paths relative to this script's own location (repo root),
  // so it works from root pages and from subfolders (items/, guides/).
  var scriptEl = document.currentScript;
  var ROOT = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : '';

  fetch(ROOT + 'data/item-pages.json')
    .then(function (r) { return r.json(); })
    .then(function (registry) {
      // id (canonical OR cdn alias) -> canonical page id
      var pageById = {};
      Object.keys(registry).forEach(function (canonical) {
        var entry = registry[canonical];
        if (!entry || typeof entry !== 'object') return; // skip __README__
        pageById[canonical] = canonical;
        if (entry.cdn) pageById[entry.cdn] = canonical;
      });

      var refs = document.querySelectorAll('[data-tooltip="item"][data-item]');
      Array.prototype.forEach.call(refs, function (el) {
        var page = pageById[el.getAttribute('data-item')];
        var isAnchor = el.tagName === 'A';
        if (page) {
          var a = isAnchor ? el : swap(el, 'a');
          a.setAttribute('href', ROOT + 'items/' + page + '.html');
        } else if (isAnchor) {
          swap(el, 'span'); // strip stale/hand-written links
        }
      });
    })
    .catch(function (e) {
      console.warn('[FoW Item Links] Could not resolve item links:', e);
    });

  // Swap an element's tag, keeping attributes and children. Event delegation in
  // tooltips.js means no listeners need re-binding. When dropping the anchor we
  // also pin the element's current rendered display, because the
  // `.item-link { display: contents }` rule may still be `a.item-link` on some
  // pages and would otherwise stop matching.
  function swap(el, tag) {
    var repl = document.createElement(tag);
    var disp = tag !== 'a' ? getComputedStyle(el).display : null;
    Array.prototype.forEach.call(el.attributes, function (attr) {
      repl.setAttribute(attr.name, attr.value);
    });
    if (tag !== 'a') {
      repl.removeAttribute('href');
      repl.style.display = disp;
    }
    while (el.firstChild) repl.appendChild(el.firstChild);
    el.parentNode.replaceChild(repl, el);
    return repl;
  }
})();
