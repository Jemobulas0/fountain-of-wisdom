# Fountain of Wisdom — CDN Paths

This file exists because CDN path errors are the recurring breakage point when building hero pages. DotA's asset names sometimes don't match the hero/ability/item's current in-game name — they reflect older internal names that Valve never updated. Every time a new mismatch is discovered, **add it to this file**. The same break should never happen twice.

## How to use this file

When Axi (or any model) is rendering a hero page or item page and needs a CDN asset path, the workflow is:

1. Default to the standard pattern (the asset's name in the URL matches its current in-game ID).
2. Check the **Known Exceptions** section below for any legacy-name overrides.
3. If a path doesn't render correctly when tested and isn't in the exceptions list — STOP and ask Jemo. Don't guess. Once Jemo confirms the correct path, **add it to the exceptions list in this file** so the same problem doesn't recur.

## Standard URL patterns

All assets live under a common base URL on Steam's Cloudflare CDN. The asset's ID (with any exceptions applied — see below) slots into the path.

```
Hero portraits:  https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/[hero_id].png
Ability icons:   https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/[ability_id].png
Item icons:      https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items/[item_id].png
```

For 99% of assets, the ID matches the current in-game name. The exceptions below are cases where Valve renamed the hero or item but never updated the CDN path — so the URL still uses the older internal name.

## Known Exceptions (legacy internal names)

These items/heroes have a current in-game name that does NOT match what the CDN expects. Always use the legacy name in the URL.

### Heroes

| In-Game Name | Legacy CDN Name | Notes |
|---|---|---|
| Wraith King | `skeleton_king` | Renamed in the Reborn era; CDN still uses the original. |

### Abilities

| In-Game Name | Legacy CDN Name | Notes |
|---|---|---|
| Curse of the Oldgrowth | `furion_curse_of_the_forest` | Nature's Prophet innate. CDN id keeps the old "forest" internal name, not "oldgrowth". Confirmed 200 via api.opendota.com/api/constants/abilities. |

### Items

| In-Game Name | Legacy CDN Name | Notes |
|---|---|---|
| Khanda | `angels_demise` | Item was renamed; CDN still uses the original. |
| Parasma | `devastator` | Item was renamed; CDN still uses the original. |
| Gleipnir | `gungir` | Item was renamed; CDN still uses the original. |
| Aghanim's Blessing | `ultimate_scepter_2` | CDN uses this internal name instead of the current in-game name. |
| Crella's Crozier | `crellas_crozier` | Confirmed via api.opendota.com/api/constants/items — display name matches exactly. |
| Greedy (Enchantment) | `enhancement_greedy` | Not a shop item — an enchantment (see `build.enchantment` in hero JSON). CDN spells it "enhancement", not "enchantment". |

## When adding new entries

Use this format:

```
| In-Game Name | `legacy_cdn_name` | Brief context if useful (when renamed, why, etc.) |
```

Don't worry about being exhaustive in the "notes" column. The goal is to never break on the same asset twice — getting it logged matters more than logging it perfectly.