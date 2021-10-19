import { redraw } from './render';
import { canMoveTo, move, pieceAtSquare, Situation } from './situations';
import { getKeyAtDomPos } from './square';
import { eventPosition, posDiff } from './util';

export function events(sit: Situation): void {
  for (const ev of ['touchstart', 'mousedown']) {
    sit.elements.main.addEventListener(
      ev,
      (e: Event & Partial<MouseEvent & TouchEvent>) => {
        // from chessground
        if (!e.isTrusted || (e.button !== undefined && e.button !== 0)) return; // only touch or left click
        if (e.touches && e.touches.length > 1) return; // support one finger touch only
        e.preventDefault();

        // touchmove/touchend needs to bind to e.target
        if (ev === 'touchstart' && e.target) {
          onMove(e.target, sit, 'touchmove');
          onEnd(e.target, sit, 'touchend');
        }

        const pos = eventPosition(e);
        if (pos) {
          const sq = getKeyAtDomPos(sit, pos, sit.elements.board.getBoundingClientRect());
          sit.selected = sq;
          sit.pos = pos;
          redraw(sit);
        }
      },
      { passive: false }
    );
  }

  onMove(document, sit, 'mousemove');
  onEnd(document, sit, 'mouseup');

  sit.elements.main.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });
}

function onMove(el: HTMLElement | EventTarget, sit: Situation, ev: string) {
  el.addEventListener(
    ev,
    (e) => {
      if (sit.selected === undefined || sit.pos === undefined) return;
      e.preventDefault();
      const pos = eventPosition(e);
      if (pos) {
        const sq = getKeyAtDomPos(sit, pos, sit.elements.board.getBoundingClientRect());
        const diff = posDiff(sit.pos, pos);
        if (sq !== undefined && sq !== sit.selected && (diff[0] > 15 || diff[1] > 15)) {
          if (canMoveTo(sit, sq)) {
            move(sit, sq);
            sit.selected = sq;
            sit.pos = pos;
            redraw(sit);
            if (sit.config.solution(sit)) sit.config.onVictory(sit);
            sit.config.onMove(sit);
          } else if (pieceAtSquare(sit, sit.selected) === pieceAtSquare(sit, sq)) {
            sit.selected = sq;
          }
        }
      }
    },
    { once: false }
  );
}

function onEnd(el: HTMLElement | EventTarget, sit: Situation, ev: string) {
  el.addEventListener(
    ev,
    () => {
      sit.selected = undefined;
      sit.pos = undefined;
      redraw(sit);
    },
    { once: false }
  );
}
