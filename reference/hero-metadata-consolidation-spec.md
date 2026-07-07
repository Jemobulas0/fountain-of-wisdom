# Hero Metadata — Single Source of Truth Consolidation

**For:** Axi (execute in Claude Code, against `D:\GitHub\fountain-of-wisdom\`)
**Goal:** Make `data/heroes.json` the one place hero metadata lives. Eliminate the two hardcoded duplicates so a hero can never again be present in one list and missing/misnamed in another.

Confirm `CLAUDE.md` loaded and you're scoped to the project folder before starting.

---

## Background — the current state (already audited, don't re-discover)

Three independent hero lists exist and are maintained by hand:

1. **`data/heroes.json`** — `{ cdn_id: { name, icon } }`, 127 heroes. Read by `data/tooltips.js` (hover cards). Keyed by CDN/internal id. Cleanest of the three.
2. **`hero-loader.js` → `HERO_NAMES`** — `{ id: "Display Name" }`, 129 entries. Used in exactly ONE place: the name labels in the Allies & Counters chips (`colHTML`, via `getHeroName`). Keyed inconsistently — this is the source of the wrong-name bug (see below).
3. **`heroes.html` → `heroes` array** — `{ name, key, attr, roles, covered, cdn? }`, 127 heroes. Drives the landing/grid page. Plus a separate `recentlyAddedHeroes` array (8 ids, editorial order) for the "recently added" strip.

**They all cover the same 127 heroes.** The 129 vs 127 gap is not missing heroes — it's `HERO_NAMES` using a different key convention for some heroes, missing correct keys for Clockwerk (`rattletrap`) and Timbersaw (`shredder`), and carrying a redundant duplicate for Wraith King.

**Live symptom to verify before and after:** On the Spirit Breaker page, Allies & Counters → "Countered By" column, Underlord's label currently reads **"Abyssal Underlord"** (wrong). After this job it should read **"Underlord"**.

---

## Design decision (fixed — don't deviate)

The consolidated `heroes.json` stays **keyed by CDN/internal id** (e.g. `abyssal_underlord`, `life_stealer`, `skeleton_king`, `zuus`, `furion`, `wisp`).

Reason: the runtime consumers that already work — `tooltips.js`, the `[hero:...]` refs, the Allies & Counters id lists in every hero JSON — all use the CDN id as the lookup key. Keeping that convention means we do NOT have to touch any hero JSON's cross-references. `HERO_NAMES`' alternate keys are the *wrong* convention and get discarded.

### Target record shape

```
"abyssal_underlord": {
  "name": "Underlord",
  "icon": "abyssal_underlord",
  "attr": "str",
  "roles": ["offlane"],
  "covered": false
}
```

For the two heroes whose **page-file id differs from their icon id**, add a `page` field:

```
"life_stealer": {
  "name": "Lifestealer", "icon": "life_stealer", "page": "lifestealer",
  "attr": "str", "roles": ["carry"], "covered": true
},
"skeleton_king": {
  "name": "Wraith King", "icon": "skeleton_king", "page": "wraith_king",
  "attr": "str", "roles": ["carry","offlane"], "covered": true
}
```

Consumers then use: `icon` (or the key) for portraits/tooltips, `page || key` for the hero-page link, `name` for labels, `attr`/`roles`/`covered` for the grid.

---

## Step 0 — Confirm on-disk facts (HARD STOP if anything's off)

Do not assume. Report these back before editing:

1. List `data/heroes/*.json`. Confirm the actual filenames for Lifestealer and Wraith King (the split-key heroes). Is it `lifestealer.json` / `wraith_king.json`, or the CDN spelling? Whatever the real filename is becomes the `page` value. If a covered hero's file uses yet another spelling, flag it.
2. Re-derive the three counts yourself (don't trust this doc's numbers). Confirm grid roster and `heroes.json` are the same 127 heroes when compared by `cdn || key`.
3. Confirm `tooltips.js` fetches `data/heroes.json` and reads `.name` / `.icon`. Note the exact fetch/parse pattern — Phase 2 will mirror it.

---

## Phase 1 — Enrich `heroes.json` into the superset

Build this with a **script**, not by hand, to avoid transcription error. For each entry in the `heroes` array in `heroes.html`:

- record key = `cdn || key` (CDN id)
- `name` = grid `name`
- `icon` = `cdn || key`
- `attr`, `roles`, `covered` = copied from grid
- `page` = grid `key`, **only if** it differs from the record key

Merge onto the existing `heroes.json` (which already has correct `name`/`icon`). After generating, assert the new key set is identical to the current `heroes.json` key set (same 127). If any key appears/disappears, STOP and report — that means the two sources disagree and Jemo needs to see it.

Write it back with stable key order and 2-space indentation. Do not reorder existing keys gratuitously — keep the diff legible.

**Do not proceed to Phase 2 until Jemo has previewed the site and confirmed nothing broke.** (Phase 1 alone changes nothing visible — `heroes.json` still only feeds tooltips — so this is a safe checkpoint.)

---

## Phase 2 — Reroute the readers to `heroes.json`

Mirror the async fetch pattern `tooltips.js` already uses. All three consumers now read from the one file.

**2a — `heroes.html` grid.** Replace the inline `heroes` array with a fetch of `data/heroes.json` at load, transforming the object into the array shape the grid rendering already expects (`{ name, key, attr, roles, covered, cdn, page }`, where `key` = the object key, `cdn`/`icon` = `.icon`, `page` = `.page`). Keep all existing render/filter logic intact — only the data *source* changes. Confirm the landing page still fetches before it renders (the grid must wait on the fetch, same as tooltips does).

**2b — `recentlyAddedHeroes`.** Replace with a short ordered array of CDN-id strings (editorial recency order preserved), and look up each hero's display data from the fetched `heroes.json`. Order is editorial, so it stays a hand-maintained list of *ids* — but the names/icons come from the source, not re-typed.

**2c — Allies & Counters labels (`hero-loader.js`).** `getHeroName(id)` should read from `heroes.json` instead of `HERO_NAMES`. Since hero pages already fetch their own JSON, load `heroes.json` once (mirror tooltips' pattern) and have `getHeroName` read `.name` from it, keeping the existing auto-capitalize fallback for any true miss. **Verify the Spirit Breaker "Countered By" column now shows "Underlord".**

**HARD STOP before Phase 3.** Have Jemo preview: landing page (count, filters by attribute + role, covered vs coming-soon styling, recently-added strip) and the Spirit Breaker Allies & Counters names. Only continue once he confirms.

---

## Phase 3 — Delete the duplicates

Once Phase 2 is confirmed working on the rendered site:

- Remove the inline `heroes` array literal from `heroes.html` (now fetched).
- Remove the `HERO_NAMES` object from `hero-loader.js` (now unused). Confirm `getHeroName` no longer references it.

Line-targeted deletions. Do not reserialize/reformat surrounding code.

---

## Phase 4 — Final verification (rendered site only)

- Landing page: all heroes present, correct count, filters work, covered/coming-soon correct, recently-added strip correct.
- A covered hero page (Spirit Breaker): header, tooltips on `[hero:...]` refs, and Allies & Counters labels all correct — specifically Underlord reads "Underlord," not "Abyssal Underlord."
- Adding-a-hero sanity check: adding one hero now means editing `heroes.json` once (plus the editorial recency list if desired). Update the hero-building procedure in `CLAUDE.md` to reflect the new single-edit workflow, and drop the old two-edit `heroes.html` instruction.

---

## Rules of engagement

- Revert mechanism is GitHub Desktop — commit after Phase 1 and after Phase 2 so each checkpoint is independently revertable.
- Line-targeted edits; never full-file reserialize (keeps diffs honest).
- Any CDN path uncertainty → check `cdn_paths.md`, and if it's not there, STOP and ask Jemo (don't guess).
- Jemo reviews through the rendered local site, not JSON or diffs. Every checkpoint above is phrased as something he can see on the page.
