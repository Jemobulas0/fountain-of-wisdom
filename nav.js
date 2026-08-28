/* ══════════════════════════════════════════════════════════
   NAV.JS — mobile navigation. Linked from every page with one
   line: <script src="nav.js" defer></script>
   (use "../nav.js" from pages in a subfolder).

   Desktop (> 860px) is left completely untouched. This script
   only rewrites the nav DOM while the 860px media query is
   active, and fully reverses that when the viewport goes back
   up to desktop width.

   Below 860px it:
   - injects a hamburger <button class="nav-toggle"> between the
     brand and the Coaching CTA
   - lifts the .nav-cta anchor out of .nav-links so Coaching stays
     visible outside the menu, at the right
   - turns .nav-links into a dropdown panel, shown when <nav> has
     the .nav-open class (toggled by the button; closed on link
     tap, outside tap, or Escape)

   The dropdown is just the original <ul class="nav-links">
   restyled — nothing is rebuilt from a list — so any <li> added
   to that markup later (e.g. Concepts, currently commented out)
   shows up in the menu automatically.

   All visual styling lives in the nav section of mobile.css.
   ══════════════════════════════════════════════════════════ */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var links = nav.querySelector('.nav-links');
  if (!links) return;

  var ctaAnchor = links.querySelector('a.nav-cta');
  var ctaLi = ctaAnchor ? ctaAnchor.closest('li') : null;
  var ctaNext = ctaLi ? ctaLi.nextSibling : null;

  if (!links.id) links.id = 'nav-menu';

  var toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Menu');
  toggle.setAttribute('aria-controls', links.id);
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  function open() {
    nav.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function close() {
    nav.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function onToggle(e) {
    e.stopPropagation();
    if (nav.classList.contains('nav-open')) { close(); } else { open(); }
  }
  function onLinkClick(e) {
    if (e.target.closest('a')) close();
  }
  function onDocClick(e) {
    if (!nav.contains(e.target)) close();
  }
  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') close();
  }

  var active = false;

  function activate() {
    if (active) return;
    active = true;
    nav.insertBefore(toggle, links);
    if (ctaLi) {
      ctaLi.parentNode.removeChild(ctaLi);
      nav.appendChild(ctaAnchor);
    }
    toggle.addEventListener('click', onToggle);
    links.addEventListener('click', onLinkClick);
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
  }

  function deactivate() {
    if (!active) return;
    active = false;
    close();
    toggle.removeEventListener('click', onToggle);
    links.removeEventListener('click', onLinkClick);
    document.removeEventListener('click', onDocClick);
    document.removeEventListener('keydown', onKey);
    if (toggle.parentNode) toggle.parentNode.removeChild(toggle);
    if (ctaLi) {
      ctaLi.appendChild(ctaAnchor);
      links.insertBefore(ctaLi, ctaNext);
    }
  }

  var mq = window.matchMedia('(max-width: 860px)');
  function sync() { if (mq.matches) { activate(); } else { deactivate(); } }
  if (mq.addEventListener) { mq.addEventListener('change', sync); }
  else { mq.addListener(sync); }
  sync();
})();
