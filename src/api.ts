import { Situation } from './situations.js';

export interface Api {
  situation: Situation;
}

export function init(situation: Situation): Api {
  return {
    situation,
  };
}
