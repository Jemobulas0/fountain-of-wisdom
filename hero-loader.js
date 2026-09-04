// ─────────────────────────────────────────────────────────────────────────────
// hero-loader.js
// Reads ?id=hero-id from the URL, fetches data/hero-id.json,
// and populates the entire hero page.
// ─────────────────────────────────────────────────────────────────────────────

let HERO_DATA = {};
let ITEM_PAGES = {};   // item id (canonical OR cdn/legacy alias) -> canonical page id; from data/item-pages.json

function getHeroName(id) {
  const hero = HERO_DATA[id];
  return (hero && hero.name) || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}


// ── POSITION GROUPS ───────────────────────────────────────────────────────────
// Defines the three timing groups. The loader uses this to build timestamp
// header circles and columns based on which positions the hero actually plays.
const POS_GROUPS = [
  { key: 'pos_1_3', positions: [1, 3] },
  { key: 'pos_2',   positions: [2] },
  { key: 'pos_4_5', positions: [4, 5] }
];

// Returns the active groups for a hero, with the circle label for each
function getActiveGroups(heroPositions) {
  return POS_GROUPS
    .map(function(group) {
      const active = group.positions.filter(function(p) {
        return heroPositions.indexOf(p) !== -1;
      });
      if (!active.length) return null;
      return { key: group.key, label: active.join('/') };
    })
    .filter(Boolean);
}


// Builds the ITEM_PAGES lookup from data/item-pages.json. Each entry is keyed by
// the item's canonical id (= its page filename) and may carry a "cdn" alias — the
// legacy id hero JSONs actually emit (e.g. Iron Branch is written as "branches").
// Both ids point at the same canonical page.
function buildItemPageIndex(registry) {
  ITEM_PAGES = {};
  Object.keys(registry || {}).forEach(function(canonical) {
    const entry = registry[canonical];
    if (!entry || typeof entry !== 'object') return;   // skip __README__ etc.
    ITEM_PAGES[canonical] = canonical;
    if (entry.cdn) ITEM_PAGES[entry.cdn] = canonical;
  });
}

// Wraps an item icon: a real link when the item has a page (listed in
// data/item-pages.json), a plain non-navigable span when it doesn't. The tooltip
// attributes (data-tooltip / data-item / data-hero) are identical either way —
// coverage decides the link, data/items.json decides the tooltip, never each other.
function itemLinkWrap(id, inner, opts) {
  opts = opts || {};
  const heroAttr = opts.hero ? ` data-hero="${opts.hero}"` : '';
  const styleAttr = opts.style ? ` style="${opts.style}"` : '';
  const attrs = `class="item-link" data-tooltip="item" data-item="${id}"${heroAttr}${styleAttr}`;
  const page = ITEM_PAGES[id];
  return page
    ? `<a href="items/${page}.html" ${attrs}>${inner}</a>`
    : `<span ${attrs}>${inner}</span>`;
}

// Renders a standard item icon with link and tooltip
function itemIconHTML(id, heroShard) {
  return itemLinkWrap(id,
    `<div class="item-icon"><img src="${FoWIcon.src(id, 'items')}" alt="${id}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></div>`,
    { hero: heroShard });
}

// Renders an item from a build phase — handles strings, plain objects, and timed objects
function buildItemHTML(item) {
  if (typeof item === 'string') {
    return itemIconHTML(item);
  }
  const { id, green, yellow, hero_shard, hero, also } = item;
  const heroContext = hero || hero_shard || null;
  let html = '';
  if (green || yellow) {
    html += `<div class="item-timed">`;
    if (green) html += `<span class="timestamp green">${green}</span>`;
    html += itemIconHTML(id, heroContext);
    if (yellow) html += `<span class="timestamp yellow">${yellow}</span>`;
    html += `</div>`;
  } else {
    html += itemIconHTML(id, heroContext);
  }
  if (also) html += itemIconHTML(also);
  return html;
}

