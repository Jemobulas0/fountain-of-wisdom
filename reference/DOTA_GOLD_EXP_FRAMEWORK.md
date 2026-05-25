# DotA 2 — Gold & Experience Framework Reference
*Built by Jemo & Sol/Axi. Upload this when working on timings, hero builds, or role calculations.*

---

## Purpose
This document contains the foundational gold and experience calculation framework for The Fountain of Wisdom coaching content. It establishes theoretical gold ceilings, realistic benchmarks per skill bracket, XP-to-level timings, and item timing formulas for all 5 roles. Build all 5 role frameworks first, then apply to individual hero pages.

---

## Core Mechanics — Gold

**Passive gold income:** 90g per minute, flat, applies to all heroes equally. Unaffected by deaths.

**Starting gold:** 600g for all heroes.

**Last hit gold:** Only the player who lands the killing blow receives the gold bounty.

**Reliable vs Unreliable gold:** Deaths cause loss of unreliable gold only. Early game death gold loss is minimal — real cost of dying is farming downtime (missed waves + camps).

**Net worth:** Gold accumulated + value of current items. This is the standard in-game metric used for all benchmarks.

## Core Mechanics — Experience

**There is no passive XP.** All experience comes from being near dying units (creeps or heroes).

**XP sharing:** XP is split equally among all allied heroes within range of a dying enemy unit. In a dual lane (2 heroes), each hero receives 50% of the creep's XP. Solo lane heroes receive 100%.

**Denied creeps:** If an enemy denies a lane creep in your range, you receive only 50% of its XP. Not factored into framework calculations.

**XP efficiency:** Unlike gold (which requires landing the killing blow), XP only requires proximity. A player who misses every last hit still receives full XP from nearby creep deaths. This means XP efficiency during laning is effectively 100% for all brackets. Post-laning, XP efficiency matches farming route completion rates — if you don't path to a camp, you miss both the gold and the XP.

---

## Raw Data — Lane Creeps

**Wave spawn:** Every 30 seconds starting at 0:00.

**Base wave composition (0:00 to 15:00):**
- 3 Melee + 1 Ranged = 4 creeps per standard wave
- Flagbearer replaces 1 melee every 2nd wave from 2:00 (every minute) — does NOT increase wave size
- Siege creep added every 10th wave from 5:00 (every 5 minutes) — DOES increase wave size by 1
- At 15:00: +1 melee creep added to all waves permanently
- At 30:00: +1 melee creep, +1 siege creep added permanently

*7.41: Lane creep meeting point shifted toward offlane (safe lane creeps accelerated, offlane creeps slowed until 7:30). Gold/XP values unchanged but safe lane carry sees waves slightly earlier. First additional siege creep timing moved from 35:00 to 30:00 (no effect on 0-15 min calculations).*

### Gold Values (averages)
- Melee: 37g (pre-7:30), 38g (post-7:30)
- Ranged: 48g (pre-7:30), 51g (post-7:30)
- Flagbearer: 84g (pre-7:30), 86g (post-7:30)
- Siege: 66g (no scaling)

**Gold scaling every 7:30:** Melee/Flagbearer base +1g, Ranged +3g, Siege no scaling.

### XP Values
- Melee: 57 XP (no scaling)
- Ranged: 69 XP (pre-7:30), 77 XP (post-7:30), +8 per 7:30 interval
- Flagbearer: 60 XP (no scaling)
- Siege: 88 XP (no scaling)

**XP scaling every 7:30:** Only ranged creeps scale (+8 XP per interval). All other lane creeps have fixed XP values.

### Per-Wave Totals

**Gold per wave (pre-7:30):**
- Standard wave (3M + 1R): 159g
- Flagbearer wave (2M + 1F + 1R): 206g
- Siege addition: +66g

**XP per wave (pre-7:30):**
- Standard wave (3M + 1R): 240 XP
- Flagbearer wave (2M + 1F + 1R): 243 XP
- Siege addition: +88 XP

**Gold per wave (post-7:30):**
- Standard wave: 165g
- Flagbearer wave: 213g

**XP per wave (post-7:30):**
- Standard wave: 248 XP
- Flagbearer wave: 251 XP

**Combined per minute (post 7:30, alternating standard/flagbearer):**
- Gold: ~378g at 100% efficiency
- XP: ~499 XP at 100% proximity

### Phase 1 Totals (0-7:00, 15 waves)

Wave breakdown: 9 standard, 5 flagbearer, 1 flagbearer+siege.

**Lane gold at 100% efficiency: ~2,733g**
**Lane XP at 100% proximity: 3,706 XP**

- Solo lane hero (mid): 3,706 XP → Level 7
- Shared lane hero (50%): 1,853 XP → Level 5

---

## Raw Data — Neutral Camps

**Standard camp gold / XP (total per camp, default spawn, no stacking):**

| Camp | Gold | XP (Default) | XP (Stacked) | Creeps |
|------|------|-------------|--------------|--------|
| Small | 58g | 90 XP | 72 XP | ~3 |
| Medium | 82g | 129 XP | 106 XP | ~3 |
| Large | 102g | 160 XP | 128 XP | ~3-4 |
| Ancient | 164g | 261 XP | 209 XP | ~3-4 |

