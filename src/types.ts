export type Square = number;

export interface Piece {
  name: string; // will be used as class for styling
  position: Square; // left top corner
  width: number;
  height: number;
}

export type Pieces = Piece[];

export interface Elements {
  main: HTMLElement;
  board: HTMLElement;
}

export type Setup = string;

export type Unbind = () => void;
