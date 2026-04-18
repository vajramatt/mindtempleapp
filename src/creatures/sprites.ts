import type { Creature } from './types.ts';
import type { Camera } from '../engine/camera.ts';
import { rgb } from '../palette/colors.ts';

export function drawCreature(
  ctx: CanvasRenderingContext2D,
  c: Creature,
  cam: Camera,
) {
  const sx = Math.round(c.x - cam.x);
  const sy = Math.round(c.y - cam.y);
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(sx - 3, sy + 2, 7, 2);

  switch (c.kind) {
    case 'wolf': drawWolf(ctx, c, sx, sy); break;
    default: drawPlaceholder(ctx, sx, sy); break;
  }
}

const GREY = [120, 120, 130] as const;
const GREY_HI = [160, 160, 170] as const;
const GREY_LO = [70, 70, 82] as const;
const EYE_GOLD = [246, 196, 83] as const;

function drawWolf(ctx: CanvasRenderingContext2D, c: Creature, sx: number, sy: number) {
  const d = c.dir;
  const moving = Math.hypot(c.vx, c.vy) > 0.01;
  const step = moving ? Math.sin(c.animTick * 0.35) : 0;
  const legA = step > 0 ? 1 : 0;
  const legB = step > 0 ? 0 : 1;

  const cx = sx + (d === 1 ? 0 : 0);
  const bodyX = cx - 3;
  const bodyY = sy - 2;

  ctx.fillStyle = rgb(GREY_LO);
  ctx.fillRect(bodyX - 1, bodyY + 1, 7, 2);

  ctx.fillStyle = rgb(GREY);
  ctx.fillRect(bodyX, bodyY, 5, 2);

  ctx.fillStyle = rgb(GREY_HI);
  ctx.fillRect(bodyX, bodyY, 5, 1);

  const headX = d === 1 ? bodyX + 4 : bodyX - 2;
  ctx.fillStyle = rgb(GREY);
  ctx.fillRect(headX, bodyY - 1, 2, 3);
  ctx.fillStyle = rgb(GREY_HI);
  ctx.fillRect(headX, bodyY - 1, 2, 1);

  ctx.fillStyle = rgb(GREY_LO);
  ctx.fillRect(headX + (d === 1 ? 0 : 0), bodyY - 2, 1, 1);
  ctx.fillRect(headX + 1, bodyY - 2, 1, 1);

  ctx.fillStyle = rgb(EYE_GOLD);
  ctx.fillRect(headX + (d === 1 ? 1 : 0), bodyY, 1, 1);

  const snoutX = d === 1 ? headX + 2 : headX - 1;
  ctx.fillStyle = rgb(GREY_HI);
  ctx.fillRect(snoutX, bodyY, 1, 1);

  ctx.fillStyle = rgb(GREY_LO);
  ctx.fillRect(bodyX + 0, bodyY + 3 - legA, 1, 1 + legA);
  ctx.fillRect(bodyX + 1, bodyY + 3 - legB, 1, 1 + legB);
  ctx.fillRect(bodyX + 3, bodyY + 3 - legB, 1, 1 + legB);
  ctx.fillRect(bodyX + 4, bodyY + 3 - legA, 1, 1 + legA);

  const tailUp = Math.sin(c.animTick * 0.2) > 0 ? 0 : 1;
  const tailX = d === 1 ? bodyX - 2 : bodyX + 5;
  ctx.fillStyle = rgb(GREY);
  ctx.fillRect(tailX, bodyY - tailUp, 2, 1);
  ctx.fillStyle = rgb(GREY_HI);
  ctx.fillRect(tailX + (d === 1 ? 0 : 1), bodyY - tailUp, 1, 1);
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, sx: number, sy: number) {
  ctx.fillStyle = rgb([220, 220, 220]);
  ctx.fillRect(sx - 2, sy - 2, 4, 4);
}
