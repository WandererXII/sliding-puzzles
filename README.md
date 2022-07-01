# Sliding puzzle

A simple flexible UI for sliding puzzles.

In use on 404 pages on lishogi: https://lishogi.org/i/do/not/exist

![Hakoiri musume](/assets/preview.png)

## How to use

Simply include the script and css files in your document.

```html
<link rel="stylesheet" href="assets/css/hakoirimusume.css" />
<script src="dist/sliding-puzzles.js"></script>
```

Then initiate `SlidingPuzzles`:

```javascript
  ...
  // Think of setup as a map, works similarly to chess FEN notation.
  // Each piece has to have unique name,
  // same names mean it's the same piece occupying multiple squares.
  // '.' means empty square, '/' starts a new line.
  const setup = 'G1 K K G2/G1 K K G2/B S S R/B N L R/ P1 . . P2';

  // https://github.com/WandererXII/sliding-puzzles/blob/main/src/configuration.ts
  const cfg = {
    solution: sol,
    onVictory: win,
    onMove: move,
  };

  SlidingPuzzles(document.getElementById('game'), setup, cgf);
  ...

```

You can define your own conditions for victory, set callbacks after solving or after moving.

For a specific example look here: https://github.com/WandererXII/sliding-puzzles/blob/main/index.html
