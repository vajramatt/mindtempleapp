import type { RGB } from '../palette/colors.ts';
import { rgb, mix, SKY } from '../palette/colors.ts';

export const CYCLE_LEN = 3600;

export type Phase = 'dawn' | 'day' | 'dusk' | 'night';

export function phaseOf(tick: number): Phase {
  const t = tick % CYCLE_LEN;
  if (t < 600) return 'dawn';
  if (t < 1800) return 'day';
  if (t < 2400) return 'dusk';
  return 'night';
}

export function skyGradient(tick: number): [RGB, RGB] {
  const t = tick % CYCLE_LEN;
  if (t < 600) {
    const k = t / 600;
    const lo = mix(SKY.nightMid, SKY.dawnLow, k);
    const hi = mix(SKY.nightDeep, SKY.dawnHigh, k);
    return [hi, lo];
  }
  if (t < 1800) {
    const k = Math.min(1, (t - 600) / 300);
    const lo = mix(SKY.dawnLow, SKY.dayLow, k);
    const hi = mix(SKY.dawnHigh, SKY.dayHigh, k);
    return [hi, lo];
  }
  if (t < 2400) {
    const k = (t - 1800) / 600;
    const lo = mix(SKY.dayLow, SKY.duskLow, k);
    const hi = mix(SKY.dayHigh, SKY.duskHigh, k);
    return [hi, lo];
  }
  const k = (t - 2400) / 1200;
  const lo = mix(SKY.duskLow, SKY.nightMid, k);
  const hi = mix(SKY.duskHigh, SKY.nightDeep, k);
  return [hi, lo];
}

export function drawSky(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
  const [hi, lo] = skyGradient(tick);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, rgb(hi));
  g.addColorStop(1, rgb(lo));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const phase = phaseOf(tick);
  if (phase === 'night') drawStars(ctx, w, h, tick);
}

function drawStars(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  for (let i = 0; i < 50; i++) {
    const hx = (i * 2654435761) >>> 0;
    const hy = (i * 40503) >>> 0;
    const x = hx % w;
    const y = hy % Math.floor(h * 0.55);
    const tw = Math.sin(tick * 0.05 + i);
    if (tw > 0.2) ctx.fillRect(x, y, 1, 1);
  }
}

export function nightOverlayAlpha(tick: number): number {
  const t = tick % CYCLE_LEN;
  if (t < 600) return 0.55 * (1 - t / 600);
  if (t < 1800) return 0;
  if (t < 2400) return 0.55 * ((t - 1800) / 600);
  return 0.55;
}

export function applyNightOverlay(ctx: CanvasRenderingContext2D, w: number, h: number, tick: number) {
  const a = nightOverlayAlpha(tick);
  if (a <= 0.01) return;
  ctx.fillStyle = `rgba(6, 8, 24, ${a})`;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}
