
# CLAUDE.md — MindTemple

## What This Is

MindTemple is an open-source browser app that renders your personal knowledge as a living 2D pixel world with a polished 1980s game aesthetic. Notes, conversations, writings, and ideas become physical terrain. Mythical creatures inhabit the world. And as knowledge accumulates, a temple emerges — its architecture shaped by what you know and have thought about.

It runs locally. MemPalace handles the memory. MindTemple is the eye.

**Domain:** mindtemple.app (showcase site with live demo seeded from hologramthoughts.com)
**Local app:** `npx mindtemple` → opens in browser at localhost
**License:** MIT
**Tagline:** *Your knowledge, rendered as a world you can walk through.*

---

## Philosophy

Most knowledge tools ask you to be a librarian. MindTemple asks you to be an explorer in a world that happens to be made of everything you know.

MemPalace already organizes knowledge into a spatial metaphor — wings, halls, rooms, closets, drawers. MindTemple takes that metaphor literally and renders it as a pixel world you navigate visually. Spatial memory replaces hierarchical memory. You don't search for a note — you remember the kirin was standing near it, by the waterfall that formed when your consciousness writings reached critical mass.

The temple is not placed by the user. It emerges. The system watches knowledge topology — cluster density, cross-wing connections, thematic depth — and constructs architecture organically. The temple is earned, not designed.

---

## Two Modes of Operation

### 1. Local App (the real product)

```bash
pip install mempalace          # the memory backend
npx mindtemple                 # opens browser at localhost:4777
```

User's MemPalace runs locally as always — ChromaDB + SQLite on their machine, zero cloud, zero API keys. MindTemple's local dev server talks to MemPalace via its MCP tools over localhost. The browser does all rendering. Everything stays on the user's machine.

### 2. Showcase Site (mindtemple.app)

A read-only deployment on GitHub Pages. Pre-seeded with hologramthoughts.com content — 282 blog posts spanning 19 years of writing on Buddhism, consciousness, philosophy, fiction, and practice. Visitors explore a fully mature world: five biomes, a grown temple, creatures everywhere, particles drifting. They can pan, zoom, click structures, read notes, watch creatures. They cannot add content.

Purpose: make people want to clone the repo.

The showcase is a static export — MemPalace taxonomy and drawer content pre-baked into a JSON bundle at build time. No Python on the server. No backend. Just GitHub Pages serving HTML + JS + a data bundle.

---

## Architecture

```
LOCAL MODE:
┌──────────────────────────────────┐
│  Browser (localhost:4777)        │
│  ────────────────────────        │
│  Canvas Renderer (all visuals)   │
│  UI Panels (Preact, minimal)    │
│  World State Manager            │
│  Creature AI                    │
│  Temple Growth Engine           │
│  Particle System                │
│  MemPalace Client (fetch→localhost) │
└────────────┬─────────────────────┘
             │ HTTP (localhost)
┌────────────┴─────────────────────┐
│  Local Node Server (mindtemple)  │
│  ────────────────────────        │
│  Hono thin bridge               │
│  Spawns mempalace MCP server    │
│  Proxies MCP tools as REST      │
│  Serves static frontend files   │
└────────────┬─────────────────────┘
             │ stdio / mcp-proxy
┌────────────┴─────────────────────┐
│  MemPalace (pip install)         │
│  ────────────────────────        │
│  ChromaDB (vectors)             │
│  SQLite (knowledge graph)       │
│  19 MCP tools                   │
│  All data in ~/.mempalace/      │
└──────────────────────────────────┘

SHOWCASE MODE (mindtemple.app):
┌──────────────────────────────────┐
│  GitHub Pages (static)           │
│  ────────────────────────        │
│  Same renderer, same creatures   │
│  Pre-baked data JSON bundle      │
│  Read-only, no MemPalace needed  │
│  "Clone & run your own" CTA      │
└──────────────────────────────────┘
```

### MemPalace Compatibility

MemPalace is used WITHOUT modification. Zero forks, zero patches. MindTemple consumes it through:

1. **MCP tools** (19 tools) — via the `mcp-proxy` HTTP bridge on localhost
2. **CLI** — `mempalace init`, `mempalace mine`, `mempalace status` during setup
3. **Data model** — wings, halls, rooms, closets, drawers mapped 1:1 to visual elements

---

## Tech Stack

### Frontend (the entire visual experience — runs in browser)

