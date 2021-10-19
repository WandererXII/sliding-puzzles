function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var SlidingPuzzles = function () {
  'use strict';

  function init(situation) {
    return {
      situation: situation
    };
  }

  function defaultConfig() {
    return {
      solution: function solution() {
        return false;
      },
      onMove: function onMove() {},
      specialEffect: function specialEffect() {},
      onVictory: function onVictory() {},
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
  } // returns top, right, down, left neighbor


  function findNeighbors(sq, width, height) {
    return [sq + width, sq - width, sq + 1, sq - 1].filter(function (s) {
      return s >= 0 && s <= width * height && diff(squareX(sq, width), squareX(s, width)) <= 1 && diff(squareY(sq, width), squareY(s, width)) <= 1;
    });
  }

  function getKeyAtDomPos(sit, pos, bounds) {
    var x = Math.floor(sit.width * (pos[0] - bounds.left) / bounds.width);
    var y = Math.floor(sit.height * (pos[1] - bounds.top) / bounds.height);
    return x >= 0 && x < sit.width && y >= 0 && y < sit.height ? toSquare(x, y, sit.width) : undefined;
  }

  function pieceAtSquare(sit, sq) {
    var x = squareX(sq, sit.width);
    var y = squareY(sq, sit.width);

    var _iterator = _createForOfIteratorHelper(sit.pieces),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;
        if (squareX(p.position, sit.width) <= x && squareX(p.position, sit.width) + p.width > x && squareY(p.position, sit.width) <= y && squareY(p.position, sit.width) + p.height > y) return p;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return undefined;
  }

  function squareArea(sit, position, width, height) {
    var sqs = [];

    for (var x = squareX(position, sit.width); x < squareX(position, sit.width) + width; x++) {
      for (var y = squareY(position, sit.width); y < squareY(position, sit.width) + height; y++) {
        sqs.push(toSquare(x, y, sit.width));
      }
    }

    return sqs;
  }

  function findAllMoves(sit, piece) {
    if (!piece) return [];
    var curPieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
    var sitNormalized = JSON.parse(JSON.stringify(sit));
    sitNormalized.config = sit.config;
    sitNormalized.selected = piece.position;

    function innerFind(sit, piece, checked) {
      if (!piece) return [];
      var neighbors = [];
      var pieceSquares = squareArea(sit, piece.position, piece.width, piece.height);
      var res = pieceSquares;

      var _iterator2 = _createForOfIteratorHelper(pieceSquares),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var p = _step2.value;
          neighbors.push.apply(neighbors, _toConsumableArray(findNeighbors(p, sit.width, sit.height)));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      checked.push(piece.position);

      for (var _i = 0, _neighbors = neighbors; _i < _neighbors.length; _i++) {
        var n = _neighbors[_i];

        if (!checked.includes(n)) {
          if (canMoveTo(sit, n)) {
            var sitCopy = JSON.parse(JSON.stringify(sit));
            sitCopy.config = sit.config;
            move(sitCopy, n);
            sitCopy.selected = n;
            res.push.apply(res, _toConsumableArray(innerFind(sitCopy, pieceAtSquare(sitCopy, sitCopy.selected), checked)));
          }
        }
      }

      return res;
    }

    return _toConsumableArray(new Set(innerFind(sitNormalized, piece, []).filter(function (sq) {
      return !curPieceSquares.includes(sq);
    })));
  }

  function canMoveTo(sit, to) {
    if (sit.selected === undefined || sit.selected === to || sit.config.solution(sit) || sit.config.movable === false) return false;
    var selectedPiece = pieceAtSquare(sit, sit.selected);
    if (!selectedPiece) return false;
    var diff = sit.selected - to;
    var piecePosToBe = selectedPiece.position - diff;
    var pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
    var afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);
    if (pieceSquares.some(function (sq) {
      return findNeighbors(sq, sit.width, sit.height).includes(to);
    }) && afterPieceSquares.every(function (sq) {
      return sq >= 0 && sq < sit.width * sit.height;
    }) && !afterPieceSquares.some(function (sq) {
      return sit.occupied.includes(sq) && !pieceSquares.includes(sq);
    })) return true;
    return false;
  }

  function move(sit, to) {
    var _sit$occupied;

    if (sit.selected === undefined) return;
    var selectedPiece = pieceAtSquare(sit, sit.selected);
    if (!selectedPiece) return;
    var piecePosToBe = selectedPiece.position - (sit.selected - to);
    var pieceSquares = squareArea(sit, selectedPiece.position, selectedPiece.width, selectedPiece.height);
    var afterPieceSquares = squareArea(sit, piecePosToBe, selectedPiece.width, selectedPiece.height);
    sit.occupied = sit.occupied.filter(function (sq) {
      return !pieceSquares.includes(sq);
    });

    (_sit$occupied = sit.occupied).push.apply(_sit$occupied, _toConsumableArray(afterPieceSquares));

    sit.moves += manhattanDist(selectedPiece.position, piecePosToBe, sit.width);
    selectedPiece.position = piecePosToBe;
  }

  function wrap(el) {
    el.innerHTML = '';
    var main = document.createElement('sp-main');
    var board = document.createElement('sp-board');
    var els = {
      main: main,
      board: board
    };
    main.appendChild(board);
    el.appendChild(main);
    return els;
  }

  function redraw(sit) {
    sit.elements.board.innerHTML = '';

    var _iterator3 = _createForOfIteratorHelper(sit.pieces),
        _step3;

    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var p = _step3.value;
        var piece = document.createElement('sp-piece');
        piece.classList.add(p.name);

        if (sit.selected !== undefined && squareArea(sit, p.position, p.width, p.height).includes(sit.selected)) {
          piece.classList.add('selected');
        }

        piece.style.transform = "translate(\n            ".concat(squareX(p.position, sit.width) * (100 / p.width), "%,").concat(squareY(p.position, sit.width) * (100 / p.height), "%\n        )");
        piece.style.width = "".concat(100 / sit.width * p.width, "%");
        piece.style.height = "".concat(100 / sit.height * p.height, "%");
        sit.config.specialEffect(p, piece);
        sit.elements.board.appendChild(piece);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }

    if (sit.selected !== undefined && sit.config.showDests) {
      var allDest = findAllMoves(sit, pieceAtSquare(sit, sit.selected));

      var _iterator4 = _createForOfIteratorHelper(allDest),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var d = _step4.value;
          var squareDest = document.createElement('sp-dest');
          squareDest.style.transform = "translate(\n            ".concat(squareX(d, sit.width) * 100, "%,").concat(squareY(d, sit.width) * 100, "%\n        )");
          squareDest.style.width = "".concat(100 / sit.width, "%");
          squareDest.style.height = "".concat(100 / sit.height, "%");
          sit.elements.board.appendChild(squareDest);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }

  var eventPosition = function eventPosition(e) {
    var _a;

    if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY];
    if ((_a = e.targetTouches) === null || _a === void 0 ? void 0 : _a[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
    return;
  };

  function posDiff(a, b) {
    return [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])];
  }

  function events(sit) {
    var _loop = function _loop() {
      var ev = _arr[_i2];
      sit.elements.main.addEventListener(ev, function (e) {
        // from chessground
        if (!e.isTrusted || e.button !== undefined && e.button !== 0) return; // only touch or left click

        if (e.touches && e.touches.length > 1) return; // support one finger touch only

        e.preventDefault(); // touchmove/touchend needs to bind to e.target

        if (ev === 'touchstart' && e.target) {
          onMove(e.target, sit, 'touchmove');
          onEnd(e.target, sit, 'touchend');
        }

        var pos = eventPosition(e);

        if (pos) {
          var sq = getKeyAtDomPos(sit, pos, sit.elements.board.getBoundingClientRect());
          sit.selected = sq;
          sit.pos = pos;
          redraw(sit);
        }
      }, {
        passive: false
      });
    };

    for (var _i2 = 0, _arr = ['touchstart', 'mousedown']; _i2 < _arr.length; _i2++) {
      _loop();
    }

    onMove(document, sit, 'mousemove');
    onEnd(document, sit, 'mouseup');
    sit.elements.main.addEventListener('contextmenu', function (e) {
      e.preventDefault();
    });
  }

  function onMove(el, sit, ev) {
    el.addEventListener(ev, function (e) {
      if (sit.selected === undefined || sit.pos === undefined) return;
      e.preventDefault();
      var pos = eventPosition(e);

      if (pos) {
        var sq = getKeyAtDomPos(sit, pos, sit.elements.board.getBoundingClientRect());

        var _diff = posDiff(sit.pos, pos);

        if (sq !== undefined && sq !== sit.selected && (_diff[0] > 15 || _diff[1] > 15)) {
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
    el.addEventListener(ev, function () {
      sit.selected = undefined;
      sit.pos = undefined;
      redraw(sit);
    }, {
      once: false
    });
  }

  function createSituation(board, els, config) {
    var rows = board.replace(/\n/g, '/').split('/').map(function (r) {
      return r.replace(/\s\s+/g, ' ').trimEnd().trimStart();
    });
    var width = rows[0].split(' ').length;
    var height = rows.length;
    var pieces = [];
    var boardMap = new Map();
    var curSq = 0;

    var _iterator5 = _createForOfIteratorHelper(rows),
        _step5;

    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var r = _step5.value;

        var _iterator8 = _createForOfIteratorHelper(r.split(' ')),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var p = _step8.value;

            if (p == '.') {
              curSq += 1;
            } else {
              boardMap.set(curSq, p);
              curSq++;
            }
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }

    var checkedSquares = new Set();

    function finishPiece(sq) {
      var pieceSquares = [sq];

      var _iterator6 = _createForOfIteratorHelper([sq + width, sq + 1].filter(function (s) {
        return s <= width * height && diff(squareX(sq, width), squareX(s, width)) <= 1 && diff(squareY(sq, width), squareY(s, width)) <= 1;
      })),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var n = _step6.value;

          if (!checkedSquares.has(n) && boardMap.get(n) === boardMap.get(sq)) {
            checkedSquares.add(n);
            pieceSquares.push.apply(pieceSquares, _toConsumableArray(finishPiece(n)));
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return pieceSquares;
    }

    var _iterator7 = _createForOfIteratorHelper(boardMap),
        _step7;

    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var kv = _step7.value;

        if (!checkedSquares.has(kv[0])) {
          var occupiedSquares = finishPiece(kv[0]);
          pieces.push({
            name: kv[1],
            position: kv[0],
            width: diff(squareX(kv[0], width), squareX(Math.max.apply(Math, _toConsumableArray(occupiedSquares)), width)) + 1,
            height: diff(squareY(kv[0], width), squareY(Math.max.apply(Math, _toConsumableArray(occupiedSquares)), width)) + 1
          });
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
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
    var els = wrap(el);
    var sit = createSituation(setup, els, Object.assign({}, defaultConfig(), config));
    redraw(sit);
    events(sit);
    return init(sit);
  }

  return SlidingPuzzles;
}();
