/* ══════════════════════════════════════════════════════════
   TOC-RAIL.JS — PC table of contents rail for hero and item pages.

   Same rail guides/wasting_time.html uses (position:fixed, vertically
   centred beside the content column), reused here so hero/item pages get
   it too. All layout, sizing, colours and the >=1260px visibility gate live
   in each page's own <style> block (this mirrors the guide, which also
   keeps that CSS inline rather than in a shared file) — this script only
   builds the DOM from whatever .section-title headings exist and runs the
   scroll-spy. Entries come straight from the page's own headings in order,
   so it works for every hero/item page with no per-page editing.

   Static pages (items/*.html): builds itself on load.
   Hero pages: hero-loader.js renders the sections after a fetch, so it
   calls FoWTocRail.init() once they exist. This script skips its own
   auto-run when #hero-sections is present, same convention mobile-toc.js
   uses for the same reason.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LINE = 88; // 56px fixed nav + 32px; matches the guide's own scroll-spy line

  function slugify(s) {
    var base = String(s).toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return base || 'section';
  }

  // The rail's own Coaching CTA reuses whatever href the page's nav bar
  // already points Coaching at, so it works unchanged whether the page is
  // at the site root (hero_template.html) or one level down (items/*.html).
  function coachingHref() {
    var navLink = document.querySelector('nav a.nav-cta');
    return navLink ? navLink.getAttribute('href') : 'coaching.html';
  }

  function init() {
    if (document.querySelector('.toc-sidebar')) return; // already built

    var page = document.querySelector('.page');
    var headings = Array.prototype.slice.call(document.querySelectorAll('.section-title'));
    if (!page || headings.length < 2) return;   // "2 or more sections" rule

    var used = {};
    var entries = [];
    var list = document.createElement('div');
    list.className = 'toc-list';
    list.setAttribute('role', 'navigation');
    list.setAttribute('aria-label', 'Table of contents');

    headings.forEach(function (h) {
      var text = h.textContent.trim();
      if (!text) return;
      var slug = slugify(text), id = slug, n = 2;
      while (used[id] || document.getElementById(id)) id = slug + '-' + (n++);
      used[id] = true;
      // The heading's own .section card is the scroll target, same as the
      // guide targets its .section-break wrapper rather than the bare title.
      var target = h.closest('.section') || h;
      target.id = id;

      var a = document.createElement('a');
      a.className = 'toc-link';
      a.href = '#' + id;
      a.textContent = text;
      list.appendChild(a);
      entries.push({ link: a, el: target });
    });

    if (entries.length < 2) return;

    var sidebar = document.createElement('aside');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', 'Page contents');

    var panel = document.createElement('div');
    panel.className = 'toc-panel';

    var label = document.createElement('div');
    label.className = 'toc-label';
    label.textContent = 'Contents';

    var cta = document.createElement('a');
    cta.className = 'nav-cta toc-cta';
    cta.href = coachingHref();
    cta.textContent = 'Coaching';

    panel.appendChild(label);
    panel.appendChild(list);
    panel.appendChild(cta);
    sidebar.appendChild(panel);
    page.appendChild(sidebar);
    sidebar.classList.add('is-ready'); // CSS still gates visibility on viewport width

    // ── scroll-spy — same reading-band-then-fallback rule as the guide's ──
    function setActive(idx) {
      entries.forEach(function (entry, i) {
        var on = i === idx;
        entry.link.classList.toggle('active', on);
        if (on) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
    }
    function recompute() {
      var active = 0, i, r;
      for (i = 0; i < entries.length; i++) {
        r = entries[i].el.getBoundingClientRect();
        if (r.top < LINE + 72 && r.bottom > LINE) active = i;
      }
      if (active === 0) {
        for (i = 0; i < entries.length; i++) {
          if (entries[i].el.getBoundingClientRect().top <= LINE) active = i;
        }
      }
      setActive(active);
    }

    var io = null;
    function buildObserver() {
      if (io) io.disconnect();
      if (!('IntersectionObserver' in window)) return;
      var bottomInset = Math.max(0, window.innerHeight - (LINE + 72));
      io = new IntersectionObserver(recompute, {
        rootMargin: '-' + LINE + 'px 0px -' + bottomInset + 'px 0px',
        threshold: 0
      });
      entries.forEach(function (entry) { io.observe(entry.el); });
    }

    buildObserver();
    recompute();
    window.addEventListener('resize', function () { buildObserver(); recompute(); });
  }

  window.FoWTocRail = { init: init };

  if (!document.getElementById('hero-sections')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})();