- **Renderer:** HTML5 Canvas, `image-rendering: pixelated`, native resolution scaled via CSS
- **Game loop:** `requestAnimationFrame`, tick-based update/render split
- **UI panels:** Preact (sidebar, note input, minimap, tooltip) — lightweight, no full React
- **State:** Vanilla TypeScript objects for world/creature state. Preact signals for UI state.
- **Fonts:** Press Start 2P (headers/labels), Silkscreen (body text) — Google Fonts
- **Build:** Vite
- **Audio:** Web Audio API for procedural ambient — wind, water, fire crackle (Phase 2)

### Local Server (thin bridge, not the product)

- **Runtime:** Node.js
- **Framework:** Hono (lightweight)
- **Role:** Spawn MemPalace MCP server, proxy its tools as REST, serve static files
- **No database.** All persistence is in MemPalace. The bridge is stateless.

### Showcase Site

- **Hosting:** GitHub Pages
- **Build:** Same Vite frontend, but with a static JSON data bundle instead of live MemPalace
- **Domain:** mindtemple.app — DNS points to GitHub Pages
- **No backend. Pure static.**

---

## The Showcase: hologramthoughts.com Seed Data

The demo world at mindtemple.app is seeded from hologramthoughts.com — 282 posts, 2006-2026. The categories map directly to MemPalace wings and biomes:

| hologramthoughts.com Category   | MemPalace Wing       | MindTemple Biome                                             | Palette                        |
| ------------------------------- | -------------------- | ------------------------------------------------------------ | ------------------------------ |
| Dharma Writings (134 posts)     | `wing_dharma`        | **Sacred Grove** — ancient trees, mossy stone, shrine lanterns | Deep greens, amber, warm stone |
| Consciousness & Philosophy (70) | `wing_consciousness` | **Crystal Caverns** — underground, glowing formations, still pools | Purple, cyan, crystal white    |
| Creative Writing (68 posts)     | `wing_creative`      | **Ember Coast** — volcanic shore, lava flows, obsidian monoliths | Black, orange, fire red, smoke |
| Practice & Inner Life (32)      | `wing_practice`      | **Moonlit Lake** — water, mist, meditation stones, lotus pads | Silver, dark blue, soft white  |
| Other (33 posts)                | `wing_other`         | **Windswept Plateau** — open grassland, standing stones, sky | Sage green, cloud grey, gold   |

At build time, a script:

1. Fetches all 282 posts via hologramthoughts.com RSS or static markdown export
2. Runs each through `mempalace mine --mode convos` to create drawers
3. Extracts the full taxonomy (wings, rooms, halls, tunnels)
4. Serializes the palette data into a JSON bundle
5. Bundles this with the frontend for static deployment

The demo world will have a fully grown temple (282 posts across 5 wings easily qualifies), all six creature types active, and every biome populated.

---

## MemPalace → Visual Mapping

| MemPalace Concept           | MindTemple Visual      | Rendering Detail                                             |
| --------------------------- | ---------------------- | ------------------------------------------------------------ |
| **Wing**                    | **Biome**              | Distinct terrain region, 40-60 tiles wide, own palette, own weather particles, bordered by transition tiles |
| **Hall (hall_facts)**       | **Stone Monuments**    | 3x2 tile carved stone slabs with glowing rune text, arranged in clearings |
| **Hall (hall_events)**      | **Milestone Paths**    | Lit pathways with small marker stones at intervals, connecting structures |
| **Hall (hall_discoveries)** | **Crystal Formations** | 1x2 tile crystals with animated glow pulse, clustered near dense rooms |
| **Hall (hall_preferences)** | **Garden Patches**     | Small cultivated tile areas with pixel flowers, color-coded by sentiment |
| **Hall (hall_advice)**      | **Shrine Alcoves**     | Small roofed structures with interior glow, 2x2 tiles        |
| **Room**                    | **Named Structure**    | Scale with drawer count: < 5 drawers = cairn (1x1), 5-15 = hut (2x2), 15-30 = tower (2x3), 30+ = hall (3x3). Name as pixel text above. |
| **Closet**                  | **Aura / Rune Wall**   | Summary text rendered as glowing pixel glyphs on structure walls. Pulse animation synced to tick. |
| **Drawer**                  | **Scroll / Tablet**    | Small clickable objects inside or adjacent to structures. Click opens full text in sidebar. Newest drawers glow brighter. |
| **Tunnel**                  | **Bridge**             | Visible bridge structure spanning biome borders. Animated torch particles at both ends. Kirin preferentially walks these. |
| **KG Entity**               | **Totem Stone**        | Named marker with entity name in pixel text.                 |