**Camp respawn:** 1 minute
**Gold per neutral LH average:** ~27g
**Neutral Tier 1 items:** Available from 0:00 (changed from 5:00 in 7.41)

**Scaling every 7:30:** +1g and +5 XP per creep per interval. Approximate camp-level increase: +3-5g and +15-20 XP per camp per interval. Stops scaling at 225:00 (irrelevant for real games).

### Evolving Camp Gold (Pollywog/Froglet chain)
- 0-5:00: 54g (3 Pollywogs)
- 5-10:00: 63g (2 Pollywogs + 1 Froglet)
- 10-15:00: 72g (1 Pollywog + 2 Froglets)
- 15-20:00: 81g (fully Medium tier)
- By 30:00: Large tier

### Evolving Camp XP (estimated from tier XP values)
**Small evolving camp (starts as 3 small-tier creeps):**
- 0-5:00: ~90 XP
- 5-10:00: ~103 XP (2 small + 1 medium)
- 10-15:00: ~116 XP (1 small + 2 medium)
- 15-20:00: ~129 XP (fully medium)

**Medium evolving camp (starts as 3 medium-tier creeps):**
- 0-5:00: ~129 XP
- 5-10:00: ~139 XP (2 medium + 1 large)
- 10-15:00: ~150 XP (1 medium + 2 large)
- 15-20:00: ~160 XP (fully large)

---

## Raw Data — Camp Layout Per Side (Patch 7.41, March 2026)

**At game start (0:00):**
- 2 Small standard, 5 Medium standard, 3 Large standard, 1 Ancient standard
- 1 Small evolving (Pollywog), 2 Medium evolving (Froglet)
- **Total: 14 camps per side**

**7.41 changes:** Ancient camp near stream end demoted to Medium. Medium camp near offlane defender's gate demoted to Small. Net result: -1 Ancient, +1 Medium, +1 Small per side compared to 7.40.

**Flooded camp evolution (7.41):**
- Medium flooded camp near safe lane T2 towers: can only evolve once into a Hard camp (NOT Ancient)
- Medium flooded camp near bounty runes: can evolve twice into an Ancient camp

**At 15:00:** Small evolving → Medium; 2 Medium evolving → Large
**At 30:00:** Old Small evolving → Large; 2 old Medium evolving → Ancient

**Note:** Tormentors and Roshan excluded. Stacking not assumed for carry calculations.

*7.41 Tormentor change: No longer gives 175g to shard holder. Team reward decreased from 455g to 415g. Does not affect carry framework (excluded from calculations).*

---

## XP Level Thresholds

| Level | Total XP | XP to Next | Key Unlock |
|-------|----------|------------|------------|
| 1 | 0 | 240 | — |
| 2 | 240 | 400 | — |
| 3 | 640 | 520 | — |
| 4 | 1,160 | 600 | Innate spell |
| 5 | 1,760 | 680 | — |
| 6 | 2,440 | 760 | **Ultimate rank 1** |
| 7 | 3,200 | 800 | — |
| 8 | 4,000 | 900 | — |
| 9 | 4,900 | 1,000 | — |
| 10 | 5,900 | 1,100 | Talent 1 |
| 11 | 7,000 | 1,200 | — |
| 12 | 8,200 | 1,300 | **Ultimate rank 2** |
| 13 | 9,500 | 1,400 | — |
| 14 | 10,900 | 1,500 | — |
| 15 | 12,400 | 1,600 | Talent 2 |
| 16 | 14,000 | 1,700 | — |
| 17 | 15,700 | 1,800 | — |
| 18 | 17,500 | 1,900 | **Ultimate rank 3** |
| 19 | 19,400 | 2,000 | — |
| 20 | 21,400 | 2,200 | Talent 3 |
| 25 | 34,400 | 4,000 | Talent 4 |
| 30 | 63,900 | — | Max level |

---

