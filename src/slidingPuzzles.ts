import { Api, init } from './api';
import { Configuration, defaultConfig } from './configuration';
import { events } from './event';
import { redraw, wrap } from './render';
import { createSituation } from './setup';
import { Setup } from './types';

export function SlidingPuzzles(el: HTMLElement, setup: Setup, config?: Configuration): Api {
  const els = wrap(el);
  const sit = createSituation(setup, els, Object.assign({}, defaultConfig(), config));
  redraw(sit);
  events(sit);
  return init(sit);
}
