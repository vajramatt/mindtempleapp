import { TILE } from './canvas.ts';

export interface Camera {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  zoom: number;
}

export function makeCamera(startX = 0, startY = 0): Camera {
  return { x: startX, y: startY, targetX: startX, targetY: startY, zoom: 1 };
}

export function updateCamera(cam: Camera) {
  cam.x += (cam.targetX - cam.x) * 0.12;
  cam.y += (cam.targetY - cam.y) * 0.12;
}

export function pan(cam: Camera, dx: number, dy: number) {
  cam.targetX += dx;
  cam.targetY += dy;
}

export function worldToScreen(cam: Camera, wx: number, wy: number): [number, number] {
  return [wx - cam.x, wy - cam.y];
}

export function screenToWorld(cam: Camera, sx: number, sy: number): [number, number] {
  return [sx + cam.x, sy + cam.y];
}

export const tilesToPx = (t: number) => t * TILE;
