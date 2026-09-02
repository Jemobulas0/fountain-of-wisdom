// ─────────────────────────────────────────────────────────────────────────────
// icon-src.js
// Shared icon-source resolver for hero-loader.js and data/tooltips.js.
//
// Both scripts turn short asset ids into <img> srcs by prepending the Steam CDN
// base and a fixed subfolder (/abilities/, /items/, /heroes/, /icons/). This
// helper keeps that default but lets an icon value instead be a full URL or a
// local/relative path, which is then used verbatim.
//
//   FoWIcon.src(value, subfolder):
//     • starts with http:// or https://          → returned unchanged
//     • contains "/" or ends in .png/.jpg/.webp   → returned unchanged (a path)
//     • otherwise (a bare id)                     → CDN_BASE + "/" + subfolder + "/" + value + ".png"
//
// For a bare id the result is byte-identical to the old inline construction.
// ─────────────────────────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  var CDN_BASE = 'https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react';

  function resolveIconSrc(value, subfolder) {
    var v = String(value);
    if (/^https?:\/\//i.test(v)) return v;
    if (v.indexOf('/') !== -1 || /\.(png|jpg|webp)$/i.test(v)) return v;
    return CDN_BASE + '/' + subfolder + '/' + v + '.png';
  }

  global.FoWIcon = { base: CDN_BASE, src: resolveIconSrc };
})(typeof window !== 'undefined' ? window : this);
