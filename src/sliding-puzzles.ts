import { Api, init } from './api.js';
import { Configuration, defaultConfig } from './configuration.js';
import { events } from './event.js';
import { redraw, wrap } from './render.js';
import { createSituation } from './setup.js';
import { Setup } from './types.js';

export function SlidingPuzzles(el: HTMLElement, setup: Setup, config: Configuration = {}): Api {
  const els = wrap(el),
    sit = createSituation(setup, els, Object.assign({}, defaultConfig(), config));
  redraw(sit);
  events(sit);
  return init(sit);
}