// Parses [item:id] and [hero:id] tags inside tip text into inline icons
function parseText(text) {
  text = text.replace(/→/g, '<span style="color:var(--text-dim);font-size:17px;">→</span>');
  text = text.replace(/\[ability:([^\]]+)\]/g, function(_, id) {
    return `<span style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 2px;"><div class="ability-icon-inline"><img src="${FoWIcon.src(id, 'abilities')}" alt="${id}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></div></span>`;
  });
  text = text.replace(/\[item:([^|\]]+)(?:\|([^\]]+))?\]/g, function(_, id, hero) {
    return itemLinkWrap(id,
      `<div class="item-icon-inline"><img src="${FoWIcon.src(id, 'items')}" alt="${id}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></div>`,
      { hero: hero, style: 'display:inline-flex;align-items:center;vertical-align:middle;margin:0 2px;' });
  });
  // Inline hero mentions are tooltip triggers only — never navigation, whatever the hero's coverage.
  text = text.replace(/\[hero:([^\]]+)\]/g, function(_, id) {
    return `<span class="hero-link" data-tooltip="hero" data-hero-key="${id}" style="display:inline-flex;align-items:center;vertical-align:middle;margin:0 2px;"><div style="width:36px;height:20px;border-radius:2px;overflow:hidden;border:1px solid var(--border);"><img src="${FoWIcon.src(id, 'heroes')}" alt="${id}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"></div></span>`;
  });
  return text;
}


// Converts hex color to "r,g,b" string for use in rgba()
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return r + ',' + g + ',' + b;
}

// Creates a section div with a title
function makeSection(titleText) {
  const div = document.createElement('div');
  div.className = 'section';
  div.innerHTML = `<div class="section-title">${titleText}</div>`;
  return div;
}


// ── BUILDERS ──────────────────────────────────────────────────────────────────

function buildHeader(data) {
  document.title = `${data.name} — The Fountain of Wisdom`;

  const attrColors = {
    agility: 'var(--green)',
    strength: 'var(--red)',
    intelligence: 'var(--blue)',
    universal: '#b07aff'
  };
  const attrColor = attrColors[data.attribute] || 'var(--text)';
  const attrName = data.attribute.charAt(0).toUpperCase() + data.attribute.slice(1);

  document.getElementById('hero-center').innerHTML =
    `<div class="hero-avatar">` +
      `<img src="${FoWIcon.src(data.id, 'heroes')}" alt="${data.name}" onerror="this.parentElement.innerHTML='⚔️'">` +
    `</div>` +
    `<div class="hero-name">${data.name}</div>` +
    `<div class="hero-attr" style="color:${attrColor};">` +
      `<img src="${FoWIcon.src('hero_' + data.attribute, 'icons')}" alt="${attrName}" style="width:16px;height:16px;">` +
      attrName +
    `</div>`;

  document.getElementById('header-right').innerHTML =
    `<div class="version-badge">v ${data.version}</div>`;
}


function buildOverview(ov) {
  const section = makeSection('Roles &amp; Overview');

  let circles = '';
  for (let i = 1; i <= 5; i++) {
    circles += `<div class="pos-circle${ov.positions.indexOf(i) !== -1 ? ' active' : ''}">${i}</div>`;
  }

  const pros = ov.strengths.map(function(s) { return `<li>${s}</li>`; }).join('');
  const cons = ov.weaknesses.map(function(w) { return `<li>${w}</li>`; }).join('');

  section.innerHTML +=
    `<div class="positions-row">${circles}</div>` +
    `<div class="roles-text">${ov.roles}</div>` +
    `<div class="pros-cons">` +
      `<div class="pros-cons-col pros"><h4>Strengths</h4><ul>${pros}</ul></div>` +
      `<div class="pros-cons-col cons"><h4>Weaknesses</h4><ul>${cons}</ul></div>` +
    `</div>`;
  return section;
}