---

## Renderer Specification

This is the most important section. The renderer is the product.

### Canvas Architecture

```
LAYER 0: Sky / Background
  - Gradient based on time-of-day cycle (dawn → day → dusk → night → dawn)
  - Stars at night (random pixel twinkle, 1x1, white at 20% opacity)
  - Moon phase sprite (8 frames, procedural)

LAYER 1: Terrain (tile grid)
  - 16x16 tile base
  - Each tile: base color + top highlight pixel + shadow edge pixel
  - Elevation encoded as Y-offset (raised tiles render higher, cast shadow below)
  - Water tiles: 3-color sine-wave cycle + shimmer sparkle pixels
  - Sand tiles: occasional wind particle drift
  - Grass tiles: random blade pixels (1x1 lighter green, deterministic from tile coords)
  - Stone tiles: crack detail pixels, darker edges

LAYER 2: Structures (multi-tile objects)
  - Rendered after terrain, before creatures
  - Each structure type has a procedural draw function
  - Shadow cast beneath (offset rectangle, 30% opacity black)
  - Interior glow for structures with closet data (pulsing gold/amber light from windows)
  - Rune text on walls: 1px wide glyphs, animated pulse

LAYER 3: Creatures
  - Y-sorted with structures for correct overlap
  - Each creature: state machine driving animation frame selection
  - Shadows beneath (2x1 dark ellipse, 20% opacity)
  - Trails: per-creature-type particle emitter attached to movement

LAYER 4: Particles (foreground)
  - Fireflies, embers, mist, rain, snow, pollen, rune sparks, torch flames
  - All managed by a single particle pool, max 500 active

LAYER 5: Lighting Overlay
  - Multiply-blend dark overlay for night
  - Additive-blend light circles around: torches, crystals, structure windows, phoenix
  - Light sources: {x, y, radius, color, intensity, flicker}
  - Flicker: sine modulation on intensity, per-source phase offset
  - Day/night cycle: 3600 ticks = full cycle (~2 minutes real time at 30 updates/sec)
```

### Day/Night Cycle

```
DAWN    (tick 0-600):     Sky: deep indigo → warm amber
                          Mist increases then dissipates
                          Creature activity increases
                          Light overlay fades 60% → 0%

DAY     (tick 600-1800):  Full brightness, no overlay
                          Max creature activity
                          Crystal glow dimmed
                          Water reflections most vivid

DUSK    (tick 1800-2400): Sky: warm → purple-orange
                          Firefly spawn rate 5x
                          Structure windows begin glowing
                          Torches activate
                          Creatures slow

NIGHT   (tick 2400-3600): Deep blue-black sky with star twinkle
                          Light overlay 50-60% (multiply blend)
                          All light sources active
                          Phoenix ember trail maximum
                          Owl active (only at night)
                          Dragon perches on temple tower
```

### Procedural Terrain Generation

Biomes are generated from MemPalace taxonomy data, not random:

```
1. Query mempalace_get_taxonomy → wing/room/count tree
2. For each wing, allocate a biome region:
   - Size proportional to total drawer count
   - Wings with many tunnels placed adjacent (force-directed layout)
   - Isolated wings at periphery
3. Within each biome:
   - Rooms placed as structures, clustered by hall type
   - Rooms with tunnels at biome edges (near connected biome)
   - Elevation noise: layered sine waves seeded from wing name hash
   - Water at low elevation points
4. Between biomes:
   - Transition tiles (2-3 tile palette gradient)
   - Tunnel bridges at connection points
5. Temple placement:
   - Geometric center of all biomes
   - Clearing generated around it (radius grows with temple level)
```

### Procedural Sprite Specification

NO external sprite assets. Every visual element drawn by canvas pixel manipulation.

#### Terrain Tiles (16x16)

