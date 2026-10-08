/* ══════════════════════════════════════════════════════════
   TOC-RAIL.JS - the Contents rail, for every page type that has one.
   Styles live in toc-rail.css. A page supplies only its headings; this script
   builds the rail and runs all of its behaviour. Never copy rail logic into
   a page.

   Page types (detected from the markup):
   - Guides (guides/*.html): h1.article-title + .section-break blocks. The rail
     starts with "Start"; .part-break blocks become part labels (.toc-part) and
     the sections after one are indented (.toc-sub). Mounted in .article-layout.
   - Hero and item pages: .section-title headings, one rail entry per .section
     card. No Start entry, no parts. Mounted in .page.
     Item pages build themselves on load. Hero pages render their sections
     after a fetch, so hero-loader.js calls FoWTocRail.init() once they exist;
     the auto-run is skipped when #hero-sections is present.

   Standard:
   - Part labels are never active. A label counts as its first section: passing
     it, or clicking it, selects that section.
   - Active = last heading that has passed the reading line; at the very bottom
     of the page, the last section; above the first heading, the first entry.
     Exactly one link is active at any time.
   - Clicking pins the clicked entry as active until the reader scrolls
     themselves (the last sections cannot scroll far enough to reach the line).
   - Clicking the FIRST section of a part scrolls to the part heading, so the
     heading stays visible with the section directly under it. Only rail clicks
     do this; in-text links (a.in-link) and direct #anchors go straight to the
     section.
   - The rail scrolls itself to keep the active line visible.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var LINE = 88;  // 56px fixed nav + 32px; matches scroll-margin-top in toc-rail.css
  var SLACK = 4;  // px tolerance so a heading scrolled exactly to the line counts as passed

  function slugify(s) {
    var base = String(s).toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return base || 'section';
  }

  // The rail's own Coaching CTA reuses whatever href the page's nav bar
  // already points Coaching at, so it works at the site root or one level down.
  function coachingHref() {
    var navLink = document.querySelector('nav a.nav-cta');
    return navLink ? navLink.getAttribute('href') : 'coaching.html';
  }

  function init() {
    if (document.querySelector('.toc-sidebar')) return; // already built

    var guide = !!document.querySelector('h1.article-title');
    var mount = guide ? document.querySelector('.article-layout') : document.querySelector('.page');
    if (!mount) return;

    var used = { top: true }; // reserve "#top" for the Start link
    // { link, el, part, target, scrollEl }
    //   el === null for Start (top of page)
    //   target   = index that lights up when this entry is reached or clicked
    //              (itself; for a part label, its first section)
    //   scrollEl = what a rail click scrolls to (itself; for the first section
    //              of a part, the part heading)
    var entries = [];
    var list = document.createElement('div');
    list.className = 'toc-list';
    list.setAttribute('role', 'navigation');
    list.setAttribute('aria-label', 'Table of contents');

    function add(text, el, part, sub, withId) {
      var a = document.createElement('a');
      a.className = 'toc-link' + (part ? ' toc-part' : sub ? ' toc-sub' : '');
      a.href = withId ? '#' + el.id : '#top';
      a.textContent = text;
      list.appendChild(a);
      entries.push({ link: a, el: el, part: part, target: entries.length, scrollEl: el });
    }

    if (guide) {
      add('Start', null, false, false, false);
      var inPart = false;
      Array.prototype.slice.call(document.querySelectorAll('.section-break')).forEach(function (block) {
        var heading = block.querySelector('.section-break-title');
        if (!heading) return;
        var slug = slugify(heading.textContent), id = slug, n = 2;
        while (used[id] || (document.getElementById(id) && document.getElementById(id) !== block)) id = slug + '-' + (n++);
        used[id] = true;
        block.id = id;
        var isPart = block.classList.contains('part-break');
        if (isPart) inPart = true;
        add(heading.textContent.trim(), block, isPart, !isPart && inPart, true);
      });
    } else {
      Array.prototype.slice.call(document.querySelectorAll('.section-title')).forEach(function (h) {
        var text = h.textContent.trim();
        if (!text) return;
        var slug = slugify(text), id = slug, n = 2;
        while (used[id] || document.getElementById(id)) id = slug + '-' + (n++);
        used[id] = true;
        // The heading's own .section card is the scroll target.
        var target = h.closest('.section') || h;
        target.id = id;
        add(text, target, false, false, true);
      });
      if (entries.length < 2) return;   // "2 or more sections" rule
    }

    var sectionCount = guide ? entries.length - 1 : entries.length;

    // Point each part label at the next non-part entry (its first section), and
    // make a click on that first section scroll to the part heading instead,
    // provided the heading sits directly above it.
    entries.forEach(function (entry, i) {
      if (!entry.part) return;
      for (var j = i + 1; j < entries.length; j++) {
        if (!entries[j].part) {
          entry.target = j;
          if (entry.el.nextElementSibling === entries[j].el) entries[j].scrollEl = entry.el;
          return;
        }
      }
      entry.target = i > 0 ? i - 1 : 0; // trailing label with no section: fall back to the one before
    });

    // The last link that can ever be active (skips a trailing part label).
    var lastSection = 0;
    entries.forEach(function (entry, i) { if (!entry.part) lastSection = i; });

    var sidebar = document.createElement('aside');
    sidebar.className = 'toc-sidebar' + (guide ? ' is-guide' : '');
    sidebar.setAttribute('aria-label', guide ? 'Article contents' : 'Page contents');

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
    mount.appendChild(sidebar);

    // Guides: fewer than 2 sections -> hide the list, keep the CTA.
    if (sectionCount < 2) {
      list.style.display = 'none';
      label.style.display = 'none';
      panel.classList.add('no-toc');
    }

    sidebar.classList.add('is-ready'); // CSS still gates visibility on viewport width

    // ── active state ──────────────────────────────────────────────────────────
    var lastActive = -1;
    var pinned = -1; // entry index forced active after a click; -1 = follow scroll

    function setActive(idx) {
      for (var i = 0; i < entries.length; i++) {
        var on = i === idx;
        entries[i].link.classList.toggle('active', on);
        if (on) entries[i].link.setAttribute('aria-current', 'location');
        else entries[i].link.removeAttribute('aria-current');
      }
      // keep the active link inside the panel's own scroll area (never scrolls the page)
      if (idx !== lastActive) {
        var l = entries[idx].link;
        if (l.offsetTop < panel.scrollTop + 40 || l.offsetTop + l.offsetHeight > panel.scrollTop + panel.clientHeight - 40) {
          panel.scrollTop = Math.max(0, l.offsetTop - panel.clientHeight / 2);
        }
      }
      lastActive = idx;
    }

    function recompute() {
      if (pinned >= 0) { setActive(pinned); return; }
      var active = 0, i;
      var atBottom = window.innerHeight + window.pageYOffset >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        active = lastSection;
      } else {
        for (i = 0; i < entries.length; i++) {
          if (entries[i].el && entries[i].el.getBoundingClientRect().top <= LINE + SLACK) active = entries[i].target;
        }
      }
      setActive(active);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { ticking = false; recompute(); });
    }

    // The reader taking over the scroll releases the pin.
    function release() {
      if (pinned < 0) return;
      pinned = -1;
      recompute();
    }
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });
    window.addEventListener('keydown', function (e) {
      if (/^(ArrowUp|ArrowDown|PageUp|PageDown|Home|End| |Spacebar)$/.test(e.key)) release();
    });
    window.addEventListener('mousedown', function (e) {
      // scrollbar drags land on the document itself; clicks inside the rail are handled by the rail
      if (!e.target.closest || !e.target.closest('.toc-sidebar, a.in-link')) release();
    });

    // ── navigation ────────────────────────────────────────────────────────────
    // Scroll without letting the browser's own hash navigation push a history
    // entry (so Back leaves the page). Replacing state still updates the
    // address bar's hash for deep-linking. fromRail picks the scroll target.
    function goTo(entry, href, fromRail) {
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var behavior = reduce ? 'auto' : 'smooth';
      var scrollEl = fromRail ? entry.scrollEl : entry.el;
      pinned = entry.target;
      setActive(pinned);
      if (scrollEl) {
        scrollEl.scrollIntoView({ behavior: behavior, block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: behavior });
      }
      if (history.replaceState) history.replaceState(null, '', href);
    }

    list.addEventListener('click', function (e) {
      var a = e.target.closest('.toc-link');
      if (!a) return;
      e.preventDefault();
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].link === a) { goTo(entries[i], a.getAttribute('href'), true); break; }
      }
    });

    // In-text section links (a.in-link) go straight to the section.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a.in-link');
      if (!a) return;
      var href = a.getAttribute('href');
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].el && '#' + entries[i].el.id === href) {
          e.preventDefault();
          goTo(entries[i], href, false);
          return;
        }
      }
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recompute);
    recompute();
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
