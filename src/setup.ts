import { Configuration } from './configuration.js';
import { pieceAtSquare, Situation } from './situations.js';
import { diff, squareX, squareY } from './square.js';
import { Elements, Pieces, Setup, Square } from './types.js';

// Puzzle setup is a string like this:
//
// G1 K K G2
// G1 K K G2
// B  S S R
// B  N L R
// P1 . . P2
//
// Separate all pieces and empty squares with a space
// Each row ends with a newline or a '/'
// Same as above: 'G1 K K G2/G1 K K G2/B S S R/B N L R/ P1 . . P2'

// We start at top left corner, we say what piece is at each square
// The name needs to be UNIQUE, dot represents empty square
// All pieces must be rectangular no L or T shapes
// The name will be used as class for styling

export const hakoIriMusume0: Setup = `G1 K K G2
                                      G1 K K G2
                                      B  S S R
                                      B  N L R
                                      P1 . . P2`;

export const hakoIriMusume1: Setup = `.  K K .
                                      G1 K K G2
                                      G1 B R G2
                                      P1 B R P2
                                      S  S L N`;

export function getSetup(sit: Situation): Setup {
  let board = '';
  for (let i: Square = 0; i < sit.width * sit.height; i++) {
    const p = pieceAtSquare(sit, i);
    const sep = (i + 1) % sit.width === 0 ? '\n' : ' ';
    board += (p ? p.name : '.') + sep;
  }
  return board;
}

export function createSituation(board: Setup, els: Elements, config: Configuration): Situation {
  const rows = board
    .replace(/\n/g, '/')
    .split('/')
    .map((r: string) => r.replace(/\s\s+/g, ' ').replace(/^\s+|\s+$/g, ''));
  const width = rows[0].split(' ').length;
  const height = rows.length;
  const pieces: Pieces = [];
  const boardMap: Map<Square, string> = new Map();

  let curSq: Square = 0;

  for (const r of rows) {
    for (const p of r.split(' ')) {
      if (p == '.') {
        curSq += 1;
      } else {
        boardMap.set(curSq, p);
        curSq++;
      }
    }
  }

  const checkedSquares: Set<Square> = new Set();

  function finishPiece(sq: Square): Square[] {
    const pieceSquares: Square[] = [sq];
    for (const n of [sq + width, sq + 1].filter((s) => {
      return (
        s <= width * height &&
        diff(squareX(sq, width), squareX(s, width)) <= 1 &&
        diff(squareY(sq, width), squareY(s, width)) <= 1
      );
    })) {
      if (!checkedSquares.has(n) && boardMap.get(n) === boardMap.get(sq)) {
        checkedSquares.add(n);
        pieceSquares.push(...finishPiece(n));
      }
    }
    return pieceSquares;
  }

  for (const kv of boardMap) {
    if (!checkedSquares.has(kv[0])) {
      const occupiedSquares = finishPiece(kv[0]);
      pieces.push({
        name: kv[1],
        position: kv[0],
        width: diff(squareX(kv[0], width), squareX(Math.max(...occupiedSquares), width)) + 1,
        height: diff(squareY(kv[0], width), squareY(Math.max(...occupiedSquares), width)) + 1,
      });
    }
  }

  return {
    pieces: pieces,
    occupied: Array.from(boardMap.keys()),
    moves: 0,
    width: width,
    height: height,
    elements: els,
    config: config,
  };
}
