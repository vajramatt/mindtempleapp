export const TILE = 16;
export const NATIVE_W = 480;
export const NATIVE_H = 320;

export interface Surface {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export function initSurface(canvasEl: HTMLCanvasElement): Surface {
  canvasEl.width = NATIVE_W;
  canvasEl.height = NATIVE_H;
  const ctx = canvasEl.getContext('2d', { alpha: false })!;
  ctx.imageSmoothingEnabled = false;
  fitToViewport(canvasEl);
  window.addEventListener('resize', () => fitToViewport(canvasEl));
  return { canvas: canvasEl, ctx, width: NATIVE_W, height: NATIVE_H };
}

function fitToViewport(canvasEl: HTMLCanvasElement) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scaleX = vw / NATIVE_W;
  const scaleY = vh / NATIVE_H;
  const scale = Math.max(scaleX, scaleY);
  const cssW = NATIVE_W * scale;
  const cssH = NATIVE_H * scale;
  canvasEl.style.width = `${cssW}px`;
  canvasEl.style.height = `${cssH}px`;
  canvasEl.style.left = `${(vw - cssW) / 2}px`;
  canvasEl.style.top = `${(vh - cssH) / 2}px`;
  canvasEl.style.position = 'absolute';
}

export function makeOffscreen(w: number, h: number): Surface {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { alpha: true })!;
  ctx.imageSmoothingEnabled = false;
  return { canvas: c, ctx, width: w, height: h };
}
