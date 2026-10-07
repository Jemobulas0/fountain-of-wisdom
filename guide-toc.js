/* ══════════════════════════════════════════════════════════
   GUIDE-TOC.JS — Contents rail for guide pages (guides/*.html).

   Builds the rail from the page's .section-break headings, wires clicks, and
   runs the scroll-spy. Shared by every guide, so they all behave the same.

   Entries:
   - "Start" (top of page)
   - .part-break headings -> part labels (.toc-part). Labels are NEVER active.
     A label counts as its first section: passing it, or clicking it, selects
     the first numbered section under it.
   - every other .section-break -> a section link (.toc-sub when under a part)

   Active rule: the last entry whose heading has passed the reading line wins
   (a label resolves to its first section); at the very bottom of the page the
   last section wins; above the first heading, "Start". Exactly one link is
   active at any time.

   Clicking pins the clicked entry as active, because the last sections cannot
   scroll far enough to bring their heading to the line. The pin is released
   as soon as the reader scrolls or interacts with the page themselves.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var title = document.querySelector('h1.article-title');
  var sidebar = document.querySelector('.toc-sidebar');
  var list = document.querySelector('.toc-list');
  var panel = document.querySelector('.toc-panel');
  if (!title || !sidebar || !list) return;

  var breaks = Array.prototype.slice.call(document.querySelectorAll('.section-break'));
  var LINE = 88; // 56px fixed nav + 32px; keep in sync with .section-break scroll-margin-top
  var SLACK = 4; // px tolerance so a heading scrolled exactly to the line counts as passed

  var used = { top: true }; // reserve "#top" for the Start link
  function slugify(s) {
    var base = String(s).toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return base || 'section';
  }

  // { link, el, part, target } — el === null for Start; target = index that
  // lights up when this entry is reached or clicked (itself, or for a part
  // label the first section under it).
  var entries = [];

  var startLink = document.createElement('a');
  startLink.className = 'toc-link';
  startLink.href = '#top';
  startLink.textContent = 'Start';
  list.appendChild(startLink);
  entries.push({ link: startLink, el: null, part: false, target: 0 });

  var inPart = false;
  breaks.forEach(function (block) {
    var heading = block.querySelector('.section-break-title');
    if (!heading) return;
    var slug = slugify(heading.textContent), id = slug, n = 2;
    while (used[id] || (document.getElementById(id) && document.getElementById(id) !== block)) id = slug + '-' + (n++);
    used[id] = true;
    block.id = id;

    var isPart = block.classList.contains('part-break');
    var a = document.createElement('a');
    a.className = 'toc-link';
    if (isPart) { a.className += ' toc-part'; inPart = true; }
    else if (inPart) a.className += ' toc-sub';
    a.href = '#' + id;
    a.textContent = heading.textContent.trim();
    list.appendChild(a);
    entries.push({ link: a, el: block, part: isPart, target: entries.length });
  });

  // Point each part label at the next non-part entry (its first section).
  entries.forEach(function (entry, i) {
    if (!entry.part) return;
    for (var j = i + 1; j < entries.length; j++) {
      if (!entries[j].part) { entry.target = j; return; }
    }
    entry.target = i > 0 ? i - 1 : 0; // trailing label with no section: fall back to the one before
  });

  // The last link that can ever be active (skips a trailing part label).
  var lastSection = 0;
  entries.forEach(function (entry, i) { if (!entry.part) lastSection = i; });

  var sectionCount = entries.length - 1;

  // Rule: fewer than 2 sections -> hide the list, keep the CTA.
  if (sectionCount < 2) {
    list.style.display = 'none';
    var label = panel && panel.querySelector('.toc-label');
    if (label) label.style.display = 'none';
    if (panel) panel.classList.add('no-toc');
  }

  sidebar.classList.add('is-ready'); // CSS still gates visibility on viewport width

  // ── active state ────────────────────────────────────────────────────────────
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
    if (panel && idx !== lastActive) {
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
    if (atBottom && sectionCount > 0) {
      active = lastSection;
    } else {
      for (i = 1; i < entries.length; i++) {
        if (entries[i].el.getBoundingClientRect().top <= LINE + SLACK) active = entries[i].target;
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

  // ── navigation ──────────────────────────────────────────────────────────────
  // Scroll without letting the browser's own hash navigation push a history entry
  // (so Back leaves the page). Replacing state still updates the address bar's hash.
  function goTo(entry, href) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var behavior = reduce ? 'auto' : 'smooth';
    pinned = entry.target;
    setActive(pinned);
    if (entry.el) {
      entry.el.scrollIntoView({ behavior: behavior, block: 'start' });
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
      if (entries[i].link === a) { goTo(entries[i], a.getAttribute('href')); break; }
    }
  });

  // In-text section links (a.in-link) use the same path as the rail.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.in-link');
    if (!a) return;
    var href = a.getAttribute('href');
    for (var i = 1; i < entries.length; i++) {
      if (entries[i].el && '#' + entries[i].el.id === href) {
        e.preventDefault();
        goTo(entries[i], href);
        return;
      }
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', recompute);
  recompute();
})();
