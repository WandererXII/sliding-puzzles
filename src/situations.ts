import { Configuration } from './configuration';
import { findNeighbors, manhattanDist, squareX, squareY, toSquare } from './square';
import { Elements, Piece, Pieces, Square } from './types';

export interface Situation {
  pieces: Pieces;
  occupied: Square[];
  moves: number;
  width: number;
  height: number;
  elements: Elements;
  config: Configuration;
  selected?: Square;
  pos?: [number, number];
}

export function pieceAtSquare(sit: Situation, sq: Square): Piece | undefined {
  const x = squareX(sq, sit.width);
  const y = squareY(sq, sit.width);
  for (const p of sit.pieces) {
    if (
      squareX(p.position, sit.width) <= x &&
      squareX(p.position, sit.width) + p.width > x &&
      squareY(p.position, sit.width) <= y &&
      squareY(p.position, sit.width) + p.height > y
    )
      return p;
  }
  return undefined;
}

export function squareArea(sit: Situation, position: Square, width: number, height: number): Square[] {
  const sqs: Square[] = [];
  for (let x = squareX(position, sit.width); x < squareX(position, sit.width) + width; x++) {
    for (let y = squareY(position, sit.width); y < squareY(position, sit.width) + height; y++) {
      sqs.push(toSquare(x, y, sit.width));
    }
  }
  return sqs;
}

export function findAllMoves(sit: Situation, piece: Piece | undefined): Square[] {
  if (!piece) return [];
  const curPieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
  const sitNormalized = JSON.parse(JSON.stringify(sit));
  sitNormalized.config = sit.config;
  sitNormalized.selected = piece.position;

  function innerFind(sit: Situation, piece: Piece | undefined, checked: Square[]) {
    if (!piece) return [];
    const neighbors: Square[] = [];
    const pieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
    const res: Square[] = pieceSquares;
    for (const p of pieceSquares) {
      neighbors.push(...findNeighbors(p, sit.width, sit.height));
    }
    checked.push(piece.position);

    for (const n of neighbors) {
      if (!checked.includes(n)) {
        if (canMoveTo(sit, n)) {
          const sitCopy = JSON.parse(JSON.stringify(sit));
          sitCopy.config = sit.config;

          move(sitCopy, n);

          sitCopy.selected = n;
          res.push(...innerFind(sitCopy, pieceAtSquare(sitCopy, sitCopy.selected), checked));
        }
      }
    }
    return res;
  }

  return [...new Set(innerFind(sitNormalized, piece, [] as Square[]).filter((sq) => !curPieceSquares.includes(sq)))];
}

export function canMoveTo(sit: Situation, to: Square): boolean {
  if (sit.selected === undefined || sit.selected === to || sit.config.solution(sit) || sit.config.movable === false)
    return false;
  const selectedPiece = pieceAtSquare(sit, sit.selected);
  if (!selectedPiece) return false;

  const diff = sit.selected - to;
  const piecePosToBe = selectedPiece.position - diff;
  const pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
  const afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);

  if (
    pieceSquares.some((sq) => findNeighbors(sq, sit.width, sit.height).includes(to)) &&
    afterPieceSquares.every((sq) => sq >= 0 && sq < sit.width * sit.height) &&
    !afterPieceSquares.some((sq) => sit.occupied.includes(sq) && !pieceSquares.includes(sq))
  )
    return true;
  return false;
}

export function move(sit: Situation, to: Square): void {
  if (sit.selected === undefined) return;
  const selectedPiece = pieceAtSquare(sit, sit.selected);
  if (!selectedPiece) return;

  const piecePosToBe = selectedPiece.position - (sit.selected - to);

  const pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
  const afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);
  sit.occupied = sit.occupied.filter((sq) => !pieceSquares.includes(sq));
  sit.occupied.push(...afterPieceSquares);

  sit.moves += manhattanDist(selectedPiece.position, piecePosToBe, sit.width);
  selectedPiece.position = piecePosToBe;
}
