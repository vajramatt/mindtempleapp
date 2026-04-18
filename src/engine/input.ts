import type { Camera } from './camera.ts';
import { NATIVE_W, NATIVE_H } from './canvas.ts';

export function wireInput(canvasEl: HTMLCanvasElement, cam: Camera) {
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const ratio = () => {
    const r = canvasEl.getBoundingClientRect();
    return { rx: NATIVE_W / r.width, ry: NATIVE_H / r.height };
  };

  canvasEl.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvasEl.setPointerCapture(e.pointerId);
  });

  canvasEl.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const { rx, ry } = ratio();
    cam.targetX -= (e.clientX - lastX) * rx;
    cam.targetY -= (e.clientY - lastY) * ry;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  const end = () => { dragging = false; };
  canvasEl.addEventListener('pointerup', end);
  canvasEl.addEventListener('pointercancel', end);
  canvasEl.addEventListener('pointerleave', end);

  const keys = new Set<string>();
  window.addEventListener('keydown', (e) => keys.add(e.key));
  window.addEventListener('keyup', (e) => keys.delete(e.key));

  return { keys };
}

export function applyKeyboardPan(cam: Camera, keys: Set<string>, speed = 4) {
  if (keys.has('ArrowLeft') || keys.has('a')) cam.targetX -= speed;
  if (keys.has('ArrowRight') || keys.has('d')) cam.targetX += speed;
  if (keys.has('ArrowUp') || keys.has('w')) cam.targetY -= speed;
  if (keys.has('ArrowDown') || keys.has('s')) cam.targetY += speed;
}
