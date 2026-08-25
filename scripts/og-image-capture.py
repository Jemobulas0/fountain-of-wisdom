"""
OG / Discord preview image capture — The Fountain of Wisdom

What this does: launches headless Chrome, opens the REAL index.html (not a
rebuilt copy), injects a small render-time stylesheet over CDP to hide
elements that don't belong in a static preview image (nav, the scroll hint,
the description paragraph and action buttons below the fold) and to scale
the hero block up to fill the 1200x630 frame, then screenshots exactly
that viewport and saves it to og-image-v3.png. index.html on disk is never
touched — the injected <style> only exists in the headless tab's DOM for
the duration of this script.

Run it (from the repo root, with Chrome installed at the default path):

    python scripts/og-image-capture.py

That's the whole job. If only the tagline/eyebrow copy changed, edit the
text in index.html's .hero-subtitle / .hero-eyebrow first, then rerun this
script — nothing here needs to change for a copy-only update. If the hero
CSS itself changes (new elements, different padding, etc.), the INJECT_CSS
block below may need a matching tweak.

Requires: Chrome/Chromium at the path in CHROME_PATH below, and the Python
packages `requests` and `websocket-client` (pip install requests websocket-client).
"""

import json
import os
import subprocess
import time
import base64
import socket
import requests
import websocket

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
TARGET_URL = "file:///" + os.path.join(REPO_ROOT, "index.html").replace("\\", "/")
OUT_PATH = os.path.join(REPO_ROOT, "og-image-v3.png")
DEBUG_PORT = 9333

INJECT_CSS = """
.hero-desc { display: none !important; }
.hero-actions { display: none !important; }
.hero { min-height: 630px !important; padding: 0 40px !important; justify-content: center !important; }
nav { display: none !important; }
.scroll-hint { display: none !important; }
.hero-divider { margin-bottom: 0 !important; }
.hero-content { transform: scale(1.35); transform-origin: center center; }
"""


def port_open(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", port)) == 0


def send(ws, msg_id_box, method, params=None):
    msg_id_box[0] += 1
    my_id = msg_id_box[0]
    ws.send(json.dumps({"id": my_id, "method": method, "params": params or {}}))
    while True:
        resp = json.loads(ws.recv())
        if resp.get("id") == my_id:
            return resp


def main():
    proc = subprocess.Popen([
        CHROME_PATH, "--headless", "--disable-gpu",
        f"--remote-debugging-port={DEBUG_PORT}", "--remote-allow-origins=*",
        "--window-size=1200,630", "--hide-scrollbars",
        f"--user-data-dir={os.path.join(os.environ.get('TEMP', '.'), 'og-image-capture-profile')}",
        "about:blank",
    ])

    try:
        for _ in range(50):
            if port_open(DEBUG_PORT):
                break
            time.sleep(0.2)
        else:
            raise RuntimeError("Chrome debug port never came up")

        r = requests.put(f"http://localhost:{DEBUG_PORT}/json/new?{TARGET_URL}")
        ws_url = r.json()["webSocketDebuggerUrl"]

        ws = websocket.create_connection(ws_url)
        msg_id = [0]

        send(ws, msg_id, "Emulation.setDeviceMetricsOverride", {
            "width": 1200, "height": 630, "deviceScaleFactor": 1, "mobile": False,
        })
        send(ws, msg_id, "Page.enable")
        send(ws, msg_id, "Page.navigate", {"url": TARGET_URL})
        while True:
            evt = json.loads(ws.recv())
            if evt.get("method") == "Page.loadEventFired":
                break

        time.sleep(2)  # let webfonts settle

        inject_js = f"""
        (function() {{
          const style = document.createElement('style');
          style.textContent = {json.dumps(INJECT_CSS)};
          document.head.appendChild(style);
        }})();
        """
        send(ws, msg_id, "Runtime.evaluate", {"expression": inject_js})
        time.sleep(0.5)

        shot = send(ws, msg_id, "Page.captureScreenshot", {
            "format": "png",
            "clip": {"x": 0, "y": 0, "width": 1200, "height": 630, "scale": 1},
            "fromSurface": True,
            "captureBeyondViewport": False,
        })

        with open(OUT_PATH, "wb") as f:
            f.write(base64.b64decode(shot["result"]["data"]))

        ws.close()
        print("saved", OUT_PATH)

    finally:
        proc.terminate()
        try:
            proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            proc.kill()


if __name__ == "__main__":
    main()
