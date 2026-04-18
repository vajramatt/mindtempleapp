import type { BiomePalette } from '../palette/colors.ts';
import { mix } from '../palette/colors.ts';
import { fbm, hash2 } from './noise.ts';
import type { WorldGrid } from './state.ts';
import type { Tile, TileKind } from './terrain.ts';

export interface BiomeSite {
  id: string;
  cx: number;
  cy: number;
  palette: BiomePalette;
  weight: number;
}

export interface GenOpts {
  width: number;
  height: number;
  sites: BiomeSite[];
  seed?: number;
  waterLevel?: number;
  beachWidth?: number;
}

export function generate(opts: GenOpts): WorldGrid {
  const { width: w, height: h, sites, seed = 1, waterLevel = 0.42, beachWidth = 0.05 } = opts;
  const tiles: Tile[] = new Array(w * h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const site = nearestSite(sites, x, y);
      const transition = transitionPalette(sites, x, y, site);

      const elev =
        fbm(x * 0.055, y * 0.055, 4, seed) * 0.75 +
        fbm(x * 0.16, y * 0.16, 2, seed + 11) * 0.25;

      let kind: TileKind = 'grass';
      let tileElev = 0;

      if (elev < waterLevel) {
        kind = 'water';
      } else if (elev < waterLevel + beachWidth) {
        kind = 'sand';
      } else if (elev > 0.74) {
        kind = 'stone';
        tileElev = Math.min(3, Math.floor((elev - 0.74) * 14));
      }

      tiles[y * w + x] = {
        kind,
        biome: transition,
        elev: tileElev,
      };
    }
  }

  return { w, h, tiles };
}

function nearestSite(sites: BiomeSite[], x: number, y: number): BiomeSite {
  let best = sites[0];
  let bestD = Infinity;
  for (const s of sites) {
    const dx = x - s.cx;
    const dy = y - s.cy;
    const d = (dx * dx + dy * dy) / s.weight;
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}

function transitionPalette(sites: BiomeSite[], x: number, y: number, primary: BiomeSite): BiomePalette {
  let second: BiomeSite | null = null;
  let secondD = Infinity;
  let primaryD = Infinity;
  for (const s of sites) {
    const dx = x - s.cx;
    const dy = y - s.cy;
    const d = Math.sqrt(dx * dx + dy * dy) / Math.sqrt(s.weight);
    if (s === primary) {
      primaryD = d;
    } else if (d < secondD) {
      secondD = d;
      second = s;
    }
  }
  if (!second) return primary.palette;
  const gap = secondD - primaryD;
  const jitter = hash2(x, y, 7777) * 0.4 - 0.2;
  if (gap > 2.5 + jitter) return primary.palette;
  const t = Math.max(0, Math.min(0.5, (2.5 - gap) * 0.2));
  return blendPalette(primary.palette, second.palette, t);
}

function blendPalette(a: BiomePalette, b: BiomePalette, t: number): BiomePalette {
  return {
    ...a,
    grass: mix(a.grass, b.grass, t),
    grassHi: mix(a.grassHi, b.grassHi, t),
    grassLo: mix(a.grassLo, b.grassLo, t),
    grassBlade: mix(a.grassBlade, b.grassBlade, t),
    grassFlower: mix(a.grassFlower, b.grassFlower, t),
    stone: mix(a.stone, b.stone, t),
    stoneHi: mix(a.stoneHi, b.stoneHi, t),
    stoneLo: mix(a.stoneLo, b.stoneLo, t),
    sand: mix(a.sand, b.sand, t),
  };
}