function buildGamePlan(gp) {
  const section = makeSection('Game Plan');

  const extras = gp.extras
    ? `<div class="extras-box"><h4>Extras</h4><p>${gp.extras}</p></div>`
    : '';

  section.innerHTML +=
    `<div class="gameplan-grid">` +
      `<div class="gameplan-phase"><h4>Early Game</h4><p>${gp.early}</p></div>` +
      `<div class="gameplan-phase"><h4>Mid Game</h4><p>${gp.mid}</p></div>` +
      `<div class="gameplan-phase"><h4>Late Game</h4><p>${gp.late}</p></div>` +
    `</div>` +
    extras;
  return section;
}


function buildSkillBuilds(builds, heroPositions) {
  const section = makeSection('Skill Builds');

  const legend =
    `<div class="tips-legend" style="justify-content:center;margin-bottom:14px;">` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div><span style="color:var(--green)">New player timings</span></div>` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--yellow)"></div><span style="color:var(--yellow)">Casual player timings</span></div>` +
    `</div>`;

  const activeGroups = getActiveGroups(heroPositions);

  const buildsHTML = builds.map(function(build) {
    const tsHeader = activeGroups.length >= 2
      ? `<div class="timestamp-header"><div class="timestamp-header-inner">` +
          activeGroups.map(function(g) {
            return `<div class="th-col"><div class="pos-circle-sm">${g.label}</div></div>`;
          }).join('') +
        `</div></div>`
      : '';

    const rowsHTML = build.rows.map(function(row) {
      const icons = row.abilities.map(function(ab) {
        const isUlt = ab === build.ult;
        return `<div class="spell-icon${isUlt ? ' ult' : ''}"><img src="${FoWIcon.src(ab, 'abilities')}" alt="${ab}"></div>`;
      }).join('');

      let timestamps = '';
      if (row.timestamps && activeGroups.length) {
        const cols = activeGroups.map(function(g) {
          const val = row.timestamps[g.key];
          if (!val) return `<div class="timestamp-col"></div>`;
          const parts = val.split('/');
          return `<div class="timestamp-col"><span class="timestamp green">${parts[0]}</span><span class="timestamp yellow">${parts[1]}</span></div>`;
        }).join('');
        timestamps = `<div class="timestamp-group">${cols}</div>`;
      }

      return `<div class="spell-row">${icons}${timestamps}</div>`;
    }).join('');

    const talentsHTML = build.talents.map(function(t) {
      return `<div class="talent-row">` +
        `<div class="talent-box${t.chosen === 'left' ? ' chosen' : ''}">${t.left}</div>` +
        `<div class="talent-lvl">${t.level}</div>` +
        `<div class="talent-box${t.chosen === 'right' ? ' chosen' : ''}">${t.right}</div>` +
      `</div>`;
    }).join('');

    // 2 subgrid rows: .build-inner (content) + .build-note (description).
    // Literal span, identical for every card — see the .build-card CSS comment.
    return `<div class="build-card" style="grid-row:span 2">` +
      `<div class="build-inner">` +
        `<h4>${build.name}</h4>` +
        `<div class="build-body"><div class="build-spells">${tsHeader}${rowsHTML}</div></div>` +
        `<div class="talent-tree">${talentsHTML}</div>` +
        (build.talent_note ? `<div class="talent-note-label">${build.talent_note}</div>` : '') +
      `</div>` +
      `<div class="build-note">${build.note}</div>` +
    `</div>`;
  }).join('');

  const skillGridCols = Array(builds.length).fill('1fr').join(' ');
  section.innerHTML += legend + `<div class="builds-grid" style="grid-template-columns:${skillGridCols};grid-template-rows:1fr auto">${buildsHTML}</div>`;
  return section;
}


