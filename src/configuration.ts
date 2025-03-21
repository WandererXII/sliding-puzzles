import { Situation } from './situations.js';
import { Piece } from './types.js';

export interface Configuration {
  solution?: (sit: Situation) => boolean;
  onMove?: (sit: Situation) => void; // called after each move
  specialEffect?: (p: Piece, h: HTMLElement) => void; // called for each piece, you can highlight when piece is correctly placed
  onVictory?: (sit: Situation) => void; // called after you won
  movable?: boolean;
  showDests?: boolean;
}

export function defaultConfig(): Required<Configuration> {
  return {
    solution: () => false,
    onMove: () => {},
    specialEffect: () => {},
    onVictory: () => {},
    movable: true,
    showDests: false,
  };
}
