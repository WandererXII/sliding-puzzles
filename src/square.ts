import { Situation } from './situations.js';
import { Square } from './types.js';

export function diff(a: Square, b: Square): number {
  return Math.abs(a - b);
}

export function manhattanDist(sq1: Square, sq2: Square, width: number): number {
  return (
    diff(squareX(sq1, width), squareX(sq2, width)) + diff(squareY(sq1, width), squareY(sq2, width))
  );
}

export function squareY(sq: Square, width: number): number {
  return Math.floor(sq / width);
}

export function squareX(sq: Square, width: number): number {
  return sq % width;
}

export function toSquare(x: number, y: number, width: number): Square {
  return y * width + x;
}

// returns top, right, down, left neighbor
export function findNeighbors(sq: Square, width: number, height: number): Square[] {
  return [sq + width, sq - width, sq + 1, sq - 1].filter((s) => {
    return (
      s >= 0 &&
      s <= width * height &&
      diff(squareX(sq, width), squareX(s, width)) <= 1 &&
      diff(squareY(sq, width), squareY(s, width)) <= 1
    );
  });
}

export function getKeyAtDomPos(
  sit: Situation,
  pos: [number, number],
  bounds: DOMRect,
): Square | undefined {
  const x = Math.floor((sit.width * (pos[0] - bounds.left)) / bounds.width),
    y = Math.floor((sit.height * (pos[1] - bounds.top)) / bounds.height);
  return x >= 0 && x < sit.width && y >= 0 && y < sit.height
    ? toSquare(x, y, sit.width)
    : undefined;
}
