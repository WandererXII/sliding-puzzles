# Sliding puzzles

[![npm](https://img.shields.io/npm/v/@liskadan/sliding-puzzles)](https://www.npmjs.com/package/@liskadan/sliding-puzzles)

A simple flexible UI for sliding puzzles.

![Hakoiri musume](/assets/images/preview.png)

Demo on lishogi 404 pages: https://lishogi.org/i/do/not/exist

## How to use

`npm install @liskadan/sliding-puzzles`

Either include the script in your HTML header:

`<script src="dist/iife/sliding-puzzles.js"></script>`

Or import it if you are using modules:

`import { SlidingPuzzles } from '@liskadan/sliding-puzzles';`

You will also want to include the css probably, but you might want to copy that asset and make your own changes:
`<link rel="stylesheet" href="assets/css/hakoirimusume.css" />`

Puzzle setup for the example above is a string like this:

```
G1 K K G2
G1 K K G2
B  S S R
B  N L R
P1 . . P2
```

Separate all pieces and empty squares with a space
Each row ends with a newline or a '/'

Same as above: `G1 K K G2/G1 K K G2/B S S R/B N L R/ P1 . . P2`

We start at top left corner, we say what piece is at each square
The name needs to be UNIQUE, dot represents empty square

All pieces must be rectangular no L or T shapes

The name will be used as class for styling.

To initiate the actual puzzle you do this:

```typescript
const api = SlidingPuzzles(
  document.getElementById('game'),
  'G1 K K G2/G1 K K G2/B S S R/B N L R/ P1 . . P2',
  config,
);
```

`config` object looks like this:

```typescript
interface Configuration {
  solution: (sit: Situation) => boolean; // checks after every move if solution was reached
  onMove: (sit: Situation) => void; // called after each move
  specialEffect: (p: Piece, h: HTMLElement) => void; // called for each piece during rendering, you can highlight a piece when correctly placed for example
  onVictory: (sit: Situation) => void; // called after solution was reached
  movable?: boolean;
  showDests?: boolean;
}
```

Returned `api` object is just situation:

```typescript
interface Api {
  situation: Situation;
}
interface Situation {
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
```
