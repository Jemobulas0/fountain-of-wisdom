/* ═══════════════════════════════════════════
   FOUNTAIN OF WISDOM — TOOLTIP ENGINE
   Load items.json + heroes.json, show popups
   on hover, debug mode via ?debug=tooltips
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  // Icon src resolver shared with hero-loader.js — see icon-src.js.
  const resolveIconSrc = window.FoWIcon.src;
  // Derive data folder path from this script's own src attribute
  var scriptEl = document.currentScript;
  var DATA_PATH = scriptEl ? scriptEl.src.replace(/[^/]*$/, '') : '../data/';

  let ITEMS = {};
  let HEROES = {};
  let loaded = false;
  let tooltipEl = null;
  let tooltipInner = null;
  let activeTarget = null;

  // ── Create tooltip DOM element ──
  function createTooltipElement() {
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'fow-tooltip';
    tooltipEl.id = 'fowTooltip';
    tooltipInner = document.createElement('div');
    tooltipInner.className = 'fow-tooltip-inner';
    tooltipEl.appendChild(tooltipInner);
    document.body.appendChild(tooltipEl);
  }

  // ── Load JSON data ──
  async function loadData() {
    try {
      const [itemsResp, heroesResp] = await Promise.all([
        fetch(DATA_PATH + 'items.json'),
        fetch(DATA_PATH + 'heroes.json')
      ]);
      ITEMS = await itemsResp.json();
      HEROES = await heroesResp.json();
      loaded = true;

      // Run debug mode if URL has ?debug=tooltips
      if (new URLSearchParams(window.location.search).get('debug') === 'tooltips') {
        runDebug();
      }
    } catch (e) {
      console.warn('[FoW Tooltips] Could not load tooltip data:', e);
    }
  }

  // ── Build a single aghs block ──
  function buildAghsBlock(aghs) {
    var tagClass = aghs.tag === 'upgrade' ? 'upgrade' : 'new-ability';
    var html = '<div class="fow-tt-aghs">';
    html += '<div class="fow-tt-aghs-header">';
    if (aghs.ability_icon) html += '<div class="fow-tt-aghs-ability-icon"><img src="' + resolveIconSrc(aghs.ability_icon, 'abilities') + '" alt="' + aghs.ability + '"></div>';
    html += '<div class="fow-tt-aghs-ability-name">' + aghs.ability + '</div>';
    html += '<span class="fow-tt-aghs-tag ' + tagClass + '">' + aghs.tag + '</span>';
    html += '</div>';
    html += '<div class="fow-tt-aghs-desc">' + aghs.desc.replace(/\n/g, '<br>') + '</div>';
    html += '</div>';
    return html;
  }

  // ── Build item tooltip HTML ──
  function buildItemTooltip(itemKey, heroKey) {
    const item = ITEMS[itemKey];
    if (!item) return null;

    // Aghs-only items: show ONLY the hero-specific upgrade
    if (item.aghs_only) {
      if (!item.aghs || !heroKey || !item.aghs[heroKey]) return null;
      var aghs = item.aghs[heroKey];
      var html = '<div class="fow-tt-body">';
      if (Array.isArray(aghs)) {
        aghs.forEach(function(entry) { html += buildAghsBlock(entry); });
      } else {
        html += buildAghsBlock(aghs);
      }
      html += '</div>';
      return html;
    }

    var html = '';

    // Header: icon, name, cost top-right
    html += '<div class="fow-tt-header">';
    html += '<div class="fow-tt-icon"><img src="' + resolveIconSrc(item.icon, 'items') + '" alt="' + item.name + '"></div>';
    html += '<div class="fow-tt-name">' + item.name + '</div>';
    if (item.cost) html += '<div class="fow-tt-cost">' + item.cost + '</div>';
    html += '</div>';

    // Body
    html += '<div class="fow-tt-body">';

    // Ability type (e.g. "Ability: Point Target")
    if (item.type) {
      var typeMatch = item.type.match(/^([^:]+:)\s*(.*)$/);
      if (typeMatch) {
        html += '<div class="fow-tt-type"><span class="fow-tt-type-label">' + typeMatch[1] + '</span> <span class="fow-tt-type-value">' + typeMatch[2] + '</span></div>';
      } else {
        html += '<div class="fow-tt-type">' + item.type + '</div>';
      }
    }

    // Passive stats
    if (item.stats) {
      html += '<div class="fow-tt-stats">' + item.stats.replace(/\n/g, '<br>') + '</div>';
    }

    // Active ability
    if (item.active) {
      html += '<div class="fow-tt-active">';
      html += '<div class="fow-tt-active-header">';
      html += '<span class="fow-tt-active-label">' + item.active.label + '</span>';
      if (item.active.range) {
        html += '<span class="fow-tt-active-range"><span class="fow-tt-range-dot"></span>' + item.active.range + '</span>';
      }
      html += '</div>';
      html += '<div class="fow-tt-active-desc">' + item.active.desc.replace(/\n/g, '<br>') + '</div>';
      html += '</div>';
    }

    // Passive description (items with only a desc and no active)
    if (item.desc && !item.active) {
      html += '<div class="fow-tt-desc">' + item.desc.replace(/\n/g, '<br>') + '</div>';
    }

    // Aghs hero-specific upgrade (on normal items like regular scepter)
    if (item.aghs && heroKey && item.aghs[heroKey]) {
      var aghs = item.aghs[heroKey];
      if (Array.isArray(aghs)) {
        aghs.forEach(function(entry) { html += buildAghsBlock(entry); });
      } else {
        html += buildAghsBlock(aghs);
      }
    }

    html += '</div>';
    return html;
  }

  // ── Build hero tooltip HTML ──
  function buildHeroTooltip(heroKey) {
    var hero = HEROES[heroKey];
    if (!hero) return null;

    var html = '<div class="fow-tt-hero">';
    html += '<div class="fow-tt-hero-avatar"><img src="' + resolveIconSrc(hero.icon, 'heroes') + '" alt="' + hero.name + '"></div>';
    html += '<div class="fow-tt-hero-name">' + hero.name + '</div>';
    html += '</div>';
    return html;
  }

  // ── Show tooltip ──
  function showTooltip(target) {
    if (!loaded) return;

    var type = target.getAttribute('data-tooltip');
    var html = null;

    if (type === 'item') {
      var itemKey = target.getAttribute('data-item');
      if (!itemKey) return;
      var heroKey = target.getAttribute('data-hero') || null;
      html = buildItemTooltip(itemKey, heroKey);
    } else if (type === 'hero') {
      var heroKey = target.getAttribute('data-hero-key');
      if (!heroKey) return;
      html = buildHeroTooltip(heroKey);
    }

    if (!html) return;

    tooltipInner.innerHTML = html;
    tooltipEl.style.display = 'block';
    activeTarget = target;

    requestAnimationFrame(function() { positionTooltip(target); });
  }

  // ── Position tooltip ──
  function positionTooltip(target) {
    // Use the visible icon element inside the link, not the <a> itself
    var posEl = target.querySelector('.item-icon, .inline-icon, .sit-item-icon, .hero-thumb-icon') || target;
    var rect = posEl.getBoundingClientRect();
    var ttRect = tooltipEl.getBoundingClientRect();
    var pad = 8;

    // Default: above the icon, centered
    var left = rect.left + (rect.width / 2) - (ttRect.width / 2);
    var top = rect.top - ttRect.height - pad;

    // If too high, show below
    if (top < 4) {
      top = rect.bottom + pad;
    }

    // Clamp horizontal
    if (left < 4) left = 4;
    if (left + ttRect.width > window.innerWidth - 4) {
      left = window.innerWidth - ttRect.width - 4;
    }

    tooltipEl.style.left = left + 'px';
    tooltipEl.style.top = top + 'px';
    tooltipEl.classList.add('visible');
  }

  // ── Hide tooltip ──
  function hideTooltip() {
    tooltipEl.classList.remove('visible');
    activeTarget = null;
    setTimeout(function() {
      if (!activeTarget) tooltipEl.style.display = 'none';
    }, 150);
  }

  // ── Event delegation ──
  function attachEvents() {
    document.addEventListener('mouseenter', function(e) {
      if (!e.target || typeof e.target.closest !== 'function') return;
      var target = e.target.closest('[data-tooltip]');
      if (target) showTooltip(target);
    }, true);

    document.addEventListener('mouseleave', function(e) {
      if (!e.target || typeof e.target.closest !== 'function') return;
      var target = e.target.closest('[data-tooltip]');
      if (target && target === activeTarget) hideTooltip();
    }, true);
  }

  // ── Debug mode ──
  function runDebug() {
    var els = document.querySelectorAll('[data-tooltip]');
    var missing = 0;
    var ok = 0;

    els.forEach(function(el) {
      var type = el.getAttribute('data-tooltip');
      var found = false;

      if (type === 'item') {
        var key = el.getAttribute('data-item');
        found = key && ITEMS[key];
      } else if (type === 'hero') {
        var key = el.getAttribute('data-hero-key');
        found = key && HEROES[key];
      }

      // Apply debug styles to the visible icon element, not the wrapper <a>
      var visEl = el.querySelector('.item-icon, .inline-icon, .sit-item-icon, .hero-thumb-icon') || el;

      if (found) {
        visEl.classList.add('fow-debug-ok');
        ok++;
      } else {
        visEl.classList.add('fow-debug-missing');
        visEl.style.position = visEl.style.position || 'relative';
        var label = document.createElement('span');
        label.className = 'fow-debug-label';
        label.textContent = 'MISSING';
        visEl.appendChild(label);
        missing++;
      }
    });

    console.log('[FoW Debug] Tooltips: ' + ok + ' OK, ' + missing + ' MISSING');
  }

  // ── Init ──
  createTooltipElement();
  attachEvents();
  loadData();

})();
