export interface LoopHandle {
  tick: number;
  running: boolean;
  stop(): void;
}

export interface LoopOpts {
  onUpdate: (tick: number) => void;
  onRender: (tick: number, alpha: number) => void;
  updatesPerSec?: number;
  startTick?: number;
}

export function startLoop({ onUpdate, onRender, updatesPerSec = 30, startTick = 0 }: LoopOpts): LoopHandle {
  const stepMs = 1000 / updatesPerSec;
  let last = performance.now();
  let acc = 0;
  const handle: LoopHandle = { tick: startTick, running: true, stop: () => { handle.running = false; } };

  const frame = (now: number) => {
    if (!handle.running) return;
    let dt = now - last;
    last = now;
    if (dt > 250) dt = 250;
    acc += dt;
    while (acc >= stepMs) {
      onUpdate(handle.tick);
      handle.tick++;
      acc -= stepMs;
    }
    const alpha = acc / stepMs;
    onRender(handle.tick, alpha);
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
  return handle;
}