```
GRASS:
  - Fill: biome grass color
  - Top edge: 1px lighter (sunlit)
  - Bottom edge: 1px darker (shadow)
  - Detail: 2-3 blade pixels at deterministic positions
    Formula: if ((x*7 + y*13) % 11 < 3) draw blade
  - Variant: if ((x*3 + y*17) % 23 < 2) tiny flower pixel (accent color)

WATER:
  - Base: 3 colors cycling via sine(tick*0.04 + x*0.5 + y*0.3)
  - Shimmer: if sine(tick*0.06 + x*1.3 + y*0.7) > 0.85 → 2x1 white at 15%
  - Edge foam: 1px white at 30% on edges adjacent to non-water
  - Reflection: 1px color smear from nearby structures at 15% opacity

SAND:
  - Fill: biome sand color
  - Grain: occasional 1px darker at deterministic positions
  - Wind line: every ~40 ticks, 3px horizontal at 10% opacity, moving

STONE:
  - Fill: biome stone color
  - Elevation: Y-offset by height (0-3px)
  - Shadow: height px of darker below
  - Cracks: 1px dark lines at deterministic positions
  - Highlight: top-left 1px lighter
```

#### Structure Sprites

```
CAIRN (1x1, <5 drawers):
  3 stacked stones, widest bottom, top pixel = accent glow if closet data

HUT (2x2, 5-15 drawers):
  Walls: 2 wide stone, roof triangle 1 above, door 2x3 dark center,
  window 2x2 golden glow at night, smoke particles from roof at night

TOWER (2x3, 15-30 drawers):
  Walls: 2 wide 3 tall with mortar lines, crenellation top edge,
  window per floor 1x2 glowing, arched door 2x4, flag 2x1 accent
  with 2-frame wave, rune glow pixels pulsing on face

GREAT HALL (3x3, 30+ drawers):
  Walls: 3 wide 3 tall layered stone, peaked roof 5px with highlight,
  columns 1px at front corners, grand arch door 3x5 with interior glow,
  stained glass windows 2x2 cycling drawer category colors,
  torch flames at door flanks, 2 tile stone approach path
```

#### Temple Sprites (centerpiece, 6 levels)

```
LEVEL 1 — FOUNDATION: 5x5 stone platform, raised 2px, carved edge, center circle
LEVEL 2 — WALLS: 5x5 walls 2 tiles tall on foundation, brick pattern, arched entrance
LEVEL 3 — CORRIDORS: 4 arms extending 3 tiles (N/S/E/W), roofed, columns, lanterns
LEVEL 4 — ROOMS: Expands to 7x7, visible room divisions, interior furnishings
LEVEL 5 — TOWER: Central tower 5 tiles above walls, tapering, observation deck, dragon roost, beacon pixel
LEVEL 6 — SPIRE: Ornate needle above tower, star-twinkle tip, light rays at dawn/dusk, 
          golden aura 10-tile radius at 5% opacity breathing with sine, all windows cycle
          4 biome colors, rising gold motes in temple radius
```

#### Creature Sprites (all procedural, per-frame)

```
GREY WOLF (7x5):
  Body 5x2 grey, head 2x3, ears 2x 1x1 dark, eye 1x1 gold, 4 legs
  alternating sine step, tail 2x1 with uptick. Trail: paw prints.

EMBER FOX (6x4):
  Body 4x2 red, head 3x2 orange with bone snout, ears with inner color,
  eye 1x1 black, 2 legs sine step at 0.14, tail 2x1 with white tip sine wave.
  Special: sits and curls tail near drawers.

KIRIN (7x7 — largest ground):
  Body 5x3 blue, 3 legs silver with long stride, neck 1x2, head 2x2 silver,
  horn 1x2 gold with pulsing crystal tip, eye gold, mane 2x 1x1 trailing.
  Trail: blue-white glow. Follows tunnel bridges.

PHOENIX (7x6 — flying):
  Body 3x3 orange, head 2x2 yellow, wings 2x2 red each side oscillating,
  tail 3 feather lines. Y-bob via sine. 30% chance/frame ember particle at tail.
  Every ~600 ticks: 15-particle radial burst.

DRAGON (10x8 — temple guardian):
  Body 6x3 emerald, head 3x3, jaw 2x1, eye 1x1 ember with glow pixel,
  wings 4x3 each with membrane detail, tail 4px curving sine, horns 2x 1x2 gold.
  Perches on temple tower at night, lazy circles above temple by day.
  Every ~400 ticks: ember cone breath.

OWL (5x5 — nocturnal only):
  Body 3x3 brown, head 3x2 lighter round, eyes 2x 1x1 bright gold spaced 1px,
  beak 1x1 between eyes, wings 2x2 tucked. Silent flight (no trail).
  Active only tick 2400-600. Head turn animation while perched.
  Spawns when hall_discoveries >= 30.
```

