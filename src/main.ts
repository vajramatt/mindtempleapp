import { initSurface, NATIVE_W, NATIVE_H, TILE } from './engine/canvas.ts';
import { makeCamera, updateCamera } from './engine/camera.ts';
import { startLoop } from './engine/gameloop.ts';
import { wireInput, applyKeyboardPan } from './engine/input.ts';
import {
  SACRED_GROVE,
  CRYSTAL_CAVERNS,
  EMBER_COAST,
  MOONLIT_LAKE,
  WINDSWEPT_PLATEAU,
} from './palette/colors.ts';
import { generate, type BiomeSite } from './world/generator.ts';
import { renderWorld } from './world/render.ts';
import { placeStructures } from './world/placement.ts';
import { drawStructure, structureFootprint } from './world/structures.ts';
import { drawSky, applyNightOverlay, phaseOf } from './lighting/cycle.ts';
import { makeCreature } from './creatures/types.ts';
import { updateCreature } from './creatures/ai.ts';
import { drawCreature } from './creatures/sprites.ts';
import type { Creature } from './creatures/types.ts';

const canvasEl = document.getElementById('world') as HTMLCanvasElement;
const surf = initSurface(canvasEl);
const { ctx } = surf;

const W_TILES = 96;
const H_TILES = 60;

const sites: BiomeSite[] = [
  { id: 'grove',   cx: 24, cy: 30, palette: SACRED_GROVE,      weight: 1.4 },
  { id: 'cavern',  cx: 70, cy: 18, palette: CRYSTAL_CAVERNS,   weight: 1.0 },
  { id: 'ember',   cx: 14, cy: 50, palette: EMBER_COAST,       weight: 1.0 },
  { id: 'lake',    cx: 48, cy: 44, palette: MOONLIT_LAKE,      weight: 1.2 },
  { id: 'plateau', cx: 82, cy: 48, palette: WINDSWEPT_PLATEAU, weight: 1.1 },
];

const world = generate({ width: W_TILES, height: H_TILES, sites, seed: 7 });

const structures = placeStructures(
  world,
  [
    { drawers: 3,  closet: true,  nearTile: { x: 24, y: 30 }, biome: SACRED_GROVE,      name: 'threshold' },
    { drawers: 8,  closet: true,  nearTile: { x: 28, y: 26 }, biome: SACRED_GROVE,      name: 'riverbank' },
    { drawers: 20, closet: true,  nearTile: { x: 22, y: 34 }, biome: SACRED_GROVE,      name: 'inkwell' },
    { drawers: 50, closet: true,  nearTile: { x: 18, y: 28 }, biome: SACRED_GROVE,      name: 'grove hall' },
    { drawers: 6,  closet: false, nearTile: { x: 70, y: 18 }, biome: CRYSTAL_CAVERNS,   name: 'echo' },
    { drawers: 18, closet: true,  nearTile: { x: 66, y: 22 }, biome: CRYSTAL_CAVERNS,   name: 'mirror' },
    { drawers: 4,  closet: false, nearTile: { x: 14, y: 50 }, biome: EMBER_COAST,       name: 'cairn' },
    { drawers: 12, closet: true,  nearTile: { x: 18, y: 46 }, biome: EMBER_COAST,       name: 'forge' },
    { drawers: 7,  closet: true,  nearTile: { x: 48, y: 44 }, biome: MOONLIT_LAKE,      name: 'stillness' },
    { drawers: 3,  closet: true,  nearTile: { x: 82, y: 48 }, biome: WINDSWEPT_PLATEAU, name: 'watch' },
    { drawers: 25, closet: true,  nearTile: { x: 78, y: 52 }, biome: WINDSWEPT_PLATEAU, name: 'standing' },
  ],
  777,
);

const focusX = 26 * TILE;
const focusY = 30 * TILE;
const cam = makeCamera(focusX - NATIVE_W / 2, focusY - NATIVE_H / 2);
const { keys } = wireInput(canvasEl, cam);

const creatures: Creature[] = [
  makeCreature('wolf', 26 * TILE, 30 * TILE),
  makeCreature('wolf', 50 * TILE, 34 * TILE),
];

startLoop({
  startTick: 1000,
  onUpdate: (tick) => {
    applyKeyboardPan(cam, keys, 4);
    updateCamera(cam);
    for (const c of creatures) updateCreature(c, world, tick);
  },
  onRender: (tick) => {
    drawSky(ctx, NATIVE_W, NATIVE_H, tick);
    renderWorld(ctx, world, cam, NATIVE_W, NATIVE_H, tick);

    const phase = phaseOf(tick);
    type Drawable = { y: number; draw: () => void };
    const drawables: Drawable[] = [];
    for (const s of structures) {
      const fp = structureFootprint(s.kind);
      const sx = s.tileX * TILE - Math.round(cam.x);
      const sy = s.tileY * TILE - Math.round(cam.y);
      const footY = s.tileY * TILE + fp.h * TILE;
      if (sx > NATIVE_W || sy > NATIVE_H || sx + fp.w * TILE < 0 || sy + fp.h * TILE < 0) continue;
      drawables.push({ y: footY, draw: () => drawStructure(ctx, s, sx, sy, tick, phase) });
    }
    for (const c of creatures) {
      drawables.push({ y: c.y, draw: () => drawCreature(ctx, c, cam) });
    }
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    applyNightOverlay(ctx, NATIVE_W, NATIVE_H, tick);
  },
});
