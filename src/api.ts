import { Situation } from './situations';

export interface Api {
  situation: Situation;
}

export function init(situation: Situation): Api {
  return {
    situation,
  };
}
