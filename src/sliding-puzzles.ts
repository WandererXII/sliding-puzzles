import { type Api, init } from './api.js';
import { type Configuration, defaultConfig } from './configuration.js';
import { events } from './event.js';
import { redraw, wrap } from './render.js';
import { createSituation } from './setup.js';
import type { Setup } from './types.js';

export function SlidingPuzzles(
  el: HTMLElement,
  setup: Setup,
  config: Configuration = {},
): Api {
  const els = wrap(el);
  const sit = createSituation(
    setup,
    els,
    Object.assign({}, defaultConfig(), config),
  );
  redraw(sit);
  const unbind = events(sit);
  return init(sit, unbind);
}
