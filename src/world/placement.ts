import type { BiomePalette } from '../palette/colors.ts';
import type { WorldGrid } from './state.ts';
import type { Structure, StructureKind } from './structures.ts';
import { structureFootprint, pickKind } from './structures.ts';
import { getTile } from './state.ts';

export interface PlaceReq {
  drawers: number;
  closet: boolean;
  nearTile?: { x: number; y: number };
  biome: BiomePalette;
  name?: string;
}

export function placeStructures(
  world: WorldGrid,
  reqs: PlaceReq[],
  seed = 1,
): Structure[] {
  const out: Structure[] = [];
  const occupied: boolean[] = new Array(world.w * world.h).fill(false);

  for (let i = 0; i < reqs.length; i++) {
    const req = reqs[i];
    const kind = pickKind(req.drawers);
    const fp = structureFootprint(kind);
    const pos = findSlot(world, occupied, fp, kind, req.nearTile);
    if (!pos) continue;

    markOccupied(occupied, world.w, pos.x, pos.y, fp.w, fp.h);
    out.push({
      kind,
      tileX: pos.x,
      tileY: pos.y,
      biome: req.biome,
      name: req.name,
      drawers: req.drawers,
      hasClosetData: req.closet,
      seed: (seed * 2654435761 + i * 374761393) >>> 0,
    });
  }
  return out;
}

function findSlot(
  world: WorldGrid,
  occupied: boolean[],
  fp: { w: number; h: number },
  _kind: StructureKind,
  near?: { x: number; y: number },
): { x: number; y: number } | null {
  const cx = near?.x ?? Math.floor(world.w / 2);
  const cy = near?.y ?? Math.floor(world.h / 2);
  for (let r = 0; r < Math.max(world.w, world.h); r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
        const x = cx + dx;
        const y = cy + dy;
        if (canPlace(world, occupied, x, y, fp.w, fp.h)) return { x, y };
      }
    }
  }
  return null;
}

function canPlace(
  world: WorldGrid,
  occupied: boolean[],
  x: number,
  y: number,
  w: number,
  h: number,
): boolean {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      const gx = x + dx;
      const gy = y + dy;
      if (gx < 0 || gy < 0 || gx >= world.w || gy >= world.h) return false;
      if (occupied[gy * world.w + gx]) return false;
      const t = getTile(world, gx, gy);
      if (!t) return false;
      if (t.kind === 'water' || t.kind === 'stone') return false;
    }
  }
  return true;
}

function markOccupied(
  occupied: boolean[],
  worldW: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  for (let dy = 0; dy < h; dy++) {
    for (let dx = 0; dx < w; dx++) {
      occupied[(y + dy) * worldW + (x + dx)] = true;
    }
  }
}
