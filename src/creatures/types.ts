export type CreatureKind = 'wolf' | 'fox' | 'kirin' | 'phoenix' | 'dragon' | 'owl';

export type CreatureState = 'idle' | 'wander' | 'seek' | 'rest' | 'patrol';

export interface Creature {
  kind: CreatureKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  dir: 1 | -1;
  state: CreatureState;
  stateUntil: number;
  targetX: number;
  targetY: number;
  speed: number;
  animTick: number;
}

export const SPEEDS: Record<CreatureKind, number> = {
  wolf: 0.06,
  fox: 0.08,
  kirin: 0.04,
  phoenix: 0.12,
  dragon: 0.08,
  owl: 0.10,
};

export function makeCreature(kind: CreatureKind, x: number, y: number): Creature {
  return {
    kind,
    x, y,
    vx: 0, vy: 0,
    dir: 1,
    state: 'idle',
    stateUntil: 0,
    targetX: x,
    targetY: y,
    speed: SPEEDS[kind],
    animTick: Math.floor(Math.random() * 1000),
  };
}