// Renders the optional Enchantment row at the foot of a build's last phase
// (the Core Build phase). Absent/empty build.enchantment -> caller skips this
// entirely, so no empty row or reserved space.
// Icon sizing is NOT set here: the <span> uses .item-icon-inline, the same class
// [item:id] uses inside body text, so its size always tracks that CSS rule.
// When ench.tooltip is present, the full enchantment spec is stashed on
// window.FOW_ENCHANTMENTS so data/tooltips.js (loaded separately, no shared data
// file for enchantments yet) can build the popup for the existing tooltip engine
// without hero-loader.js reaching into its DOM.
function enchantmentRowHTML(ench) {
  if (!ench || !ench.name) return '';
  if (ench.tooltip && ench.id) {
    window.FOW_ENCHANTMENTS = window.FOW_ENCHANTMENTS || {};
    window.FOW_ENCHANTMENTS[ench.id] = ench;
  }
  const src = FoWIcon.src(ench.icon || ench.id, 'items');
  const tipAttr = (ench.tooltip && ench.id) ? ` data-tooltip="enchantment" data-enchantment="${ench.id}"` : '';
  return `<div class="enchantment-row"${tipAttr}>` +
    `<span class="enchantment-label">Enchantment:</span>` +
    `<span class="item-icon-inline"><img src="${src}" alt="${ench.name}" onerror="this.closest('.item-icon-inline').remove()" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></span>` +
    `<span class="enchantment-name">${ench.name}</span>` +
  `</div>`;
}

function buildItemBuilds(builds, situational) {
  const section = makeSection('Item Builds');

  const legend =
    `<div class="tips-legend" style="justify-content:center;margin-bottom:14px;">` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div><span style="color:var(--green)">New player timings</span></div>` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--yellow)"></div><span style="color:var(--yellow)">Casual player timings</span></div>` +
    `</div>`;

  // Widest build sets the shared row count: title + one row per phase + note.
  const maxPhases = builds.reduce(function(m, b) { return Math.max(m, b.phases.length); }, 0);
  const rowCount = maxPhases + 2;

  const buildsHTML = builds.map(function(build) {
    const phasesHTML = build.phases.map(function(phase, i) {
      const items = phase.items.map(buildItemHTML).join('');
      const note = phase.note ? `<div class="item-note-inline">${parseText(phase.note)}</div>` : '';
      // Enchantment row belongs to the build, but renders at the foot of its last
      // phase (the Core Build phase) — below the last item row, above build-note's
      // divider — so it stays nested inside the subgrid row instead of adding one.
      const ench = (i === build.phases.length - 1) ? enchantmentRowHTML(build.enchantment) : '';
      return `<div class="item-phase"><div class="item-phase-label">${phase.label}</div><div class="item-row">${items}</div>${note}${ench}</div>`;
    }).join('');

    // h4, each phase and the note are direct grid children so every one is its
    // own subgrid row and lines up with the matching row in the other card.
    // grid-row span is a literal integer (identical for every card in this grid);
    // a custom property here would degrade to span 1 in some engines.
    return `<div class="build-card" style="grid-row:span ${rowCount}">` +
      `<h4>${build.name}</h4>` +
      phasesHTML +
      `<div class="build-note">${parseText(build.note)}</div>` +
    `</div>`;
  }).join('');

  let sitHTML = '';
  if (situational && situational.length) {
    const sitItemsHTML = situational.map(function(item) {
      const mainIcon = itemLinkWrap(item.id,
        `<div class="sit-item-icon"><img src="${FoWIcon.src(item.id, 'items')}" alt="${item.id}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></div>`,
        { hero: item.hero || item.hero_shard });
      const alsoIds = Array.isArray(item.also) ? item.also : [item.also, item.also2, item.also3].filter(Boolean);
      const alsoIcons = alsoIds.map(function(a) {
        return itemLinkWrap(a,
          `<div class="sit-item-icon"><img src="${FoWIcon.src(a, 'items')}" alt="${a}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:2px;"></div>`);
      }).join('');
      return `<div class="sit-item">${mainIcon}${alsoIcons}<div class="sit-item-note">${parseText(item.note)}</div></div>`;
    }).join('');

    sitHTML =
      `<div class="situational-items">` +
        `<div class="situational-label">Situational Items</div>` +
        sitItemsHTML +
      `</div>`;
  }

  const itemGridCols = Array(builds.length).fill('1fr').join(' ');
  const itemGridRows = new Array(rowCount).fill('auto').join(' '); // title + phases + note — the shared track list
  section.innerHTML += legend + `<div class="builds-grid" style="grid-template-columns:${itemGridCols};grid-template-rows:${itemGridRows}">${buildsHTML}</div>` + sitHTML;
  return section;
}


