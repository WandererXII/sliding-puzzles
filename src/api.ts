import { Situation } from './situations.js';
import { Unbind } from './types.js';

export interface Api {
  situation: Situation;
  destroy: () => void;
}

export function init(situation: Situation, unbind: Unbind): Api {
  return {
    situation,
    destroy: unbind,
  };
}
