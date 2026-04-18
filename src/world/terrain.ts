import type { BiomePalette } from '../palette/colors.ts';
import { rgb, shade, mix } from '../palette/colors.ts';
import { TILE } from '../engine/canvas.ts';

export type TileKind = 'grass' | 'water' | 'sand' | 'stone' | 'path';

export interface Tile {
  kind: TileKind;
  biome: BiomePalette;
  elev: number;
}

export function drawGrassTile(
  ctx: CanvasRenderingContext2D,
  t: Tile,
  px: number,
  py: number,
  tileX: number,
  tileY: number,
) {
  const p = t.biome;
  ctx.fillStyle = rgb(p.grass);
  ctx.fillRect(px, py, TILE, TILE);

  const h = ((tileX * 73856093) ^ (tileY * 19349663)) >>> 0;

  if (h % 3 === 0) {
    ctx.fillStyle = rgb(shade(p.grass, -8));
    const pw = 5 + (h % 5);
    const ph = 3 + ((h >> 4) % 3);
    const x2 = 1 + ((h >> 8) % Math.max(1, TILE - pw - 1));
    const y2 = 2 + ((h >> 12) % Math.max(1, TILE - ph - 3));
    ctx.fillRect(px + x2, py + y2, pw, ph);
  }

  if (h % 9 === 0) {
    ctx.fillStyle = rgb(shade(p.grass, 10));
    const pw = 3 + ((h >> 2) % 3);
    const ph = 2;
    const x2 = 1 + ((h >> 10) % Math.max(1, TILE - pw - 1));
    const y2 = 1 + ((h >> 14) % Math.max(1, TILE - ph - 2));
    ctx.fillRect(px + x2, py + y2, pw, ph);
  }

  if (h % 17 < 3) {
    ctx.fillStyle = rgb(p.grassBlade);
    const bx = 2 + ((h >> 4) % (TILE - 4));
    const by = 4 + ((h >> 9) % (TILE - 8));
    ctx.fillRect(px + bx, py + by, 1, 2);
  }

  if (h % 89 < 2) {
    const fx = px + 3 + (h % 10);
    const fy = py + 5 + ((h >> 8) % 7);
    ctx.fillStyle = rgb(p.grassFlower);
    ctx.fillRect(fx, fy, 1, 1);
  }
}

export function drawStoneTile(
  ctx: CanvasRenderingContext2D,
  t: Tile,
  px: number,
  py: number,
  tileX: number,
  tileY: number,
) {
  const p = t.biome;
  const lift = Math.min(3, t.elev);
  const y0 = py - lift;

  ctx.fillStyle = rgb(shade(p.stoneLo, -10));
  ctx.fillRect(px, py + TILE - lift, TILE, lift);

  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(px, y0, TILE, TILE);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(px, y0, TILE, 1);
  ctx.fillRect(px, y0, 1, TILE);
  ctx.fillStyle = rgb(p.stoneLo);
  ctx.fillRect(px + TILE - 1, y0, 1, TILE);
  ctx.fillRect(px, y0 + TILE - 1, TILE, 1);

  ctx.fillStyle = rgb(p.stoneLo);
  const h = ((tileX * 2246822519) ^ (tileY * 3266489917)) >>> 0;
  const cracks = h % 3;
  for (let i = 0; i < cracks; i++) {
    const cx = px + 2 + ((h >> (i * 3)) % (TILE - 4));
    const cy = y0 + 3 + ((h >> (i * 5)) % (TILE - 6));
    ctx.fillRect(cx, cy, 1, 2);
  }
}

export function drawSandTile(
  ctx: CanvasRenderingContext2D,
  t: Tile,
  px: number,
  py: number,
  tileX: number,
  tileY: number,
) {
  const p = t.biome;
  ctx.fillStyle = rgb(p.sand);
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = rgb(shade(p.sand, -20));
  for (let y = 0; y < TILE; y++) {
    for (let x = 0; x < TILE; x++) {
      const h = ((tileX * 1274126177) ^ (tileY * 2024337869) ^ (x * 13) ^ (y * 47)) >>> 0;
      if (h % 37 < 1) ctx.fillRect(px + x, py + y, 1, 1);
    }
  }
}

export function drawWaterTile(
  ctx: CanvasRenderingContext2D,
  t: Tile,
  px: number,
  py: number,
  tileX: number,
  tileY: number,
  tick: number,
  neighbors: (kind: TileKind) => boolean,
) {
  const p = t.biome;
  const s = Math.sin(tick * 0.04 + tileX * 0.5 + tileY * 0.3);
  const band = s > 0.33 ? 2 : s > -0.33 ? 1 : 0;
  ctx.fillStyle = rgb(p.water[band]);
  ctx.fillRect(px, py, TILE, TILE);

  for (let y = 0; y < TILE; y += 2) {
    const ss = Math.sin(tick * 0.06 + tileX * 1.3 + (tileY + y) * 0.7);
    if (ss > 0.88) {
      const sx = px + ((tick * 2 + y * 3 + tileX * 5) % TILE);
      ctx.fillStyle = `rgba(255,255,255,0.18)`;
      ctx.fillRect(sx, py + y, 2, 1);
    }
  }

  if (neighbors('grass') || neighbors('sand') || neighbors('stone')) {
    ctx.fillStyle = rgb(p.waterFoam, 0.45);
    ctx.fillRect(px, py, TILE, 1);
  }
}

export function drawPathTile(
  ctx: CanvasRenderingContext2D,
  t: Tile,
  px: number,
  py: number,
) {
  const p = t.biome;
  const base = mix(p.sand, p.stone, 0.35);
  ctx.fillStyle = rgb(base);
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = rgb(shade(base, -18));
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py + TILE - 1, TILE, 1);
}