function buildTips(tips) {
  const section = makeSection('Tips &amp; Tricks');

  const legendHTML =
    `<div class="tips-legend">` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--green)"></div><span style="color:var(--green)">Basic</span></div>` +
      `<div class="legend-item"><div class="legend-dot" style="background:var(--yellow)"></div><span style="color:var(--yellow)">Advanced</span></div>` +
    `</div>`;

  const tipsHTML = tips.map(function(tip) {
    return `<div class="tip ${tip.level}">${parseText(tip.text)}</div>`;
  }).join('');

  section.innerHTML += legendHTML + `<div class="tips-list">${tipsHTML}</div>`;
  return section;
}


function buildAlliesCounters(ac) {
  const section = makeSection('Allies &amp; Counters');

  function colHTML(data, type) {
    const titles = { allies: 'Allies', counters: 'Strong Against', countered: 'Weak Against' };
    const heroes = data.heroes.map(function(id) {
      const meta = HERO_DATA[id];
      const thumb =
        `<div class="hero-thumb">` +
          `<div class="hero-thumb-icon"><img src="${FoWIcon.src(id, 'heroes')}" alt="${getHeroName(id)}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block;"></div>` +
          `<div class="hero-thumb-name">${getHeroName(id)}</div>` +
        `</div>`;
      // Clickable only when the hero has a page; otherwise the same portrait with no link.
      return (meta && meta.covered)
        ? `<a href="hero_template.html?id=${meta.page || id}" class="hero-link">${thumb}</a>`
        : thumb;
    }).join('');
    return `<div class="syn-col ${type}"><h4>${titles[type]}</h4><div class="hero-thumbs">${heroes}</div><div class="syn-note">${data.note}</div></div>`;
  }

  section.innerHTML +=
    `<div class="syn-grid">` +
      colHTML(ac.allies, 'allies') +
      colHTML(ac.counters, 'counters') +
      colHTML(ac.countered_by, 'countered') +
    `</div>`;
  return section;
}


// ── INIT ──────────────────────────────────────────────────────────────────────

const heroId = new URLSearchParams(window.location.search).get('id');

if (!heroId) {
  document.getElementById('hero-sections').innerHTML =
    '<div style="padding:40px;text-align:center;color:var(--text-dim);">No hero specified. Add ?id=hero-name to the URL.</div>';
} else {
  Promise.all([
    fetch('heroes/' + heroId + '.json').then(function(r) {
      if (!r.ok) throw new Error('Hero not found: ' + heroId);
      return r.json();
    }),
    fetch('data/heroes.json').then(function(r) { return r.json(); }),
    fetch('data/item-pages.json').then(function(r) { return r.ok ? r.json() : {}; }).catch(function() { return {}; })
  ])
    .then(function(results) {
      const data = results[0];
      HERO_DATA = results[1];
      buildItemPageIndex(results[2]);
      buildHeader(data);
      const container = document.getElementById('hero-sections');
      container.appendChild(buildOverview(data.overview));
      container.appendChild(buildGamePlan(data.game_plan));
      container.appendChild(buildSkillBuilds(data.skill_builds, data.overview.positions));
      container.appendChild(buildItemBuilds(data.item_builds, data.situational_items));
      container.appendChild(buildTips(data.tips));
      container.appendChild(buildAlliesCounters(data.allies_and_counters));
    })
    .catch(function(err) {
      console.error('Failed to load hero:', err);
      document.getElementById('hero-sections').innerHTML =
        '<div style="padding:40px;text-align:center;color:var(--red);">Failed to load hero data.</div>';
    });
}
