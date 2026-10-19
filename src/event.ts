import { redraw } from './render.js';
import {
  canMoveTo,
  move,
  pieceAtSquare,
  type Situation,
} from './situations.js';
import { getKeyAtDomPos } from './square.js';
import type { Unbind } from './types.js';
import { eventPosition, posDiff } from './util.js';

export function events(sit: Situation): Unbind {
  const unbinds: Unbind[] = [];
  let touchUnbinds: Unbind[] = [];
  const clearTouch = () => {
    touchUnbinds.forEach((unbind) => {
      unbind();
    });
    touchUnbinds = [];
  };
  const end = () => {
    clearTouch();
    onEnd(sit)();
  };

  for (const ev of ['touchstart', 'mousedown']) {
    unbinds.push(
      unbindable(
        sit.elements.main,
        ev,
        (e: Event & Partial<MouseEvent & TouchEvent>) => {
          // from chessground
          if (!e.isTrusted || (e.button !== undefined && e.button !== 0))
            return; // only touch or left click
          if (e.touches && e.touches.length > 1) return; // support one finger touch only
          e.preventDefault();

          // touchmove/touchend needs to bind to e.target
          clearTouch();
          if (ev === 'touchstart' && e.target) {
            touchUnbinds = [
              unbindable(e.target, 'touchmove', onMove(sit), {
                passive: false,
              }),
              unbindable(e.target, 'touchend', end, {}),
              unbindable(e.target, 'touchcancel', end, {}),
            ];
          }

          const pos = eventPosition(e);
          if (pos) {
            const sq = getKeyAtDomPos(
              sit,
              pos,
              sit.elements.board.getBoundingClientRect(),
            );
            sit.selected = sq;
            sit.pos = pos;
            redraw(sit);
          }
        },
        { passive: false },
      ),
    );
  }

  unbinds.push(unbindable(document, 'mousemove', onMove(sit), {}));
  unbinds.push(unbindable(document, 'mouseup', end, {}));
  unbinds.push(
    unbindable(
      sit.elements.main,
      'contextmenu',
      (e) => {
        e.preventDefault();
      },
      {},
    ),
  );

  return () => {
    clearTouch();
    unbinds.forEach((unbind) => {
      unbind();
    });
    sit.selected = undefined;
    sit.pos = undefined;
  };
}

function onMove(sit: Situation) {
  return (e: Event) => {
    if (sit.selected === undefined || sit.pos === undefined) return;
    e.preventDefault();
    const pos = eventPosition(e);
    if (pos) {
      const sq = getKeyAtDomPos(
        sit,
        pos,
        sit.elements.board.getBoundingClientRect(),
      );
      const diff = posDiff(sit.pos, pos);
      const minimalMovement = 15;

      if (
        sq !== undefined &&
        sq !== sit.selected &&
        diff.some((d) => d > minimalMovement)
      ) {
        if (canMoveTo(sit, sq)) {
          move(sit, sq);
          sit.selected = sq;
          sit.pos = pos;
          redraw(sit);
          if (sit.config.solution(sit)) sit.config.onVictory(sit);
          sit.config.onMove(sit);
        } else if (
          pieceAtSquare(sit, sit.selected) === pieceAtSquare(sit, sq)
        ) {
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
  target: EventTarget,
  eventName: string,
  callback: EventListener,
  options: AddEventListenerOptions,
): Unbind {
  target.addEventListener(eventName, callback, options);
  return () => target.removeEventListener(eventName, callback, options);
}
