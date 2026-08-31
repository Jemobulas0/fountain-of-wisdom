/* ═══════════════════════════════════════════════════════════
   HERO-LINKS.JS — coverage-aware hero mentions on static pages.

   Any element written as
     <span class="hero-link" data-tooltip="hero" data-hero-key="<id>">…</span>
   is left untouched when that hero has no page yet, and upgraded in
   place to a real <a href="hero_template.html?id=<id>"> once the hero
   is covered (data/heroes.json → covered: true). So a new item/guide
   page only needs the markup — never a hand-written hero URL — and
   flipping a covered flag makes every mention of that hero clickable.

   Load it after data/tooltips.js on any static page that has these
   mentions. Do NOT load it on hero_template.html — hero-loader.js
   already applies the same rule there.

   The tooltip (handled by tooltips.js via event delegation on
   [data-tooltip]) keeps working whether the element ends up a
   <span> or an <a>.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Resolve paths relative to this script's own location (repo root),
  // so it works from both root pages and subfolders (items/, guides/).
  var scriptEl = document.currentScript;
  var ROOT = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : '';

  fetch(ROOT + 'data/heroes.json')
    .then(function (r) { return r.json(); })
    .then(function (heroes) {
      var mentions = document.querySelectorAll('[data-tooltip="hero"][data-hero-key]');
      Array.prototype.forEach.call(mentions, function (el) {
        var id = el.getAttribute('data-hero-key');
        var meta = heroes[id];
        var covered = !!(meta && meta.covered);
        var isAnchor = el.tagName === 'A';

        if (covered) {
          var target = isAnchor ? el : swapTag(el, 'a');
          target.setAttribute('href', ROOT + 'hero_template.html?id=' + (meta.page || id));
        } else if (isAnchor) {
          swapTag(el, 'span'); // strip stale/hand-written links
        }
      });
    })
    .catch(function (e) {
      console.warn('[FoW Hero Links] Could not resolve hero links:', e);
    });

  // Replace an element's tag while keeping its attributes and children.
  // Event delegation in tooltips.js means no listeners need re-binding.
  function swapTag(el, tag) {
    var repl = document.createElement(tag);
    Array.prototype.forEach.call(el.attributes, function (attr) {
      repl.setAttribute(attr.name, attr.value);
    });
    if (tag !== 'a') repl.removeAttribute('href');
    while (el.firstChild) repl.appendChild(el.firstChild);
    el.parentNode.replaceChild(repl, el);
    return repl;
  }
})();
