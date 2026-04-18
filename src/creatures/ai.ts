import type { Creature } from './types.ts';
import type { WorldGrid } from '../world/state.ts';
import { TILE } from '../engine/canvas.ts';
import { getTile } from '../world/state.ts';

export function updateCreature(c: Creature, world: WorldGrid, tick: number) {
  c.animTick++;

  if (tick >= c.stateUntil) {
    pickNextState(c, world, tick);
  }

  switch (c.state) {
    case 'wander':
    case 'seek':
    case 'patrol':
      moveToward(c, world);
      break;
    case 'idle':
    case 'rest':
      c.vx *= 0.85;
      c.vy *= 0.85;
      break;
  }

  c.x += c.vx;
  c.y += c.vy;
  if (Math.abs(c.vx) > 0.02) c.dir = c.vx > 0 ? 1 : -1;
}

function pickNextState(c: Creature, world: WorldGrid, tick: number) {
  const r = Math.random();
  if (c.state === 'idle' || c.state === 'rest') {
    if (r < 0.4) {
      c.state = 'wander';
      c.stateUntil = tick + 100 + Math.floor(Math.random() * 100);
      pickWanderTarget(c, world);
    } else {
      c.state = 'wander';
      c.stateUntil = tick + 150 + Math.floor(Math.random() * 150);
      pickWanderTarget(c, world);
    }
    return;
  }
  c.state = 'idle';
  c.stateUntil = tick + 30 + Math.floor(Math.random() * 90);
}

function pickWanderTarget(c: Creature, world: WorldGrid) {
  for (let i = 0; i < 10; i++) {
    const tx = Math.floor(c.x / TILE) + (Math.floor(Math.random() * 20) - 10);
    const ty = Math.floor(c.y / TILE) + (Math.floor(Math.random() * 12) - 6);
    const t = getTile(world, tx, ty);
    if (t && t.kind !== 'water' && t.kind !== 'stone') {
      c.targetX = tx * TILE + TILE / 2;
      c.targetY = ty * TILE + TILE / 2;
      return;
    }
  }
}

function moveToward(c: Creature, _world: WorldGrid) {
  const dx = c.targetX - c.x;
  const dy = c.targetY - c.y;
  const d = Math.hypot(dx, dy);
  if (d < 1.2) {
    c.vx = c.vy = 0;
    c.state = 'idle';
    c.stateUntil = 0;
    return;
  }
  const s = c.speed;
  c.vx = (dx / d) * s;
  c.vy = (dy / d) * s;
}
