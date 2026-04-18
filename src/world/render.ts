import type { WorldGrid } from './state.ts';
import type { Camera } from '../engine/camera.ts';
import { TILE } from '../engine/canvas.ts';
import { getTile } from './state.ts';
import {
  drawGrassTile,
  drawStoneTile,
  drawSandTile,
  drawWaterTile,
  drawPathTile,
} from './terrain.ts';

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  world: WorldGrid,
  cam: Camera,
  viewW: number,
  viewH: number,
  tick: number,
) {
  const minTx = Math.floor(cam.x / TILE) - 1;
  const maxTx = Math.ceil((cam.x + viewW) / TILE) + 1;
  const minTy = Math.floor(cam.y / TILE) - 1;
  const maxTy = Math.ceil((cam.y + viewH) / TILE) + 1;

  for (let ty = minTy; ty <= maxTy; ty++) {
    for (let tx = minTx; tx <= maxTx; tx++) {
      const t = getTile(world, tx, ty);
      if (!t) continue;
      const px = tx * TILE - Math.round(cam.x);
      const py = ty * TILE - Math.round(cam.y);
      const neighbors = (kind: typeof t.kind) => {
        const n =
          (getTile(world, tx + 1, ty)?.kind === kind) ||
          (getTile(world, tx - 1, ty)?.kind === kind) ||
          (getTile(world, tx, ty + 1)?.kind === kind) ||
          (getTile(world, tx, ty - 1)?.kind === kind);
        return n;
      };
      switch (t.kind) {
        case 'grass': drawGrassTile(ctx, t, px, py, tx, ty); break;
        case 'water': drawWaterTile(ctx, t, px, py, tx, ty, tick, neighbors); break;
        case 'sand':  drawSandTile(ctx, t, px, py, tx, ty); break;
        case 'stone': drawStoneTile(ctx, t, px, py, tx, ty); break;
        case 'path':  drawPathTile(ctx, t, px, py); break;
      }
    }
  }
}
