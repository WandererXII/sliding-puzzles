import { redraw } from './render.js';
import { canMoveTo, move, pieceAtSquare, Situation } from './situations.js';
import { getKeyAtDomPos } from './square.js';
import { Unbind } from './types.js';
import { eventPosition, posDiff } from './util.js';

export function events(sit: Situation): Unbind {
  const unbinds: Unbind[] = [];

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
          e.target.addEventListener('touchmove', onMove(sit), { once: false });
          e.target.addEventListener('touchend', onEnd(sit), { once: false });
        }

        const pos = eventPosition(e);
        if (pos) {
          const sq = getKeyAtDomPos(sit, pos, sit.elements.board.getBoundingClientRect());
          sit.selected = sq;
          sit.pos = pos;
          redraw(sit);
        }
      },
      { passive: false },
    );
  }

  unbinds.push(unbindable('mousemove', onMove(sit), { once: false }));
  unbinds.push(unbindable('mouseup', onEnd(sit), { once: false }));

  sit.elements.main.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  return () => unbinds.forEach((f) => f());
}

function onMove(sit: Situation) {
  return (e: Event) => {
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
  };
}

function onEnd(sit: Situation): Unbind {
  return () => {
    sit.selected = undefined;
    sit.pos = undefined;
    redraw(sit);
  };
}

function unbindable(
  eventName: string,
  callback: EventListener,
  options: AddEventListenerOptions,
): Unbind {
  document.addEventListener(eventName, callback, options);
  return () => document.removeEventListener(eventName, callback, options);
}
