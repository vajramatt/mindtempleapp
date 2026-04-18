import type { BiomePalette } from '../palette/colors.ts';
import { rgb, shade } from '../palette/colors.ts';
import { TILE } from '../engine/canvas.ts';
import type { Phase } from '../lighting/cycle.ts';

export type StructureKind = 'cairn' | 'hut' | 'tower' | 'hall';

export interface Structure {
  kind: StructureKind;
  tileX: number;
  tileY: number;
  biome: BiomePalette;
  name?: string;
  drawers: number;
  hasClosetData: boolean;
  seed: number;
}

export function pickKind(drawers: number): StructureKind {
  if (drawers < 5) return 'cairn';
  if (drawers < 15) return 'hut';
  if (drawers < 30) return 'tower';
  return 'hall';
}

export function structureFootprint(kind: StructureKind): { w: number; h: number } {
  switch (kind) {
    case 'cairn': return { w: 1, h: 1 };
    case 'hut':   return { w: 2, h: 2 };
    case 'tower': return { w: 2, h: 3 };
    case 'hall':  return { w: 3, h: 3 };
  }
}

export function drawStructure(
  ctx: CanvasRenderingContext2D,
  s: Structure,
  screenX: number,
  screenY: number,
  tick: number,
  phase: Phase,
) {
  const fp = structureFootprint(s.kind);
  const w = fp.w * TILE;
  const h = fp.h * TILE;

  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(screenX + 2, screenY + h - 3, w - 2, 3);

  switch (s.kind) {
    case 'cairn': drawCairn(ctx, s, screenX, screenY, tick, phase); break;
    case 'hut':   drawHut(ctx, s, screenX, screenY, tick, phase); break;
    case 'tower': drawTower(ctx, s, screenX, screenY, tick, phase); break;
    case 'hall':  drawHall(ctx, s, screenX, screenY, tick, phase); break;
  }
}

function nightGlow(phase: Phase): number {
  if (phase === 'night') return 1;
  if (phase === 'dusk')  return 0.6;
  if (phase === 'dawn')  return 0.25;
  return 0;
}

function drawCairn(
  ctx: CanvasRenderingContext2D,
  s: Structure,
  sx: number,
  sy: number,
  tick: number,
  phase: Phase,
) {
  const p = s.biome;
  const bx = sx + 4;
  const by = sy + 4;
  ctx.fillStyle = rgb(p.stoneLo);
  ctx.fillRect(bx - 1, by + 8, 10, 2);
  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(bx, by + 6, 8, 3);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(bx, by + 6, 8, 1);
  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(bx + 1, by + 3, 6, 3);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(bx + 1, by + 3, 6, 1);
  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(bx + 2, by, 4, 3);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(bx + 2, by, 4, 1);

  if (s.hasClosetData) {
    const g = nightGlow(phase);
    if (g > 0) {
      const pulse = 0.55 + 0.35 * Math.sin(tick * 0.08 + s.seed);
      ctx.fillStyle = `rgba(246,196,83,${0.5 * pulse * (0.4 + g)})`;
      ctx.fillRect(bx + 3, by - 1, 2, 1);
    }
  }
}

