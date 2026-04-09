/* ═══════════════════════════════════════════
   FOUNTAIN OF WISDOM — TOOLTIP ENGINE
   Load items.json + heroes.json, show popups
   on hover, debug mode via ?debug=tooltips
   ═══════════════════════════════════════════ */

(function() {
  'use strict';

  const CDN = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';
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

  // ── Build item tooltip HTML ──
  function buildItemTooltip(itemKey, heroKey) {
    const item = ITEMS[itemKey];
    if (!item) return null;

    let html = '';

    // Header
    html += '<div class="fow-tt-header">';
    html += '<div class="fow-tt-icon"><img src="' + CDN + '/items/' + item.icon + '.png" alt="' + item.name + '"></div>';
    html += '<div class="fow-tt-name">' + item.name + '</div>';
    if (item.cost) html += '<div class="fow-tt-cost">' + item.cost + '</div>';
    html += '</div>';

    // Body
    html += '<div class="fow-tt-body">';

    if (item.stats) {
      html += '<div class="fow-tt-stats">' + item.stats.replace(/\n/g, '<br>') + '</div>';
    }

    if (item.desc) {
      html += '<div class="fow-tt-desc">' + item.desc.replace(/\n/g, '<br>') + '</div>';
    }

    // Aghs hero-specific upgrade
    if (item.aghs && heroKey && item.aghs[heroKey]) {
      var aghs = item.aghs[heroKey];
      var tagClass = aghs.tag === 'upgrade' ? 'upgrade' : 'new-ability';
      html += '<div class="fow-tt-aghs">';
      html += '<div class="fow-tt-aghs-header">';
      html += '<div class="fow-tt-aghs-ability-icon"><img src="' + CDN + '/abilities/' + aghs.ability_icon + '.png" alt="' + aghs.ability + '"></div>';
      html += '<div class="fow-tt-aghs-ability-name">' + aghs.ability + '</div>';
      html += '<span class="fow-tt-aghs-tag ' + tagClass + '">' + aghs.tag + '</span>';
      html += '</div>';
      html += '<div class="fow-tt-aghs-desc">' + aghs.desc.replace(/\n/g, '<br>') + '</div>';
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ── Build hero tooltip HTML ──
  function buildHeroTooltip(heroKey) {
    var hero = HEROES[heroKey];
    if (!hero) return null;

    var html = '<div class="fow-tt-hero">';
    html += '<div class="fow-tt-hero-avatar"><img src="' + CDN + '/heroes/' + hero.icon + '.png" alt="' + hero.name + '"></div>';
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
      var target = e.target.closest('[data-tooltip]');
      if (target) showTooltip(target);
    }, true);

    document.addEventListener('mouseleave', function(e) {
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

      if (found) {
        el.classList.add('fow-debug-ok');
        ok++;
      } else {
        el.classList.add('fow-debug-missing');
        // Add "MISSING" label
        el.style.position = el.style.position || 'relative';
        var label = document.createElement('span');
        label.className = 'fow-debug-label';
        label.textContent = 'MISSING';
        el.appendChild(label);
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
