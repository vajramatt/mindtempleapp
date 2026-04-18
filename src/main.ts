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
import { makeWorld, paintPond, paintStoneCluster, setKind, getTile } from './world/state.ts';
import { renderWorld } from './world/render.ts';
import { drawSky, applyNightOverlay } from './lighting/cycle.ts';
import { makeCreature } from './creatures/types.ts';
import { updateCreature } from './creatures/ai.ts';
import { drawCreature } from './creatures/sprites.ts';
import type { Creature } from './creatures/types.ts';

const canvasEl = document.getElementById('world') as HTMLCanvasElement;
const surf = initSurface(canvasEl);
const { ctx } = surf;

const W_TILES = 80;
const H_TILES = 50;
const world = makeWorld(W_TILES, H_TILES, SACRED_GROVE);

for (let y = 0; y < H_TILES; y++) {
  for (let x = 0; x < W_TILES; x++) {
    const t = getTile(world, x, y)!;
    if (x < 16) t.biome = EMBER_COAST;
    else if (x < 32) t.biome = SACRED_GROVE;
    else if (x < 48) t.biome = MOONLIT_LAKE;
    else if (x < 64) t.biome = CRYSTAL_CAVERNS;
    else t.biome = WINDSWEPT_PLATEAU;
  }
}

paintPond(world, 40, 25, 4);
paintStoneCluster(world, 22, 18, 1337);
paintStoneCluster(world, 55, 30, 42);
paintStoneCluster(world, 70, 12, 99);

for (let i = 0; i < 12; i++) {
  const x = 8 + i * 6;
  const y = 40 + ((i * 7) % 5);
  setKind(world, x, y, 'path');
}

const focusX = 24 * TILE;
const focusY = 24 * TILE;
const cam = makeCamera(focusX - NATIVE_W / 2, focusY - NATIVE_H / 2);
const { keys } = wireInput(canvasEl, cam);

const creatures: Creature[] = [
  makeCreature('wolf', 24 * TILE, 24 * TILE),
  makeCreature('wolf', 20 * TILE, 22 * TILE),
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

    const sorted = [...creatures].sort((a, b) => a.y - b.y);
    for (const c of sorted) drawCreature(ctx, c, cam);

    applyNightOverlay(ctx, NATIVE_W, NATIVE_H, tick);
  },
});