function drawHut(
  ctx: CanvasRenderingContext2D,
  s: Structure,
  sx: number,
  sy: number,
  tick: number,
  phase: Phase,
) {
  const p = s.biome;
  const g = nightGlow(phase);
  const wallX = sx + 2;
  const wallY = sy + 10;
  const wallW = TILE * 2 - 4;
  const wallH = TILE + 6;

  ctx.fillStyle = rgb(shade(p.stoneLo, -10));
  ctx.fillRect(wallX - 1, wallY + wallH - 2, wallW + 2, 2);

  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(wallX, wallY, wallW, wallH);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(wallX, wallY, wallW, 1);
  ctx.fillStyle = rgb(p.stoneLo);
  for (let y = wallY + 3; y < wallY + wallH - 2; y += 4) {
    ctx.fillRect(wallX, y, wallW, 1);
  }

  const roofY = wallY - 6;
  ctx.fillStyle = rgb(shade(p.stone, -30));
  for (let i = 0; i < 6; i++) {
    const inset = i;
    ctx.fillRect(wallX + inset, roofY + i, wallW - inset * 2, 1);
  }
  ctx.fillStyle = rgb(shade(p.stone, -10));
  ctx.fillRect(wallX + 3, roofY + 2, wallW - 6, 1);

  const doorW = 4;
  const doorH = 8;
  const doorX = wallX + (wallW - doorW) / 2;
  const doorY = wallY + wallH - doorH;
  ctx.fillStyle = rgb(shade(p.stoneLo, -15));
  ctx.fillRect(doorX, doorY, doorW, doorH);
  if (g > 0) {
    ctx.fillStyle = `rgba(246,196,83,${0.4 * g})`;
    ctx.fillRect(doorX + 1, doorY + 1, doorW - 2, doorH - 2);
  }

  const winY = wallY + 4;
  const winSize = 3;
  const winLeft = wallX + 3;
  const winRight = wallX + wallW - 3 - winSize;
  const pulse = 0.55 + 0.45 * Math.sin(tick * 0.09 + s.seed);
  ctx.fillStyle = rgb(shade(p.stoneLo, -15));
  ctx.fillRect(winLeft, winY, winSize, winSize);
  ctx.fillRect(winRight, winY, winSize, winSize);
  if (g > 0) {
    ctx.fillStyle = `rgba(246,196,83,${0.9 * pulse * g})`;
    ctx.fillRect(winLeft, winY, winSize, winSize);
    ctx.fillRect(winRight, winY, winSize, winSize);
  }
}

function drawTower(
  ctx: CanvasRenderingContext2D,
  s: Structure,
  sx: number,
  sy: number,
  tick: number,
  phase: Phase,
) {
  const p = s.biome;
  const g = nightGlow(phase);
  const wallX = sx + 3;
  const wallY = sy + 6;
  const wallW = TILE * 2 - 6;
  const wallH = TILE * 3 - 10;

  ctx.fillStyle = rgb(shade(p.stoneLo, -10));
  ctx.fillRect(wallX - 1, wallY + wallH - 2, wallW + 2, 2);

  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(wallX, wallY, wallW, wallH);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(wallX, wallY, wallW, 1);
  ctx.fillRect(wallX, wallY, 1, wallH);
  ctx.fillStyle = rgb(p.stoneLo);
  ctx.fillRect(wallX + wallW - 1, wallY, 1, wallH);

  ctx.fillStyle = rgb(p.stoneLo);
  for (let y = wallY + 5; y < wallY + wallH; y += 6) {
    ctx.fillRect(wallX + 1, y, wallW - 2, 1);
  }

  ctx.fillStyle = rgb(p.stone);
  const crenH = 3;
  const crenY = wallY - crenH;
  ctx.fillRect(wallX, crenY, wallW, crenH);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(wallX, crenY, wallW, 1);
  ctx.fillStyle = rgb(shade(p.stoneLo, -5));
  ctx.fillRect(wallX + 2, crenY, 2, crenH);
  ctx.fillRect(wallX + wallW - 4, crenY, 2, crenH);

  const flagX = wallX + Math.floor(wallW / 2);
  ctx.fillStyle = rgb(p.stoneLo);
  ctx.fillRect(flagX, crenY - 5, 1, 5);
  const wave = Math.sin(tick * 0.15 + s.seed) > 0 ? 1 : 0;
  ctx.fillStyle = rgb(p.accent);
  ctx.fillRect(flagX + 1, crenY - 5 + wave, 3, 2);

  const floors = 3;
  const winSize = 3;
  for (let f = 0; f < floors; f++) {
    const winY = wallY + 4 + f * 10;
    const winX = wallX + (wallW - winSize) / 2;
    ctx.fillStyle = rgb(shade(p.stoneLo, -15));
    ctx.fillRect(winX, winY, winSize, winSize + 1);
    if (g > 0) {
      const pulse = 0.5 + 0.5 * Math.sin(tick * 0.1 + s.seed + f);
      ctx.fillStyle = `rgba(246,196,83,${0.85 * pulse * g})`;
      ctx.fillRect(winX, winY, winSize, winSize + 1);
    }
  }

  const doorW = 4;
  const doorH = 8;
  const doorX = wallX + (wallW - doorW) / 2;
  const doorY = wallY + wallH - doorH;
  ctx.fillStyle = rgb(shade(p.stoneLo, -20));
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = rgb(shade(p.stoneLo, -30));
  ctx.fillRect(doorX + 1, doorY, doorW - 2, 1);
  if (g > 0) {
    ctx.fillStyle = `rgba(246,196,83,${0.3 * g})`;
    ctx.fillRect(doorX + 1, doorY + 2, doorW - 2, doorH - 3);
  }
}

