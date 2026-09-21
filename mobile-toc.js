/* ══════════════════════════════════════════════════════════
   MOBILE-TOC.JS - floating section menu for phones. Shared by hero
   pages, item pages and guide pages.

   A round list button floats at the bottom-right of the page at every
   scroll position. Tapping it slides up a bottom panel listing "Top of
   Page" plus every section heading; tapping an entry closes the panel
   and scrolls there.

   The list is generated from the headings actually on the page, so no
   page needs hand-editing beyond loading this file:
     .section-title       hero + item pages (inside .section cards)
     .section-break-title guide pages (inside .section-break)

   All layout, sizing, colours and visibility live in mobile.css. The
   injected elements are display:none above the 768px breakpoint, so
   desktop is unaffected. This script only builds DOM, toggles classes,
   and writes two measured values into CSS custom properties:
     --fow-lift      how far the footer has pushed the button up
     --fow-lock-top  the scroll offset to hold while the page is locked

   Static pages (items, guides): builds itself on load.
   Hero pages: hero-loader.js renders the sections after a fetch, so it
   calls FoWMobileToc.init() once they exist. This script skips its own
   auto-run when #hero-sections is present.
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var HEADINGS = '.section-title, .section-break-title';
  var MOBILE = '(max-width: 768px)';   // keep in sync with mobile.css

  var ICON_LIST =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<circle cx="4" cy="6" r="1.6" fill="currentColor"/>' +
      '<circle cx="4" cy="12" r="1.6" fill="currentColor"/>' +
      '<circle cx="4" cy="18" r="1.6" fill="currentColor"/>' +
      '<path d="M9 6h12M9 12h12M9 18h12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>' +
    '</svg>';
  var ICON_CLOSE =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' +
    '</svg>';

  function scrollBehavior() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduce ? 'auto' : 'smooth';
  }

  function init() {
    if (document.querySelector('.fow-mtoc-fab')) return;   // already built

    // One entry per heading, in page order. The scroll target is the guide's
    // .section-break wrapper when there is one (it already carries the nav
    // scroll-margin), otherwise the heading itself.
    var sections = [];
    Array.prototype.forEach.call(document.querySelectorAll(HEADINGS), function (h) {
      var label = h.textContent.trim();
      if (!label) return;
      sections.push({ label: label, target: h.closest('.section-break') || h });
    });
    if (sections.length < 2) return;   // same "fewer than 2 sections" rule as the desktop guide ToC

    var root = document.documentElement;
    var mq = window.matchMedia(MOBILE);

    // ── Build the elements ────────────────────────────────────
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'fow-mtoc-fab';
    fab.setAttribute('aria-label', 'Contents');
    fab.setAttribute('aria-haspopup', 'dialog');
    fab.innerHTML = ICON_LIST;

    var scrim = document.createElement('div');
    scrim.className = 'fow-mtoc-scrim';

    var panel = document.createElement('div');
    panel.className = 'fow-mtoc-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'fow-mtoc-title');

    var head = document.createElement('div');
    head.className = 'fow-mtoc-head';
    head.innerHTML = '<span class="fow-mtoc-label" id="fow-mtoc-title">Contents</span>';

    var close = document.createElement('button');
    close.type = 'button';
    close.className = 'fow-mtoc-close';
    close.setAttribute('aria-label', 'Close contents');
    close.innerHTML = ICON_CLOSE;
    head.appendChild(close);

    var list = document.createElement('div');
    list.className = 'fow-mtoc-list';
    list.setAttribute('role', 'navigation');
    list.setAttribute('aria-label', 'Contents');

    // entries[0] is "Top of Page" (target null = scroll to the very top)
    var entries = [{ label: 'Top of Page', target: null }].concat(sections);
    entries.forEach(function (entry) {
      var a = document.createElement('a');
      a.className = 'fow-mtoc-link';
      a.href = entry.target && entry.target.id ? '#' + entry.target.id : '#';
      a.textContent = entry.label;
      entry.link = a;
      list.appendChild(a);
    });

    panel.appendChild(head);
    panel.appendChild(list);
    document.body.appendChild(fab);
    document.body.appendChild(scrim);
    document.body.appendChild(panel);

    // ── Which entry is on screen ──────────────────────────────
    // The last heading that has reached the upper half of the viewport; if none
    // has, the reader is still at the top of the page.
    function currentIndex() {
      var line = root.clientHeight / 2;
      var idx = 0;
      for (var i = 1; i < entries.length; i++) {
        if (entries[i].target.getBoundingClientRect().top <= line) idx = i;
      }
      return idx;
    }
    function markCurrent() {
      var idx = currentIndex();
      entries.forEach(function (entry, i) {
        entry.link.classList.toggle('is-current', i === idx);
        if (i === idx) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
      return entries[idx].link;
    }

    // ── Open / close ──────────────────────────────────────────
    var isOpen = false;
    var lockedY = 0;
    var popPending = false;     // we called history.back() ourselves and are waiting for its popstate
    var afterPop = null;        // scroll to run once that popstate has landed
    var prevRestoration = null; // history.scrollRestoration to put back once the panel is fully closed

    function lockPage() {
      lockedY = window.pageYOffset;
      root.style.setProperty('--fow-lock-top', -lockedY + 'px');
      root.classList.add('fow-mtoc-locked');
    }
    function unlockPage() {
      root.classList.remove('fow-mtoc-locked');
      root.style.removeProperty('--fow-lock-top');
      // 'instant' so the guide's html{scroll-behavior:smooth} can't animate the restore
      window.scrollTo({ top: lockedY, left: 0, behavior: 'instant' });
    }

    function open() {
      if (isOpen) return;
      isOpen = true;
      // While the panel is open the page owns scroll restoration. Otherwise the browser
      // restores the pre-open scroll position when the history entry is popped, which
      // lands after (and undoes) the scroll to the chosen section.
      prevRestoration = history.scrollRestoration;
      history.scrollRestoration = 'manual';
      history.pushState({ fowMtoc: true }, '');
      var current = markCurrent();
      lockPage();
      panel.classList.add('is-open');
      scrim.classList.add('is-open');
      fab.classList.add('is-hidden');
      // centre the current entry in the list if the list is long enough to scroll
      list.scrollTop += current.getBoundingClientRect().top - list.getBoundingClientRect().top -
                        (list.clientHeight - current.offsetHeight) / 2;
      close.focus({ preventScroll: true });
    }

    // Shuts the panel. fromPop: the history entry is already gone (Back gesture).
    // Every other route removes the entry it pushed with history.back(), so a later
    // Back is never a dead press.
    function closePanel(fromPop) {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      scrim.classList.remove('is-open');
      unlockPage();
      fab.classList.remove('is-hidden');
      fab.focus({ preventScroll: true });
      if (!fromPop && history.state && history.state.fowMtoc) {
        popPending = true;
        history.back();
      }
    }

    function restoreRestoration() {
      if (prevRestoration !== null) {
        history.scrollRestoration = prevRestoration;
        prevRestoration = null;
      }
    }

    function goTo(entry) {
      function run() {
        if (entry.target) entry.target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        else window.scrollTo({ top: 0, left: 0, behavior: scrollBehavior() });
      }
      if (isOpen && history.state && history.state.fowMtoc) {
        // history.back() is async, so start the scroll only after its popstate.
        afterPop = run;
        closePanel(false);
        setTimeout(function () {   // safety net if the popstate never arrives
          if (afterPop === run) { afterPop = null; popPending = false; restoreRestoration(); run(); }
        }, 400);
      } else {
        closePanel(true);
        restoreRestoration();
        run();
      }
    }

    window.addEventListener('popstate', function () {
      if (popPending) {
        popPending = false;
        restoreRestoration();
        var run = afterPop;
        afterPop = null;
        if (run) run();
        return;
      }
      closePanel(true);   // Back gesture/button while the panel is open
      restoreRestoration();
    });

    fab.addEventListener('click', open);
    close.addEventListener('click', function () { closePanel(false); });
    scrim.addEventListener('click', function () { closePanel(false); });

    list.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('.fow-mtoc-link') : null;
      if (!a) return;
      e.preventDefault();
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].link === a) { goTo(entries[i]); break; }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        closePanel(false);
        return;
      }
      if (e.key === 'Tab') {   // keep focus inside the modal panel
        var focusable = panel.querySelectorAll('button, a[href]');
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Widening past the breakpoint while open (rotation) would leave the page locked
    // behind a hidden panel, so close it.
    function onBreakpoint() { if (!mq.matches) closePanel(false); }
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else mq.addListener(onBreakpoint);

    // ── Lift the button above the footer ──────────────────────
    // lift = how much of the footer is on screen. The button always shows; CSS
    // raises it by --fow-lift so it rests just above the footer's top edge, and it
    // drops back to the corner as the footer leaves.
    var footer = document.querySelector('footer');
    var ticking = false;
    function updateLift() {
      ticking = false;
      var lift = 0;
      if (footer) lift = Math.max(0, root.clientHeight - footer.getBoundingClientRect().top);
      fab.style.setProperty('--fow-lift', lift + 'px');
    }
    function requestLift() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateLift);
    }
    window.addEventListener('scroll', requestLift, { passive: true });
    window.addEventListener('resize', requestLift);
    window.addEventListener('load', requestLift);
    updateLift();
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
