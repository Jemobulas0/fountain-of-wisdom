# Fountain of Wisdom — Style Guide

This document captures how Jemo writes Fountain of Wisdom content. **Jemo writes 100% of the actual prose and analysis on the site.** Axi (and Sol) help with editing, formatting, spelling, light flow improvements, and implementing structure — never with originating tone or generating content from scratch.

The purpose of this guide is therefore not "how to write like Jemo" but "how to recognize Jemo's voice so you don't accidentally undo it when editing." When making changes to text Jemo has written, preserve these patterns. When generating UI scaffolding or structural elements that Jemo will then fill in, leave room for these patterns rather than baking in something that fights them.

## Audience

The primary readers are:

1. **Casual players** who've enjoyed DotA for years (sometimes decades — back to DotA 1) but never seriously tried to improve.
2. **New players** who want to learn the game properly.

These two groups are addressed simultaneously. Casual veterans have decades of game knowledge — heroes, items, mechanics — but lack the structural understanding the site teaches. New players are still building both layers at once. What unites them is that neither has had someone clearly point out the patterns and concepts that the site exists to surface.

The site's primary focus is casual and new players, but the work isn't only for them. Higher-MMR players can gain significant value too — especially from the Concepts and Guides sections, where Jemo covers topics that are hardly ever discussed elsewhere online. The reader isn't assumed to be a pro or a top-percentile grinder, but the work isn't dumbed down for anyone either. It's someone who wants the game to make more sense — at whatever level they're playing.

## Voice — what Jemo's writing sounds like

**Direct second-person address.** "You're at your weakest during the laning stage." "Your hero can arguably make more use of your Courier than any other hero in the game." Not "the player should" or "one might consider." If you're editing a sentence into third person or impersonal voice, you're undoing this.

**Concrete numbers over vague claims.** "10–15 minutes wasted per game" beats "a lot of time wasted." "On average you proc it once every 6 hits" beats "you'll bash often." When Jemo makes a quantitative claim, he uses the actual number. Don't soften specific numbers into ranges or vagueness during editing.

**Pattern names by function, not jargon.** "Primed Bash," "Kill Express," "Pre-Game Plan," "creep equilibrium." These are concept names rooted in what the thing DOES, not in technical terminology. If you encounter one of these in Jemo's text, leave it as-is — they're load-bearing names, not casual phrasing.

**Sober analytical body, occasional playful flourishes at the edges.** The teaching itself is precise and serious. But headers, build names, and note fields can be fun: "The train never stops. Get aboard the Kill Express!" / "Get behind me Mr. President!" Playfulness lives in titles, build names, and short notes. The core analysis prose doesn't joke. If something playful appears in a Game Plan body, it's probably either intentional contrast or something that drifted — usually the former with Jemo, so default to leaving it.

**Acknowledging and overturning intuition.** When something is counterintuitive, Jemo names that it's counterintuitive and explains why the right answer is right anyway. "Which albeit counterintuitive to new players, is actually perfectly fine since..." This pattern is intentional — it pre-empts the reader's resistance. Don't edit out the acknowledgment.

**Anti-clickbait opening posture.** Guides and concepts often open by undercutting their own importance ("Most players never put their finger on this one — so it feels inconsequential"). The body then proves the point matters. Don't "improve" these intros into stronger hooks — the undercut is doing real work.

**Personal authority without arrogance.** "21 years of DotA. Writing about the concepts most players never put their finger on — until now." Confidence anchored in time invested, not credentials or rank-flexing.

## Voice — what Jemo's writing avoids (so don't introduce these when editing)

**No hype language.** "Game-changing," "revolutionary," "the secret to," "unlock your potential." These don't appear in Jemo's writing. If you're tempted to add one in an edit (e.g., changing a section header to be "more compelling"), don't.

**No AI-flavored phrasing.** "It's important to note that," "delve into," "let's explore," "in today's fast-paced meta," "harness the power of," "elevate your gameplay." If a sentence sounds like it could open a generic tutorial blog, it doesn't belong here. This is the most likely failure mode when an AI edits Jemo's text — smoothing his direct phrasing into generic blog voice. Resist it.

**No empty hedging.** "Some players might find that perhaps in certain situations..." Jemo makes the claim. If exceptions exist, he names the specific exceptions. Don't add hedge words to "soften" assertions during editing.

**No marketing-speak in section headers.** Headers describe what the section IS. "The Problem" / "The Fix" / "The Pre-Game Plan." Not "Discover the secrets of..." or "5 things you need to know about..."

**No condescension.** The site doesn't explain things the reader already knows just because the explanation feels safer. Trust the audience.

## Structure conventions

### Hero pages

Hero pages are built from `hero_template.json`, with `spirit_breaker.json` as the canonical filled example. The structural sections, in order:

1. **Overview** — positions, roles, plus short tag-style strengths and weaknesses (noun phrases, not sentences).
2. **Game Plan** — early / mid / late phases plus extras. 1–3 sentences per phase covering what the hero is trying to do and their core constraints. Sober prose by convention; playful tone goes in build names and notes, not here.
3. **Skill Builds** — usually 2 named builds (e.g., "Standard," "Kill on Bounty Runes"). Each has level-up rows, talent choices with a `chosen` side, and a `note` explaining the build's purpose.
4. **Item Builds** — usually 2 named builds, playful flourish allowed in the name. Starting Items + Core Build phases. Items can carry green/yellow timing markers ("good time" / "should have it by"). Each build has a strategic `note`.
5. **Situational Items** — items outside the core build, each with a note explaining when and why. Notes use the bracket cross-reference syntax (see below).
6. **Tips** — basic and advanced. Basic = foundational mechanics. Advanced = pattern recognition, optimization, non-obvious uses.
7. **Allies and Counters** — three buckets (allies, counters, countered_by), each with 4–6 hero names plus a note explaining the pattern, not just the list.

### Items, Concepts, and Guides

Conventions for these content types are not yet codified — too few examples exist on the site to abstract from confidently. As more pages get built, this section will be filled in based on what Jemo actually writes.

The one existing reference point: **Guides**, with "Wasting Time" (`/guides/wasting_time.html`) as the only complete example. It opens with an undercut, follows with The Problem and The Fix as labeled sections, uses concrete numbers throughout, and closes by pointing toward the larger picture. Treat that as illustrative of one possible Guide shape, not as a prescriptive template — the conventions will solidify as more guides are written.

## Cross-referencing syntax

Inside JSON note fields and tip fields, references use bracket syntax:

- `[hero:hero_id]` — links to a hero (e.g., `[hero:venomancer]`)
- `[item:item_id]` — links to an item (e.g., `[item:phase_boots]`)
- `[item:item_id|hero_id]` — links to a hero-specific Aghanim's interaction (e.g., `[item:ultimate_scepter|spirit_breaker]`)
- `[ability:ability_id]` — links to an ability (e.g., `[ability:spirit_breaker_charge_of_darkness]`)

The renderer handles converting these into actual links and tooltips. Don't hardcode link text or paths in note fields.

## When in doubt

Read `spirit_breaker.json` and the Wasting Time guide. If an edit you're about to make would result in something that doesn't sound like those, the edit is probably wrong.