### Water System

```
FLOW:       Rivers have direction. Shimmer drifts in flow direction 0.5px/tick.
EDGE FOAM:  Adjacent-to-land water gets 1-2px white foam, oscillating ±1px.
REFLECTION: Structures within 3 tiles reflected as 1-2px color smear at 15%.
DEPTH:      Tiles further from shore use darker color. Gradient over 2-3 tiles.
LILY PADS:  Moonlit Lake biome only, 2x2 dark green circles, deterministic placement.
WATERFALL:  Where water meets 3+ elevation drop, white-blue 1px streak + splash particles.
```

### Particle System

```typescript
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  color: [number, number, number];
  size: number; // 1 or 2
}
```

Alpha = `life / maxLife`. Max active: 500. Types:

```
FIREFLY:    5%/tick spawn, sine drift, slow rise, gold, 40-70 life. 3x in forest biomes.
EMBER:      From phoenix/torches/dragon, random drift, rise, orange/yellow/red, 20-35 life.
MIST:       Water biome 2%/tick, slow drift, very slow rise, white 2px, 80-140 life. Dawn/night only.
RAIN:       Top-spawn, slight wind angle, fast fall, blue-white, 30-50 life. Splash on ground.
RUNE_SPARK: Click burst, 12-20 radial, gold, 15-25 life, decelerating (velocity *= 0.92/tick).
POLLEN:     Garden patches 1%/tick, sine drift, slow rise, yellow-green, 60-100 life.
SNOW:       Top-spawn cold biomes, sine x-drift while falling, white, 60-90 life.
TORCH:      Torch positions, 1 per 2 ticks, 3-frame color cycle, rise, 12-18 life.
```

---

## Temple Growth Rules

```
LEVEL 0 (EMPTY):      No temple. Open terrain at world center.
LEVEL 1 (FOUNDATION): >= 3 wings with >= 3 drawers each
LEVEL 2 (WALLS):      Any single room >= 15 drawers
LEVEL 3 (CORRIDORS):  >= 2 tunnels between wings
LEVEL 4 (ROOMS):      >= 3 rooms with >= 10 drawers each
LEVEL 5 (TOWER):      Total drawers >= 200 AND >= 4 active wings
LEVEL 6 (SPIRE):      Total drawers >= 400 AND KG >= 50 entities
```

Growth checked on every knowledge input and world load. New level triggers: camera auto-pan to temple, particle burst, build animation (tiles appear bottom-to-top over 60 ticks).

---

## Creature Spawn Rules & AI

| Creature  | Condition              | Max  |
| --------- | ---------------------- | ---- |
| Grey Wolf | First wing created     | 2    |
| Ember Fox | >= 2 rooms in any wing | 3    |
| Kirin     | >= 2 tunnels exist     | 2    |
| Phoenix   | >= 50 total drawers    | 1    |
| Dragon    | Temple level >= 5      | 1    |
| Owl       | hall_discoveries >= 30 | 2    |

### State Machine (all creatures)

```
IDLE (30-120 ticks): Play idle animation. → WANDER (40%) or SEEK (60%)
WANDER (100-200): Random point in biome, move at base speed, avoid water. → IDLE
SEEK (150-300): Target structure by attraction type → REST when within 2 tiles
REST (60-180): Species-specific rest animation near structure. → IDLE
PATROL (wolf/kirin, 200-400): Wolf = biome perimeter. Kirin = tunnel bridge path. → IDLE
```

Attraction targets:

- Wolf → biome edges, recent drawers
- Fox → smallest structures, orphan rooms
- Kirin → tunnel bridges, cross-biome structures
- Phoenix → densest structure clusters
- Dragon → temple (always)
- Owl → crystals, hall_discoveries

Speeds: wolf 0.06, fox 0.08, kirin 0.04, phoenix 0.12, dragon 0.08, owl 0.10. Flying creatures ignore terrain collision.

---

## UI Specification

