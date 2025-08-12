import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const PAWN = 'pawn';
const ROOK = 'rook';
const BISHOP = 'bishop';
const KNIGHT = 'knight';
const QUEEN = 'queen';
const KING = 'king';

const BLACK_PIECES: Record<string, string> = {
  pawn: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  rook: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  bishop: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  knight: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  queen: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  king: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};
const WHITE_PIECES: Record<string, string> = {
  pawn: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  rook: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  bishop: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  knight: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  queen: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  king: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
};

export type cellType = { id: number; color: string };
export type pieceType = { id: number; name: string; color: boolean; x: number; y: number; url: string };

type gameState = {
  gameInfo: {
    turn: number;
  };
  cells: Record<number, cellType>;
  pieces: Record<number, pieceType>;
  pieceIDs: number[];
};

const generateCells = () => {
  const cells: Record<number, cellType> = {};
  for (let i = 0; i < 64; i++) {
    cells[i] = { id: i, color: i % 2 ? 'bg-white' : 'bg-black' };
  }
  return cells;
};

const generatePieces = () => {
  const pieces: Record<number, pieceType> = {};

  const initialChessBoard: pieceType[] = [
    { id: 0, name: 'rook', color: false, x: 1, y: 1, url: BLACK_PIECES.rook },
    { id: 1, name: 'knight', color: false, x: 2, y: 1, url: BLACK_PIECES.knight },
    { id: 2, name: 'bishop', color: false, x: 3, y: 1, url: BLACK_PIECES.bishop },
    { id: 3, name: 'queen', color: false, x: 4, y: 1, url: BLACK_PIECES.queen },
    { id: 4, name: 'king', color: false, x: 5, y: 1, url: BLACK_PIECES.king },
    { id: 5, name: 'bishop', color: false, x: 6, y: 1, url: BLACK_PIECES.bishop },
    { id: 6, name: 'knight', color: false, x: 7, y: 1, url: BLACK_PIECES.knight },
    { id: 7, name: 'rook', color: false, x: 8, y: 1, url: BLACK_PIECES.rook },

    { id: 8, name: 'pawn', color: false, x: 1, y: 2, url: BLACK_PIECES.pawn },
    { id: 9, name: 'pawn', color: false, x: 2, y: 2, url: BLACK_PIECES.pawn },
    { id: 10, name: 'pawn', color: false, x: 3, y: 2, url: BLACK_PIECES.pawn },
    { id: 11, name: 'pawn', color: false, x: 4, y: 2, url: BLACK_PIECES.pawn },
    { id: 12, name: 'pawn', color: false, x: 5, y: 2, url: BLACK_PIECES.pawn },
    { id: 13, name: 'pawn', color: false, x: 6, y: 2, url: BLACK_PIECES.pawn },
    { id: 14, name: 'pawn', color: false, x: 7, y: 2, url: BLACK_PIECES.pawn },
    { id: 15, name: 'pawn', color: false, x: 8, y: 2, url: BLACK_PIECES.pawn },

    { id: 16, name: 'pawn', color: true, x: 1, y: 7, url: WHITE_PIECES.pawn },
    { id: 17, name: 'pawn', color: true, x: 2, y: 7, url: WHITE_PIECES.pawn },
    { id: 18, name: 'pawn', color: true, x: 3, y: 7, url: WHITE_PIECES.pawn },
    { id: 19, name: 'pawn', color: true, x: 4, y: 7, url: WHITE_PIECES.pawn },
    { id: 20, name: 'pawn', color: true, x: 5, y: 7, url: WHITE_PIECES.pawn },
    { id: 21, name: 'pawn', color: true, x: 6, y: 7, url: WHITE_PIECES.pawn },
    { id: 22, name: 'pawn', color: true, x: 7, y: 7, url: WHITE_PIECES.pawn },
    { id: 23, name: 'pawn', color: true, x: 8, y: 7, url: WHITE_PIECES.pawn },

    { id: 24, name: 'rook', color: true, x: 1, y: 8, url: WHITE_PIECES.rook },
    { id: 25, name: 'knight', color: true, x: 2, y: 8, url: WHITE_PIECES.knight },
    { id: 26, name: 'bishop', color: true, x: 3, y: 8, url: WHITE_PIECES.bishop },
    { id: 27, name: 'queen', color: true, x: 4, y: 8, url: WHITE_PIECES.queen },
    { id: 28, name: 'king', color: true, x: 5, y: 8, url: WHITE_PIECES.king },
    { id: 29, name: 'bishop', color: true, x: 6, y: 8, url: WHITE_PIECES.bishop },
    { id: 30, name: 'knight', color: true, x: 7, y: 8, url: WHITE_PIECES.knight },
    { id: 31, name: 'rook', color: true, x: 8, y: 8, url: WHITE_PIECES.rook },
  ];

  initialChessBoard.forEach((piece, index) => {
    pieces[index] = piece;
  });

  return pieces;
};

const getPieceIDs = () => {
  const arr: number[] = Array.from({ length: 32 }, (_, index) => index);
  return arr;
};
const initialState: gameState = {
  gameInfo: {
    turn: 1,
  },
  cells: generateCells(),
  pieces: generatePieces(),
  pieceIDs: getPieceIDs(),
};

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {},
});

export const {} = chessSlice.actions;
export default chessSlice.reducer;
