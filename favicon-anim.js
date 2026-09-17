/* ══════════════════════════════════════════════════════════
   FAVICON-ANIM.JS — animates the Twin Gate favicon in the
   browser tab. Linked from every page with one line:
   <script src="favicon-anim.js" defer></script>
   (use "../favicon-anim.js" from pages in a subfolder), placed
   right after the nav.js include.

   Browsers do not animate an SVG favicon (SMIL or CSS) or a
   GIF favicon in the tab strip — they freeze on a single frame.
   So this draws each frame to an offscreen canvas and repoints
   the <link rel="icon"> tag(s) at a new data URL on a timer.

   This script never touches the static favicon.svg file or the
   <link> tags' initial href. If canvas isn't available, if no
   icon <link> is found, or if anything throws, the function
   below returns early or is caught, and the static favicon.svg
   already in the HTML keeps showing exactly as before.

   The animation pauses on document.visibilityState === 'hidden'
   so a backgrounded tab does nothing.
   ══════════════════════════════════════════════════════════ */
(function () {
  try {
    var iconLinks = Array.prototype.slice.call(
      document.querySelectorAll('link[rel~="icon"]')
    );
    if (!iconLinks.length) return;

    var SIZE = 64; // internal render resolution; browsers downscale this to the 16px/32px they actually display
    var canvas = document.createElement('canvas');
    canvas.width = SIZE;
    canvas.height = SIZE;
    var ctx = canvas.getContext('2d');
    if (!ctx || !canvas.toDataURL) return;

    var DEG = Math.PI / 180;
    var scale = SIZE / 100;
    var cx = 50 * scale;
    var cy = 50 * scale;

    // Geometry below mirrors favicon.svg's three arcs (same two colors,
    // same angular spans), but with the radii spread further apart —
    // at favicon.svg's original 44/33/22 spacing the gold outer and
    // middle rings merge into one blob at 16px. See CLAUDE.md task notes.
    var rings = [
      // outer, gold, rotates counter-clockwise
      { radius: 46, width: 7, color: '#c9a84c', start: 231 * DEG, end: 309 * DEG, ccw: false, dir: -1 },
      // middle, gold, rotates clockwise
      { radius: 30, width: 7, color: '#c9a84c', start: 107.44 * DEG, end: 162.5 * DEG, ccw: true, dir: 1 },
      // inner, cyan, rotates counter-clockwise
      { radius: 14, width: 7, color: '#3ec6e0', start: 17.51 * DEG, end: 72.57 * DEG, ccw: true, dir: -1 }
    ];

    var PERIOD = 10; // seconds for a full rotation, matches the in-game channel loop
    var ANGVEL = (2 * Math.PI) / PERIOD;
    var FRAME_MS = 100; // 10fps: the rotation is slow (36deg/s) and the icon is tiny, so this looks smooth while keeping redraws cheap

    function drawFrame(t) {
      ctx.clearRect(0, 0, SIZE, SIZE);
      for (var i = 0; i < rings.length; i++) {
        var ring = rings[i];
        var offset = ring.dir * ANGVEL * t;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.radius * scale, ring.start + offset, ring.end + offset, ring.ccw);
        ctx.lineWidth = ring.width * scale;
        ctx.lineCap = 'round';
        ctx.strokeStyle = ring.color;
        ctx.stroke();
      }
    }

    var startTime = null;
    var timer = null;

    function tick() {
      try {
        if (startTime === null) startTime = performance.now();
        var t = ((performance.now() - startTime) / 1000) % PERIOD;
        drawFrame(t);

        var url = canvas.toDataURL('image/png');
        for (var i = 0; i < iconLinks.length; i++) {
          // Replacing the node (not just mutating .href) is the reliable
          // way to get Chrome to repaint the tab icon on every frame.
          var old = iconLinks[i];
          if (!old.parentNode) continue;
          var next = old.cloneNode(false);
          next.href = url;
          old.parentNode.replaceChild(next, old);
          iconLinks[i] = next;
        }
      } catch (e) {
        // stop rather than let a failing tick spam every 100ms;
        // whatever frame is currently showing just stays put
        stop();
      }
    }

    function start() {
      if (timer) return;
      timer = setInterval(tick, FRAME_MS);
    }
    function stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    }

    if (document.visibilityState !== 'hidden') start();
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') stop();
      else start();
    });
  } catch (e) {
    // leave the static favicon.svg link(s) exactly as they were
  }
})();