```
┌──────────────────────────────────────────────────────┐
│ HEADER (40px): "MINDTEMPLE" + stats                  │
├──────────────────────────────────┬───────────────────┤
│                                  │ SIDEBAR (280px)   │
│         CANVAS WORLD             │ ┌───────────────┐ │
│         (fills remaining)        │ │ Note Input    │ │
│                                  │ ├───────────────┤ │
│         Pan: drag / arrows       │ │ Note List     │ │
│         Zoom: scroll / pinch     │ ├───────────────┤ │
│                                  │ │ Minimap       │ │
│                                  │ ├───────────────┤ │
│                                  │ │ Creature Info │ │
│                                  │ └───────────────┘ │
└──────────────────────────────────┴───────────────────┘
```

- Dark theme throughout, palette matches canvas world
- Press Start 2P for labels/headers, Silkscreen for body
- No component library. Hand-styled CSS. No Tailwind.
- Sidebar collapsible on mobile (hamburger toggle)
- Tooltip: follows mouse 12px offset, drawer text truncated to 120 chars, gold border on deep bg
- Minimap: 120x80px tiny canvas, 1px per tile, gold viewport rectangle, click to pan
- Note input: Enter to submit, shift+Enter for newline, gold border on focus
- Note list: grouped by wing (biome name), click to pan camera to structure

---

## Showcase Landing Page (mindtemple.app)

### Above the Fold

Full-screen animated world running immediately. No loading screen. The world generates from demo data on page load.

- Five biomes, fully grown temple, all creatures, particles
- Top-left overlay: "MINDTEMPLE" Press Start 2P 20px gold with text-shadow glow
- Subtitle: "Your knowledge, rendered as a world you can walk through." Silkscreen 12px bone
- Bottom-right: "⬡ CLONE & BUILD YOUR OWN" → GitHub
- Bottom-left: "Powered by MemPalace" → MemPalace repo
- Semi-transparent header, world visible behind
- Sidebar hidden by default — toggle to explore content

### Below the Fold (scroll panels over fixed world with parallax)

```
PANEL 1: "Your notes become terrain"
  Small inline canvas: 3 notes added → terrain grows. 2-3 sentences.

PANEL 2: "Creatures guide you home"
  All 6 creature sprites drawn inline at 4x scale. One sentence each.

PANEL 3: "Your temple emerges"
  6 temple stages side by side. "282 posts. 19 years. One temple."
```

### Footer

- GitHub (prominent, star badge)
- MIT license
- "Built by Matthew Williamson" → vajramatt.github.io
- "Seeded with hologramthoughts.com — 19 years of writing on Buddhism, consciousness, and code"
- Tech credits: MemPalace, GitHub Pages, TypeScript, Canvas API

---

## Build Pipeline

### Showcase build:

```bash
node scripts/seed-from-blog.ts --url https://hologramthoughts.com/rss.xml
mempalace init ~/mindtemple-demo
mempalace mine ./hologram-export/ --mode convos
node scripts/export-palace.ts --palace ~/.mempalace/palace --out ./demo-data.json
VITE_DEMO_MODE=true VITE_DEMO_DATA=./demo-data.json vite build
# push to main — GitHub Actions deploys to GitHub Pages automatically
```

### Local dev:

```bash
npm run dev    # starts Vite + Hono bridge + MemPalace MCP server
```

---

## Project Structure

