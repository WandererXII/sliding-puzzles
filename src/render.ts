import { findAllMoves, pieceAtSquare, Situation, squareArea } from './situations';
import { squareX, squareY } from './square';
import { Elements } from './types';

export function wrap(el: HTMLElement): Elements {
  el.innerHTML = '';
  const main = document.createElement('sp-main');
  const board = document.createElement('sp-board');
  const els = {
    main: main,
    board: board,
  };

  main.appendChild(board);

  el.appendChild(main);
  return els;
}

export function redraw(sit: Situation) {
  sit.elements.board.innerHTML = '';
  for (const p of sit.pieces) {
    const piece = document.createElement('sp-piece');
    piece.classList.add(p.name);
    if (sit.selected !== undefined && squareArea(sit, p.position, p.width, p.height).includes(sit.selected)) {
      piece.classList.add('selected');
    }
    piece.style.transform = `translate(
            ${squareX(p.position, sit.width) * (100 / p.width)}%,${squareY(p.position, sit.width) * (100 / p.height)}%
        )`;
    piece.style.width = `${(100 / sit.width) * p.width}%`;
    piece.style.height = `${(100 / sit.height) * p.height}%`;
    sit.config.specialEffect(p, piece);
    sit.elements.board.appendChild(piece);
  }
  if (sit.selected !== undefined && sit.config.showDests) {
    const allDest = findAllMoves(sit, pieceAtSquare(sit, sit.selected));
    for (const d of allDest) {
      const squareDest = document.createElement('sp-dest');
      squareDest.style.transform = `translate(
            ${squareX(d, sit.width) * 100}%,${squareY(d, sit.width) * 100}%
        )`;
      squareDest.style.width = `${100 / sit.width}%`;
      squareDest.style.height = `${100 / sit.height}%`;
      sit.elements.board.appendChild(squareDest);
    }
  }
}