## Skill Bracket Definitions
*(Jemo's classification)*

| Bracket | MMR Range | Rank |
|---------|-----------|------|
| New | 0-2,000 | Herald, Guardian, Crusader |
| Casual | 2,000-6,000 | Archon, Legend, Ancient |
| Decent | 6,000-9,000 | Divine, low Immortal |
| Pro | 9,000+ | High Immortal |

**Note:** MMR ceiling keeps growing (now 17,000+). All non-Immortal ranks getting progressively worse over time. Divine and below considered poor players by current standards.

---

## Position 1 (Carry) Framework

### Farming Route Types

**High Farming Potential (HFP):** Mobile hero + strong farming tool (AM+BF, Gyrocopter, Medusa)
**Low Farming Potential (LFP):** Slow hero or weaker farming tool (Lifestealer+Radiance, Clinkz)

**Heroes with innate farming (Sven, Medusa, Gyro):** Skip farming item entirely. Calculate from item 2 directly.

**Theoretical maximum routes (100% efficiency):**

HFP:
- 0-7:00: Lane only
- 7-12:00: Lane + Small + Large camp (5 clears each)
- 12-15:00: Lane + Ancient + Large + 2× Medium (3 clears each)

LFP:
- 0-7:00: Lane only
- 7-12:00: Lane + Small + Large camp (5 clears each)
- 12-15:00: Lane + Ancient + Evolving camp (3 clears each)

**Theoretical ceilings at minute 15 (including passive + starting gold):**
- HFP: ~9,266g
- LFP: ~8,566g

### Bracket Efficiency Rates

**Laning phase (0-7:00) — GOLD:**
| Bracket | Last hits/wave | Lane efficiency | Notes |
|---------|---------------|-----------------|-------|
| New | 1 normal creep | ~25% | Never flagbearer/siege |
| Casual | 2 normal creeps | ~49% | Never flagbearer/siege |
| Decent | 2 creeps | ~49% count, higher gold | Prioritizes flagbearer/siege |
| Pro | 3 creeps | ~74% | Prioritizes flagbearer/siege |

**Laning phase (0-7:00) — XP:**
All brackets: 100% efficiency (proximity-based, no execution required). Shared lanes receive 50% per hero.

**Post-laning phase (7:00+, before farming item):**
- New: 60% (lanes break apart, less contested)
- Casual: 60% (same logic)
- *Applies to both gold and XP — reflects route completion, not execution*

**Post-farming item:**
- New: 80% (farming item does work for them)
- Casual: 80% (same)
- *Applies to both gold and XP*

### Validated Net Worth Tables at Minute 15

*(Passive gold 90g×15 = 1,350g + 600g starting included)*

**HFP TABLE:**

| Bracket | Lane Gold | Neutral Gold | Passive | Starting | **Total NW** | Lane LH | Neutral LH | Total LH |
|---------|-----------|--------------|---------|----------|-------------|---------|------------|----------|
| New | 1,457g | 523g | 1,350g | 600g | **~3,930g** | 29 | ~13 | **~42** |
| Casual | 2,436g | 675g | 1,350g | 600g | **~5,061g** | 58 | ~25 | **~83** |
| Decent | 3,030g | 1,557g | 1,350g | 600g | **~6,537g** | 58 | ~57 | **~115** |
| Pro | 4,311g | 2,090g | 1,350g | 600g | **~8,351g** | 87 | ~77 | **~164** |

**LFP TABLE:**

| Bracket | Lane Gold | Neutral Gold | Passive | Starting | **Total NW** | Lane LH | Neutral LH | Total LH |
|---------|-----------|--------------|---------|----------|-------------|---------|------------|----------|
| New | 1,457g | 377g | 1,350g | 600g | **~3,784g** | 29 | ~9 | **~38** |
| Casual | 2,436g | 540g | 1,350g | 600g | **~4,926g** | 58 | ~20 | **~78** |
| Decent | 3,030g | 1,124g | 1,350g | 600g | **~6,104g** | 58 | ~27 | **~85** |
| Pro | 4,311g | 1,508g | 1,350g | 600g | **~7,769g** | 87 | ~56 | **~143** |

**Validation:** Casual HFP ~5,061g matches real Legend game data (~5,217g avg) almost perfectly once Medusa outlier excluded. Pro validated against Jemo's games.

### XP at Minute 15 — Position 1 (Carry)

**Phase 1 (0-7:00):** 1,853 XP (50% of 3,706 lane XP) → Level 5

**Post-7:00 XP per minute (carry alone in lane + camps, post-7:30 values):**

| Route | Lane XP/min | Camp XP/min | Total XP/min |
|-------|-------------|-------------|--------------|
| Pre-farming item (New: lane + Large) | 499 | 160 | 659 |
| Pre-farming item (Casual: lane + Large + Small) | 499 | 250 | 749 |
| Post-farming item (lane + Ancient + Large + Medium) | 499 | 550 | 1,049 |
| Post-farming item (Casual: +2 extra Medium) | 499 | 808 | 1,307 |

**XP at minute 15 (applying same efficiency rates as gold):**

| Bracket | Phase 1 XP | Phase 2 XP (8 min) | **Total XP** | **Level** |
|---------|-----------|-------------------|-------------|----------|
| New | 1,853 | 659 × 0.60 × 8 = 3,163 | **~5,016** | **~9** |
| Casual | 1,853 | 749 × 0.60 × 8 = 3,595 | **~5,448** | **~9-10** |

*Note: New BF timing is ~20 min, Casual BF is ~17 min. Neither has farming item by minute 15, so pre-farming-item route applies for the full Phase 2 window.*

**Level 6 timing (carry, shared lane → solo):**
Carry reaches 1,853 XP at minute 7 (Level 5). After support leaves, carry receives 100% lane XP (~499 XP/min from lane alone). Needs 587 more XP for Level 6.
**Carry hits Level 6: ~minute 9-10** (New ~10, Casual ~9).

### Early Item Cost Baseline

Standard early item package before core item:
- Tango ×2: 180g
- Clarity: 60g
- Salve: 100g
- Magic Wand: 460g
- Bracer/Wraith Band/Null Talisman: 505g
- Power Treads/Phase Boots avg: 1,425g
- **Total: ~2,730g**

Players buy ALL early items first, then accumulate toward core item.

*7.41 note: Phase Boots decreased from 1,500g to 1,450g. Clarity increased from 50g to 60g. Magic Wand increased from 450g to 460g. Power Treads unchanged at 1,400g. Boots average: (1,400 + 1,450) / 2 = 1,425g.*

### Core Item Costs & Thresholds

*(Threshold = 2,730g early items + core item cost)*

| Item | Cost | Threshold | Notes |
|------|------|-----------|-------|
| Battlefury | 3,900g | **6,630g** | Main farming item (7.41: now requires Perseverance instead of Cornucopia) |
| Mjollnir | 5,500g | **8,230g** | Alternative farming item |
| Radiance | 4,700g | **7,430g** | LFP farming item |
| Manta Style | 4,650g | **7,380g** | Representative 2nd item |
| BKB | 4,050g | **6,780g** | Alternative 2nd item |

### Item Timing Formula

**Step 1 — Phase 1 gold (0-7:00):**
(2,733g × lane efficiency %) + (90g × 7) + 600g

**Step 2 — Phase 2 gold per minute (7:00 onwards, pre-farming item):**
(Lane 378g + camps) × post-laning efficiency % + 90g passive

**Step 3 — Minutes to reach threshold:**
(Threshold - Phase 1 gold) ÷ Phase 2 gold per minute = additional minutes
Add 7 for total timing.

**Step 4 — Post-farming item gold per minute:**
(Lane 378g + expanded camps) × 80% + 90g passive

**Step 5 — 2nd item timing:**
2nd item cost ÷ post-farming item GPM = additional minutes after 1st item
Add 1st item timing for total.

### Calculated Item Timings — Position 1 Carry (New & Casual only)

**Pre-farming item farming route:**
- New: lane + 1 Large camp
- Casual: lane + 1 Large + 1 Small camp

**Post-farming item farming route (both):**
- Lane + Ancient + Large + Medium camp

**Battlefury timings:**

| Bracket | Phase 1 Gold | Phase 2 GPM | Minutes to BF | **BF Timing** |
|---------|-------------|-------------|---------------|--------------|
| New | ~1,899g | ~378g/min | ~12.5 min | **~20 min** |
| Casual | ~2,541g | ~413g/min | ~9.9 min | **~17 min** |

*7.41 note: BF cost corrected to 3,900g. Early item package updated to ~2,730g. Threshold is 6,630g. Raw calculations give New ~19.5 min (rounded to 20) and Casual ~17 min. Published timings unchanged.*

**Manta Style timings (2nd item, post-BF):**

Post-BF GPM:
- New: (378+164+102+82) × 80% + 90 = ~671g/min
- Casual: (378+164+102+82+82+82) × 80% + 90 = ~802g/min (2 extra Medium camps)

| Bracket | Post-BF GPM | Minutes to Manta | **Manta Timing** |
|---------|-------------|-----------------|-----------------|
| New | ~671g/min | ~6.9 min after BF | **~27 min** |
| Casual | ~802g/min | ~5.7 min after BF | **~23 min** |

**Pro BF timing:** ~12-13 min (validated from Jemo's real games)

---

## Position 2 (Mid) Framework

Position 2 uses the same core formula as Position 1. The key differences are:

1. **Solo lane** — mid receives 100% of lane XP (not shared)
2. **Post-7:00 GPM: 95% of Position 1's rate** — reflects time spent rotating for ganks, taking map fights, and creating space instead of pure farming
3. **Same efficiency rates per bracket** — the 5% discount captures the behavioral difference

### Gold — Phase 1 (0-7:00)
Identical to Position 1 per bracket. Same creep waves, same efficiency assumptions.

### Gold — Post-7:00 GPM

| Bracket | Pos 1 GPM | **Pos 2 GPM (×0.95)** |
|---------|-----------|----------------------|
| New (pre-farming item) | 378g/min | **359g/min** |
| Casual (pre-farming item) | 413g/min | **392g/min** |
| New (post-farming item) | 671g/min | **637g/min** |
| Casual (post-farming item) | 802g/min | **762g/min** |

### Net Worth at Minute 15

The 5% discount applies only to post-7:00 farming income. Phase 1 and passive gold are unchanged.

**HFP TABLE:**

| Bracket | **Pos 1 NW** | **Pos 2 NW** | Difference |
|---------|-------------|-------------|------------|
| New | ~3,930g | **~3,881g** | -49g |
| Casual | ~5,061g | **~4,983g** | -78g |
| Decent | ~6,537g | **~6,422g** | -115g |
| Pro | ~8,351g | **~8,191g** | -160g |

*Differences are modest at minute 15. Real divergence from Position 1 grows over longer games as the GPM discount compounds.*

### Item Timings

Pos 2 BF/Manta timings are effectively identical to Pos 1 at New/Casual brackets (~20/~17 for BF, ~27/~23 for Manta). The 5% GPM difference adds less than 1 minute at these brackets.

At Decent/Pro brackets, expect ~0.5-1 minute slower on equivalent items compared to Position 1.

**Note:** Item targets vary more for mids than for carries. Many mids skip farming items entirely and buy tempo items (Blink, BKB, Orchid). These hero-specific timings are calculated on individual hero pages using the GPM rates above, validated against dota2protracker data for 7k+ players.

### XP — Position 2

**Phase 1 (0-7:00):** 3,706 XP (100% of lane XP, solo lane) → **Level 7**

This is the single biggest XP advantage of mid — hitting Level 6 (ultimate) significantly earlier than side lanes.

**Level 6 timing (mid):**
After 10 waves (minute 4:30): 2,409 XP (Level 5)
After 11th wave (minute 5:00, flagbearer + siege): 2,740 XP
**Theoretical mid hits Level 6: ~minute 5:00.** In practice, rune contests, denies, and rotations push this to **~7:00 (Casual) / ~8:00 (New)**.

**XP at minute 15 (applying same efficiency and route as Pos 1, ×0.95 for post-7 camps):**

| Bracket | Phase 1 XP | Phase 2 XP | **Total XP** | **Level** |
|---------|-----------|-----------|-------------|----------|
| New | 3,706 | ~3,163 × 0.95 = ~3,005 | **~6,711** | **~10-11** |
| Casual | 3,706 | ~3,595 × 0.95 = ~3,415 | **~7,121** | **~11** |

Mid laners are typically 1-2 levels ahead of side lane cores throughout the game due to the solo lane XP advantage.

---

## Position 3 (Offlaner) Framework

Position 3 uses the same core formula as Position 1. The key differences are:

1. **Shared lane** — offlaner shares XP with position 4 support (50% each)
2. **Post-7:00 GPM: 90% of Position 1's rate** — reflects more time fighting, less time farming; higher income volatility from fights
3. **Same laning efficiency rates per bracket** — the 10% discount captures post-laning behavioral differences
4. **Item targets are hero-specific** — offlaners buy cheaper utility/tank items, not farming items. Timing benchmarks are calculated per hero page, not in this framework

### Gold — Phase 1 (0-7:00)
Identical to Position 1 per bracket.

### Gold — Post-7:00 GPM

| Bracket | Pos 1 GPM | **Pos 3 GPM (×0.90)** |
|---------|-----------|----------------------|
| New (pre-farming item) | 378g/min | **340g/min** |
| Casual (pre-farming item) | 413g/min | **372g/min** |
| New (post-farming item) | 671g/min | **604g/min** |
| Casual (post-farming item) | 802g/min | **722g/min** |

*Note: "post-farming item" for Pos 3 refers to the point where the offlaner completes their first major item (Blink, Pipe, Crimson Guard, etc.), not a traditional farming item like BF. The GPM increase comes from faster camp clears as the hero gets stronger, not from a farming-specific item.*

### Net Worth at Minute 15

**HFP TABLE:**

| Bracket | **Pos 1 NW** | **Pos 3 NW** | Difference |
|---------|-------------|-------------|------------|
| New | ~3,930g | **~3,831g** | -99g |
| Casual | ~5,061g | **~4,905g** | -156g |
| Decent | ~6,537g | **~6,308g** | -229g |
| Pro | ~8,351g | **~8,031g** | -320g |

### Item Timings

Not provided at framework level. Offlaner item targets (Vanguard→Crimson, Blink, Pipe, Hood, Blade Mail, etc.) vary too much by hero. Calculate per hero page using the GPM rates above, validated against dota2protracker.

**General benchmark:** At Casual bracket, a Pos 3 with ~4,900g at min 15 has boots (~1,425g) + early items (~500-700g) and is working toward or has completed a first major utility item (2,000-2,500g range).

### XP — Position 3

**Phase 1 (0-7:00):** 1,853 XP (50% of 3,706 lane XP, shared with Pos 4) → **Level 5**

Identical to Position 1 XP during laning — both are in dual lanes getting 50% each.

**Level 6 timing:** Slower than carry — offlaners get pressured and zoned more, and their support doesn't leave as cleanly at minute 7. **~10:00 (Casual) / ~11:00 (New)**.

**XP at minute 15 (applying ×0.90 efficiency to post-7 route):**

| Bracket | Phase 1 XP | Phase 2 XP | **Total XP** | **Level** |
|---------|-----------|-----------|-------------|----------|
| New | 1,853 | 659 × 0.60 × 0.90 × 8 = ~2,847 | **~4,700** | **~9** |
| Casual | 1,853 | 749 × 0.60 × 0.90 × 8 = ~3,236 | **~5,089** | **~9** |

*In practice, offlaners often keep pace with or exceed these numbers through fight participation XP (excluded from framework). A Pos 3 who fights well can match Pos 1 in levels despite lower farming time.*

---

## Position 4 (Soft Support) Framework

### Gold

**Gold sources (0-15 min):**
Same structure as Position 5 with identical 0-15 GPM.

**Net worth table at minute 15 (after consumables):**
Identical to Position 5:
- New: ~1,693g
- Casual: ~2,265g

**GPM by time window:**
- 0-15 min: New ~180g/min / Casual ~218g/min (same as Pos 5)
- 15-24/19 min: New ~188g/min / Casual ~281g/min (slightly more aggressive farming + fights)
- Post 1st item: New ~321g/min / Casual ~450g/min (more fight-oriented than Pos 5)

**Item timings (same utility items as Pos 5):**

| Item | New | Casual |
|------|-----|--------|
| 1st utility item | **~24 min** | **~19 min** |
| 2nd utility item | **~31 min** | **~24 min** |

**Notes:**
- Pos 4 is ~1 minute faster than Pos 5 on 1st item, ~2 minutes faster on 2nd item
- In practice below low Immortal, Pos 4 and Pos 5 are often indistinguishable in behavior
- Timings reflect what Pos 4 SHOULD be doing — more aggressive, more opportunistic farm, more fight participation
- Same consumable spending assumption as Pos 5 (~1,000g by min 15)
- Bounty runes included: ~229g

### XP — Position 4

**Phase 1 (0-7:00):** 1,853 XP (50% of lane XP, shared with Pos 3) → **Level 5**

**Post-laning XP:** Support XP post-laning comes primarily from fight participation and proximity to objectives — both excluded from this framework. Without kill/assist XP, supports gain minimal experience from occasional lane wave proximity and being near stack clears.

**Estimated XP at minute 15 (framework only, no kills):**
- New: ~2,400-2,700 XP → **Level 6**
- Casual: ~2,800-3,200 XP → **Level 7**

**Level 6 timing:** **~12:00 (Casual) / ~13:00 (New).**

*In reality, supports with active fight participation are typically Level 8-10 at minute 15. The framework underestimates support XP significantly because kill/assist XP is their primary source post-laning. This is a known limitation — support XP benchmarks are less reliable than carry/mid benchmarks.*

---

## Position 5 (Hard Support) Framework

### Gold

**Gold sources (0-15 min):**
- Starting gold: 600g
- Passive gold: 90g/min × 15 = 1,350g
- Bounty runes: ~229g (5 runes per team by min 15: 40+40g at 0:00, ~45g at 4:00, ~50g at 8:00, ~54g at 12:00)
- Lane last hits (0-6:30 only, normal creeps): New ~252g (6 LH) / Casual ~420g (10 LH)
- Neutral stacks: New ~112g (1 of each: Ancient+Large+Medium+Small) / Casual ~316g (3 Ancient + 3 Medium + 4 Large)
- Fight participation (flat estimate): New ~150g / Casual ~350g
- Consumables spent (subtracted from NW): ~1,000g both brackets

**Sentry ward recharge cost (7:00-15:00):**
- 50g per 70 seconds = ~7 recharges = ~350g
- Included in the 1,000g consumable estimate above

**Net worth table at minute 15 (after consumables):**

| Source | New | Casual |
|--------|-----|--------|
| Starting gold | 600g | 600g |
| Passive gold | 1,350g | 1,350g |
| Bounty runes | 229g | 229g |
| Lane last hits | 252g | 420g |
| Stacks | 112g | 316g |
| Fight participation | 150g | 350g |
| Consumables spent | -1,000g | -1,000g |
| **Net worth at 15:00** | **~1,693g** | **~2,265g** |

**Validated against real game data:** Legend/Divine support games cluster 2,500-3,000g gross (before consumable adjustment) — consistent with our framework.

**Early item package (before utility items):**
- Boots (Arcane 1,500g / Tranquil 900g, avg ~1,200g)
- After boots: New ~493g / Casual ~1,065g toward first utility item

**GPM by time window:**
- 0-15 min: New ~180g/min / Casual ~218g/min
- 15-25 min: New ~160g/min / Casual ~220g/min (pure farming, low fight gold)
- 25-33 min: New ~281g/min / Casual ~385g/min (mid game fights boost income significantly, ~75% jump)

**Item timings (utility items: Force Staff 2,200g / Glimmer Cape 2,150g / Blink 2,250g):**

| Item | New | Casual |
|------|-----|--------|
| 1st utility item | **~26 min** | **~20 min** |
| 2nd utility item | **~34 min** | **~26 min** |

**Notes:**
- Supports do NOT deliberately farm lane creeps after laning phase — any farm is opportunistic
- Kill/assist gold is the main driver of GPM spike in mid game
- Death gold loss is minor for supports — main cost of dying is downtime
- Consumable spending varies significantly by hero and situation — 1,000g is an aspirational target
- Bounty runes included for all support roles (more meaningful % of income than for carries)
- HFP vs LFP distinction exists for supports too (Jakiro/Venomancer can flash farm; Marci/Tusk cannot) but impact is smaller than for carries — use same timings for both

### XP — Position 5

**Phase 1 (0-7:00):** 1,853 XP (50% of lane XP, shared with Pos 1) → **Level 5**

**Post-laning XP:** Same limitation as Position 4 — supports gain XP primarily through fight participation, which is excluded from this framework. Pos 5 typically gains slightly less XP than Pos 4 due to spending more time warding and less time near fights.

**Estimated XP at minute 15 (framework only, no kills):**
- New: ~2,200-2,500 XP → **Level 5-6**
- Casual: ~2,600-3,000 XP → **Level 6-7**

**Level 6 timing:** **~13:00 (Casual) / ~14:00 (New).**

*Same caveat as Pos 4: real supports are typically Level 7-9 at minute 15 due to kill/assist XP. Framework underestimates support levels significantly.*

---

## Practical Coaching Benchmarks

### Net Worth at Minute 15

**Carry (Pos 1) — farming well:**
- Pro: 7,000g+ (HFP), 6,500g+ (LFP)
- Decent: 6,000g+ (HFP), 5,500g+ (LFP)
- Casual: 4,500g+ (HFP), 4,000g+ (LFP)
- Below 5,000g at min 15 as carry = something went wrong

**Mid (Pos 2):** ~2-5% lower than Pos 1 benchmarks at same bracket
**Offlaner (Pos 3):** ~5-10% lower than Pos 1 benchmarks at same bracket
**Supports (Pos 4/5):** ~1,700-2,300g at min 15 (after consumables)

### Last Hit Benchmarks (total including neutrals)
- Minute 10: ~60 LH = amazing
- Minute 15: ~110-120 LH = amazing; ~83 LH = casual carry
- Minute 20: ~200 LH = amazing

### Level Benchmarks

**Level 6 (first ultimate) timing:**

| Role | New | Casual |
|------|-----|--------|
| Pos 2 (Mid) | **~8 min** | **~7 min** |
| Pos 1 (Carry) | **~10 min** | **~9 min** |
| Pos 3 (Offlaner) | **~11 min** | **~10 min** |
| Pos 4 (Soft Support) | **~13 min** | **~12 min** |
| Pos 5 (Hard Support) | **~14 min** | **~13 min** |

**Level 12 (second ultimate) timing:**

| Role | New | Casual |
|------|-----|--------|
| Pos 2 (Mid) | **~20 min** | **~18 min** |
| Pos 1 (Carry) | **~22 min** | **~20 min** |
| Pos 3 (Offlaner) | **~23 min** | **~22 min** |
| Pos 4 (Soft Support) | **~25-29 min** | **~24-28 min** |
| Pos 5 (Hard Support) | **~26-30 min** | **~25-29 min** |

*Validated against 40 hero samples across 4 real games (Immortal bracket). Core timings are point estimates; support timings are ranges due to high volatility from fight-dependent XP. New/Casual brackets adjusted upward from observed Immortal data. All benchmarks exclude kill/assist XP — real games with active fighting will beat these numbers.*

### Special Hero Notes
- Medusa: hits 5 targets simultaneously + Manta illusions farm separately. Always outlier in data — treat as hero-specific exception.
- Gyrocopter: AoE hits limited to 7 per cooldown. Slightly above standard HFP.
- Heroes with innate farming (Sven, Medusa, Gyro): skip farming item, calculate from 2nd item directly.
- PA/AM pre-farming item: GPM very low until BF purchased. Don't use their early numbers for general HFP benchmarks.

---

## Notes on Validation

- All calculations exclude kills/assists — those push NW and XP above predictions
- All calculations exclude stacking — covered separately for support roles
- Gold framework validated against: Jemo's own games (Pro bracket) + Steam friends (Casual bracket)
- XP framework validated against: 40 hero samples across 4 real games (Immortal bracket), adjusted upward for New/Casual
- New bracket hardest to validate — Herald games rarely seen; numbers based on calculation + Jemo's game knowledge
- Support XP benchmarks are significantly lower than reality due to excluded kill/assist XP — use with caution
- Wisdom Shrines create large XP swings for supports — team claiming both shrines can be 2 levels ahead
- 3rd item timing: too variable for general formula. Calculate hero-specifically for heroes Jemo knows well; skip for others.
- Neutral camp XP scaling (+5 per creep per 7:30 interval) adds ~10-15% more XP from camps after 7:30 — not factored into calculations for simplicity

---

*Last updated: April 3, 2026 (Patch 7.41)*
*Built with Claude (Sol & Axi) on claude.ai*

---

## Item Cost Reference
*Source: items.html — costs verified by Jemo manually. This section is the authoritative reference for all item cost calculations. Never use training data item costs — always use this table.*

### Consumables
| Item | Cost |
|------|------|
| Observer Ward | 0g (free) |
| Smoke of Deceit | 50g |
| Sentry Ward | 50g |
| Blood Grenade | 50g |
| Clarity | 60g |
| Enchanted Mango | 65g |
| Faerie Fire | 75g |
| Dust of Appearance | 80g |
| Tango | 90g |
| Quelling Blade | 100g |
| Healing Salve | 100g |
| Town Portal Scroll | 100g |
| Infused Raindrop | 225g |
| Bottle | 675g |
| Aghanim's Shard | 1,400g |

### Attribute Items
| Item | Cost |
|------|------|
| Iron Branch | 55g |
| Gauntlets of Strength | 140g |
| Slippers of Agility | 140g |
| Mantle of Intelligence | 140g |
| Circlet | 155g |
| Belt of Strength | 450g |
| Band of Elvenskin | 450g |
| Robe of the Magi | 450g |
| Crown | 450g |
| Ogre Axe | 1,000g |
| Blade of Alacrity | 1,000g |
| Staff of Wizardry | 1,000g |
| Diadem | 1,000g |
| Ghost Scepter | 1,500g |

### Equipment (Components)
| Item | Cost |
|------|------|
| Ring of Protection | 175g |
| Orb of Venom | 275g |
| Orb of Frost | 300g |
| Orb of Blight | 300g |
| Blades of Attack | 450g |
| Gloves of Haste | 450g |
| Chainmail | 500g |
| Javelin | 900g |
| Helm of Iron Will | 975g |
| Splintmail | 950g |
| Broadsword | 1,000g |
| Blitz Knuckles | 1,000g |
| Claymore | 1,350g |
| Mithril Hammer | 1,600g |

### Miscellaneous (Components)
| Item | Cost |
|------|------|
| Ring of Regen | 175g |
| Sage's Mask | 175g |
| Magic Stick | 200g |
| Wind Lace | 225g |
| Fluffy Hat | 250g |
| Wizard Hat | 250g |
| Shawl | 450g |
| Boots of Speed | 500g |
| Chasm Stone | 800g |
| Shadow Amulet | 900g |
| Gem of True Sight | 900g |
| Morbid Mask | 900g |
| Cloak | 900g |
| Voodoo Mask | 650g |
| Blink Dagger | 2,250g |

### Secret Shop (Components)
| Item | Cost |
|------|------|
| Ring of Health | 700g |
| Void Stone | 700g |
| Energy Booster | 800g |
| Talisman of Evasion | 1,300g |
| Platemail | 1,400g |
| Perseverance | 1,400g |
| Ring of Tarrasque | 1,700g |
| Tiara of Selemene | 1,700g |
| Hyperstone | 2,000g |
| Point Booster | 1,200g |
| Vitality Booster | 1,000g |
| Reaver | 2,800g |
| Eaglesong | 2,800g |
| Mystic Staff | 2,800g |
| Ultimate Orb | 2,800g |
| Demon Edge | 2,400g |
| Sacred Relic | 3,400g |

### Accessories
| Item | Cost |
|------|------|
| Magic Wand | 460g |
| Bracer | 505g |
| Wraith Band | 505g |
| Null Talisman | 505g |
| Soul Ring | 800g |
| Orb of Corrosion | 1,050g |
| Falcon Blade | 1,125g |
| Perseverance | 1,400g |
| Power Treads | 1,400g |
| Phase Boots | 1,450g |
| Oblivion Staff | 1,625g |
| Mask of Madness | 1,900g |
| Hand of Midas | 2,200g |
| Boots of Travel | 2,500g |
| Soul Booster | 3,000g |
| Moon Shard | 4,000g |

### Support Items
| Item | Cost |
|------|------|
| Ring of Basilius | 425g |
| Headdress | 425g |
| Buckler | 425g |
| Urn of Shadows | 825g |
| Tranquil Boots | 900g |
| Pavise | 1,350g |
| Arcane Boots | 1,500g |
| Mekansm | 1,775g |
| Essence Distiller | 1,775g |
| Drum of Endurance | 1,625g |
| Glimmer Cape | 2,150g |
| Force Staff | 2,200g |
| Holy Locket | 2,250g |
| Solar Crest | 2,575g |
| Spirit Vessel | 2,725g |
| Pipe of Insight | 3,725g |
| Crimson Guard | 3,725g |
| Boots of Bearing | 4,225g |
| Guardian Greaves | 4,450g |

### Magical Items
| Item | Cost |
|------|------|
| Veil of Discord | 1,700g |
| Aether Lens | 2,275g |
| Rod of Atos | 2,250g |
| Eul's Scepter of Divinity | 2,600g |
| Phylactery | 2,600g |
| Meteor Hammer | 2,850g |
| Dagon | 3,050g |
| Orchid Malevolence | 3,475g |
| Aghanim's Scepter | 4,200g |
| Bloodstone | 4,700g |
| Gleipnir | 4,650g |
| Octarine Core | 4,900g |
| Refresher Orb | 5,000g |
| Ethereal Blade | 5,200g |
| Scythe of Vyse | 5,200g |
| Khanda | 5,600g |
| Bloodthorn | 6,400g |
| Crella's Crozier | 4,800g |
| Wind Waker | 6,800g |

### Armor Items
| Item | Cost |
|------|------|
| Vanguard | 1,700g |
| Vladimir's Offering | 2,200g |
| Blade Mail | 2,400g |
| Armlet of Mordiggian | 2,500g |
| Helm of the Dominator | 2,550g |
| Consecrated Wraps | 2,600g |
| Aeon Disk | 3,000g |
| Lotus Orb | 3,850g |
| Black King Bar | 4,050g |
| Shiva's Guard | 4,500g |
| Linken's Sphere | 4,800g |
| Heart of Tarrasque | 5,100g |
| Assault Cuirass | 5,125g |
| Helm of the Overlord | 5,650g |

### Weapons
| Item | Cost |
|------|------|
| Crystalys | 2,000g |
| Skull Basher | 2,875g |
| Maelstrom | 2,950g |
| Shadow Blade | 3,250g |
| Mage Slayer | 3,100g |
| Revenant's Brooch | 3,300g |
| Heaven's Halberd | 3,400g |
| Desolator | 3,500g |
| Battle Fury | 3,900g |
| Nullifier | 4,350g |
| Manta Style | 4,650g |
| Radiance | 4,700g |
| Monkey King Bar | 5,000g |
| Satanic | 5,050g |
| Daedalus | 5,100g |
| Butterfly | 5,450g |
| Mjollnir | 5,500g |
| Divine Rapier | 5,600g |
| Silver Edge | 5,700g |
| Abyssal Blade | 6,250g |

### Armaments
| Item | Cost |
|------|------|
| Sange | 2,100g |
| Yasha | 2,100g |
| Kaya | 2,100g |
| Dragon Lance | 1,900g |
| Echo Sabre | 2,700g |
| Diffusal Blade | 2,500g |
| Witch Blade | 2,775g |
| Specialist's Array | 2,550g |
| Sange and Yasha | 4,200g |
| Kaya and Sange | 4,200g |
| Yasha and Kaya | 4,200g |
| Hurricane Pike | 4,450g |
| Harpoon | 4,700g |
| Eye of Skadi | 5,900g |
| Hydra's Breath | 5,900g |
| Parasma | 5,975g |
| Disperser | 6,100g |
| Arcane Blink | 6,800g |
| Swift Blink | 6,800g |
| Overwhelming Blink | 6,800g |

*Last updated: April 2026 (item costs added from items.html; Pos 5 boot costs, utility item costs, and timings corrected)*
