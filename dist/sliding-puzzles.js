var SlidingPuzzles = function () {
  'use strict';

  function init(situation) {
    return {
      situation
    };
  }
  function defaultConfig() {
    return {
      solution: () => false,
      onMove: () => {},
      specialEffect: () => {},
      onVictory: () => {},
      movable: true,
      showDests: false
    };
  }
  function diff(a, b) {
    return Math.abs(a - b);
  }
  function manhattanDist(sq1, sq2, width) {
    return diff(squareX(sq1, width), squareX(sq2, width)) + diff(squareY(sq1, width), squareY(sq2, width));
  }
  function squareY(sq, width) {
    return Math.floor(sq / width);
  }
  function squareX(sq, width) {
    return sq % width;
  }
  function toSquare(x, y, width) {
    return y * width + x;
  }
  // returns top, right, down, left neighbor
  function findNeighbors(sq, width, height) {
    return [sq + width, sq - width, sq + 1, sq - 1].filter(s => s >= 0 && s <= width * height && diff(squareX(sq, width), squareX(s, width)) <= 1 && diff(squareY(sq, width), squareY(s, width)) <= 1);
  }
  function getKeyAtDomPos(sit, pos, bounds) {
    const x = Math.floor(sit.width * (pos[0] - bounds.left) / bounds.width);
    const y = Math.floor(sit.height * (pos[1] - bounds.top) / bounds.height);
    return x >= 0 && x < sit.width && y >= 0 && y < sit.height ? toSquare(x, y, sit.width) : undefined;
  }
  function pieceAtSquare(sit, sq) {
    const x = squareX(sq, sit.width);
    const y = squareY(sq, sit.width);
    for (const p of sit.pieces) {
      if (squareX(p.position, sit.width) <= x && squareX(p.position, sit.width) + p.width > x && squareY(p.position, sit.width) <= y && squareY(p.position, sit.width) + p.height > y) return p;
    }
    return undefined;
  }
  function squareArea(sit, position, width, height) {
    const sqs = [];
    for (let x = squareX(position, sit.width); x < squareX(position, sit.width) + width; x++) {
      for (let y = squareY(position, sit.width); y < squareY(position, sit.width) + height; y++) {
        sqs.push(toSquare(x, y, sit.width));
      }
    }
    return sqs;
  }
  function findAllMoves(sit, piece) {
    if (!piece) return [];
    const curPieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
    const sitNormalized = JSON.parse(JSON.stringify(sit));
    sitNormalized.config = sit.config;
    sitNormalized.selected = piece.position;
    function innerFind(sit, piece, checked) {
      if (!piece) return [];
      const neighbors = [];
      const pieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
      const res = pieceSquares;
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
    return [...new Set(innerFind(sitNormalized, piece, []).filter(sq => !curPieceSquares.includes(sq)))];
  }
  function canMoveTo(sit, to) {
    if (sit.selected === undefined || sit.selected === to || sit.config.solution(sit) || sit.config.movable === false) return false;
    const selectedPiece = pieceAtSquare(sit, sit.selected);
    if (!selectedPiece) return false;
    const diff = sit.selected - to;
    const piecePosToBe = selectedPiece.position - diff;
    const pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
    const afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);
    if (pieceSquares.some(sq => findNeighbors(sq, sit.width, sit.height).includes(to)) && afterPieceSquares.every(sq => sq >= 0 && sq < sit.width * sit.height) && !afterPieceSquares.some(sq => sit.occupied.includes(sq) && !pieceSquares.includes(sq))) return true;
    return false;
  }
  function move(sit, to) {
    if (sit.selected === undefined) return;
    const selectedPiece = pieceAtSquare(sit, sit.selected);
    if (!selectedPiece) return;
    const piecePosToBe = selectedPiece.position - (sit.selected - to);
    const pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
    const afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);
    sit.occupied = sit.occupied.filter(sq => !pieceSquares.includes(sq));
    sit.occupied.push(...afterPieceSquares);
    sit.moves += manhattanDist(selectedPiece.position, piecePosToBe, sit.width);
    selectedPiece.position = piecePosToBe;
  }
  function wrap(el) {
    el.innerHTML = '';
    const main = document.createElement('sp-main');
    const board = document.createElement('sp-board');
    const els = {
      main: main,
      board: board
    };
    main.appendChild(board);
    el.appendChild(main);
    return els;
  }
  function redraw(sit) {
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
      piece.style.width = `${100 / sit.width * p.width}%`;
      piece.style.height = `${100 / sit.height * p.height}%`;
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
  const eventPosition = e => {
    var _a;
    if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
    if ((_a = e.targetTouches) === null || _a === void 0 ? void 0 : _a[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return;
  };
  function posDiff(a, b) {
    return [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])];
  }
  function events(sit) {
    for (const ev of ['touchstart', 'mousedown']) {
      sit.elements.main.addEventListener(ev, e => {
        // from chessground
        if (!e.isTrusted || e.button !== undefined && e.button !== 0) return; // only touch or left click
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
      }, {
        passive: false
      });
    }
    onMove(document, sit, 'mousemove');
    onEnd(document, sit, 'mouseup');
    sit.elements.main.addEventListener('contextmenu', e => {
      e.preventDefault();
    });
  }
  function onMove(el, sit, ev) {
    el.addEventListener(ev, e => {
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
    }, {
      once: false
    });
  }
  function onEnd(el, sit, ev) {
    el.addEventListener(ev, () => {
      sit.selected = undefined;
      sit.pos = undefined;
      redraw(sit);
    }, {
      once: false
    });
  }
  function createSituation(board, els, config) {
    const rows = board.replace(/\n/g, '/').split('/').map(r => r.replace(/\s\s+/g, ' ').trimEnd().trimStart());
    const width = rows[0].split(' ').length;
    const height = rows.length;
    const pieces = [];
    const boardMap = new Map();
    let curSq = 0;
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
    const checkedSquares = new Set();
    function finishPiece(sq) {
      const pieceSquares = [sq];
      for (const n of [sq + width, sq + 1].filter(s => s <= width * height && diff(squareX(sq, width), squareX(s, width)) <= 1 && diff(squareY(sq, width), squareY(s, width)) <= 1)) {
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
          height: diff(squareY(kv[0], width), squareY(Math.max(...occupiedSquares), width)) + 1
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
      config: config
    };
  }
  function SlidingPuzzles(el, setup, config) {
    const els = wrap(el);
    const sit = createSituation(setup, els, Object.assign({}, defaultConfig(), config));
    redraw(sit);
    events(sit);
    return init(sit);
  }
  return SlidingPuzzles;
}();
