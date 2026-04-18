import type { Tile, TileKind } from './terrain.ts';
import type { BiomePalette } from '../palette/colors.ts';
import { SACRED_GROVE } from '../palette/colors.ts';

export interface WorldGrid {
  w: number;
  h: number;
  tiles: Tile[];
}

export function makeWorld(w: number, h: number, biome: BiomePalette = SACRED_GROVE): WorldGrid {
  const tiles: Tile[] = new Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      tiles[y * w + x] = {
        kind: 'grass',
        biome,
        elev: 0,
      };
    }
  }
  return { w, h, tiles };
}

export function getTile(world: WorldGrid, x: number, y: number): Tile | null {
  if (x < 0 || y < 0 || x >= world.w || y >= world.h) return null;
  return world.tiles[y * world.w + x];
}

export function setKind(world: WorldGrid, x: number, y: number, kind: TileKind) {
  const t = getTile(world, x, y);
  if (t) t.kind = kind;
}

export function paintPond(world: WorldGrid, cx: number, cy: number, r: number) {
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 <= r * r) setKind(world, x, y, 'water');
      else if (d2 <= (r + 1) * (r + 1)) {
        const t = getTile(world, x, y);
        if (t && t.kind === 'grass') t.kind = 'sand';
      }
    }
  }
}

export function paintStoneCluster(world: WorldGrid, cx: number, cy: number, seed: number) {
  const positions: Array<[number, number, number]> = [
    [cx, cy, 3],
    [cx + 1, cy, 2],
    [cx - 1, cy + 1, 2],
    [cx + 2, cy - 1, 1],
    [cx, cy - 1, 1],
  ];
  for (const [x, y, elev] of positions) {
    const t = getTile(world, x, y);
    if (t) {
      t.kind = 'stone';
      t.elev = elev + ((seed >> (x + y)) & 1);
    }
  }
}