```
mindtemple/
├── CLAUDE.md
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
│
├── src/
│   ├── main.ts                    # Entry — init world, start game loop
│   ├── engine/
│   │   ├── canvas.ts              # Canvas setup, pixelated config, scale
│   │   ├── camera.ts              # Pan, zoom, auto-pan, coords transform
│   │   ├── gameloop.ts            # rAF loop, tick counter, update/render split
│   │   ├── input.ts               # Mouse, keyboard, touch
│   │   └── layers.ts              # Layer render order
│   ├── world/
│   │   ├── generator.ts           # Biome layout from taxonomy, noise, placement
│   │   ├── terrain.ts             # Tile types, palettes, draw functions
│   │   ├── structures.ts          # Cairn, hut, tower, hall draw functions
│   │   ├── water.ts               # Flow, foam, reflections, waterfalls
│   │   ├── biomes.ts              # Biome definitions, palettes, weather
│   │   └── state.ts               # World data arrays
│   ├── temple/
│   │   ├── growth.ts              # Rule evaluation, level progression
│   │   ├── renderer.ts            # Temple sprites per level
│   │   └── animation.ts           # Growth build sequence, particle burst
│   ├── creatures/
│   │   ├── types.ts               # Definitions, spawn rules, stats
│   │   ├── sprites.ts             # Procedural draw functions per creature
│   │   ├── ai.ts                  # State machine, target selection
│   │   ├── movement.ts            # Position update, collision, avoidance
│   │   └── manager.ts             # Spawn/despawn, registry
│   ├── particles/
│   │   ├── system.ts              # Pool, update, render
│   │   ├── emitters.ts            # Per-type spawn functions
│   │   └── types.ts               # Configs (colors, velocities, lifetimes)
│   ├── lighting/
│   │   ├── cycle.ts               # Day/night progression, sky gradient
│   │   ├── sources.ts             # Light source registry
│   │   └── overlay.ts             # Multiply/additive blend compositing
│   ├── palette/
│   │   └── colors.ts              # All colors as [r,g,b], biome palette sets
│   ├── bridge/
│   │   ├── client.ts              # HTTP client for MemPalace (local mode)
│   │   ├── demo.ts                # Static JSON loader (showcase mode)
│   │   └── types.ts               # Types matching MemPalace taxonomy shapes
│   ├── ui/
│   │   ├── App.tsx                # Preact root
│   │   ├── NoteInput.tsx
│   │   ├── NoteList.tsx
│   │   ├── Minimap.tsx
│   │   ├── CreatureInfo.tsx
│   │   ├── Header.tsx
│   │   ├── Tooltip.tsx
│   │   └── styles.css             # Hand-written CSS, no libraries
│   └── audio/                     # Phase 2
│       ├── ambient.ts
│       └── sfx.ts
│
├── server/
│   ├── index.ts                   # Hono bridge — serve frontend + proxy MemPalace
│   ├── mempalace-bridge.ts        # Spawn mcp-proxy, REST ↔ MCP translation
│   └── package.json
│
├── scripts/
│   ├── seed-from-blog.ts          # hologramthoughts.com RSS → markdown files
│   ├── export-palace.ts           # MemPalace taxonomy + drawers → demo JSON
│   └── build-showcase.ts          # Showcase build pipeline
│
├── demo-data/
│   └── hologram-thoughts.json     # Pre-baked palace data
│
├── public/
│   └── index.html
│
└── docs/
    ├── ARCHITECTURE.md
    ├── RENDERER.md
    ├── CREATURES.md
    └── CONTRIBUTING.md
```

---

## Performance Budget

60fps on a 2020 M1 MacBook Air in Chrome.

```
Canvas: 960x640 native, CSS-scaled
Max visible tiles: ~2400 (min zoom)
Max creatures: 12
Max particles: 500
Max light sources: 20
Update: 30/sec. Render: 60/sec (update can skip).

Techniques:
- Off-screen canvas for static terrain (blit, re-render on camera move)
- Particle batch rendering (group by color)
- Creature sprite frame caching to off-screen canvas
- Light overlay on separate canvas with globalCompositeOperation
- Minimap updates every 30 ticks, not every frame
- Dirty rectangle tracking for tile changes
```

---

## Non-Negotiable Standards

1. **No AI slop.** Every visual choice is intentional. The UI is a game, not a SaaS dashboard.
2. **No external sprite assets.** Every pixel drawn by code. Zero image files in the repo.
3. **MemPalace unmodified.** Consumed through public MCP tools only.
4. **60fps.** Optimize before adding features.
5. **TypeScript strict mode.** No `any` except MemPalace JSON interfaces.
6. **Mobile-first landing page.** Touch controls, responsive canvas, sidebar collapses.
7. **Real demo data.** hologramthoughts.com, 282 posts, 19 years. Not lorem ipsum.

---

## What Success Looks Like

Someone finds mindtemple.app on their phone. The world loads — five biomes, a temple with a spire, a phoenix circling, water shimmering, fireflies drifting. They tap a monolith and read a real blog post about consciousness from 2008. A kirin walks across a bridge between the Sacred Grove and the Crystal Caverns. They think: "This is the most beautiful knowledge tool I've ever seen."

Then they see the GitHub link. They clone it. They run `npx mindtemple`. Their own world appears — empty grassland, a single wolf, no temple yet. They inscribe their first note. A cairn rises. Crystals form nearby. The fox appears. They keep going.

The Hacker News post title: "MindTemple — your knowledge as a living pixel world (open source, browser-only, zero sprite assets)."

Ship it.