function drawHall(
  ctx: CanvasRenderingContext2D,
  s: Structure,
  sx: number,
  sy: number,
  tick: number,
  phase: Phase,
) {
  const p = s.biome;
  const g = nightGlow(phase);
  const wallX = sx + 2;
  const wallY = sy + 14;
  const wallW = TILE * 3 - 4;
  const wallH = TILE * 2 + 4;

  ctx.fillStyle = rgb(shade(p.stoneLo, -12));
  ctx.fillRect(wallX - 1, wallY + wallH - 2, wallW + 2, 2);
  ctx.fillRect(wallX - 2, wallY + wallH, wallW + 4, 2);

  ctx.fillStyle = rgb(p.stone);
  ctx.fillRect(wallX, wallY, wallW, wallH);
  ctx.fillStyle = rgb(p.stoneHi);
  ctx.fillRect(wallX, wallY, wallW, 1);
  ctx.fillStyle = rgb(p.stoneLo);
  for (let y = wallY + 6; y < wallY + wallH; y += 7) {
    ctx.fillRect(wallX + 1, y, wallW - 2, 1);
  }

  const peakH = 8;
  ctx.fillStyle = rgb(shade(p.stone, -25));
  for (let i = 0; i < peakH; i++) {
    const inset = Math.floor(i * 0.8);
    ctx.fillRect(wallX + inset, wallY - peakH + i, wallW - inset * 2, 1);
  }
  ctx.fillStyle = rgb(shade(p.stone, -5));
  ctx.fillRect(wallX + 4, wallY - peakH + 2, wallW - 8, 1);

  ctx.fillStyle = rgb(p.stoneLo);
  ctx.fillRect(wallX, wallY, 1, wallH);
  ctx.fillRect(wallX + wallW - 1, wallY, 1, wallH);

  const winCount = 3;
  const winSize = 4;
  const totalW = winCount * winSize + (winCount - 1) * 4;
  const winStartX = wallX + (wallW - totalW) / 2;
  const winY = wallY + 5;
  const colors: [number, number, number][] = [
    [180, 120, 220], [120, 200, 220], [246, 196, 83],
  ];
  for (let i = 0; i < winCount; i++) {
    const x = winStartX + i * (winSize + 4);
    ctx.fillStyle = rgb(shade(p.stoneLo, -15));
    ctx.fillRect(x - 1, winY - 1, winSize + 2, winSize + 2);
    const cIdx = (i + Math.floor(tick / 120)) % colors.length;
    const base = colors[cIdx];
    const pulse = 0.45 + 0.45 * Math.sin(tick * 0.05 + s.seed + i);
    const a = g > 0 ? 0.55 + 0.35 * g * pulse : 0.55 * pulse;
    ctx.fillStyle = `rgba(${base[0]},${base[1]},${base[2]},${a})`;
    ctx.fillRect(x, winY, winSize, winSize);
  }

  const doorW = 6;
  const doorH = 12;
  const doorX = wallX + (wallW - doorW) / 2;
  const doorY = wallY + wallH - doorH;
  ctx.fillStyle = rgb(shade(p.stoneLo, -20));
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = rgb(shade(p.stoneLo, -30));
  ctx.fillRect(doorX, doorY, doorW, 1);
  ctx.fillRect(doorX + Math.floor(doorW / 2), doorY, 1, doorH);
  if (g > 0) {
    ctx.fillStyle = `rgba(246,196,83,${0.45 * g})`;
    ctx.fillRect(doorX + 1, doorY + 2, doorW - 2, doorH - 3);
  }

  ctx.fillStyle = rgb(shade(p.stone, 10));
  ctx.fillRect(wallX + 1, wallY + wallH - 2, 2, 2);
  ctx.fillRect(wallX + wallW - 3, wallY + wallH - 2, 2, 2);

  if (g > 0.3) {
    const flick = 0.4 + 0.6 * Math.random();
    ctx.fillStyle = `rgba(246,140,48,${flick * g})`;
    ctx.fillRect(wallX + 1, wallY + wallH - 4, 1, 2);
    ctx.fillRect(wallX + wallW - 2, wallY + wallH - 4, 1, 2);
  }
}
