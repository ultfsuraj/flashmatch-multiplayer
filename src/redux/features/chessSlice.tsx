import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const PAWN = 'pawn';
export const ROOK = 'rook';
export const BISHOP = 'bishop';
export const KNIGHT = 'knight';
export const QUEEN = 'queen';
export const KING = 'king';

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

export type point = { x: number; y: number };
export type cellType = { id: number; color: string };
export type pieceType = {
  id: number;
  name: string;
  color: boolean;
  x: number;
  y: number;
  url: string;
  firstMove?: boolean;
};

type gameState = {
  gameInfo: {
    turn: number;
  };
  checked: {
    king: boolean;
    color: boolean;
    attackers: pieceType[];
  };
  cells: Record<number, cellType>;
  pieces: Record<number, pieceType>;
  moves: Record<number, Array<point>>;
};

const initialState: gameState = {
  gameInfo: {
    turn: 1,
  },
  checked: {
    king: false,
    color: false,
    attackers: [],
  },
  cells: generateCells(),
  pieces: generatePieces(),
  moves: generateMoves(),
};

export const chessSlice = createSlice({
  name: 'chess',
  initialState,
  reducers: {
    updatePiece: (
      state,
      action: PayloadAction<Pick<pieceType, 'id' | 'x' | 'y'> & Partial<Omit<pieceType, 'id' | 'x' | 'y'>>>
    ) => {
      const { id, x, y } = action.payload;
      state.pieces[id] = { ...state.pieces[id], ...action.payload };
      // pawn promotion
      if ((state.pieces[id].name == PAWN && y == 1) || y == 8) {
        state.pieces[id].name = QUEEN;
        state.pieces[id].url = state.pieces[id].color ? WHITE_PIECES.queen : BLACK_PIECES.queen;
      }
      // cacelation

      state.moves[id] = [];
      state.gameInfo.turn += 1;
      // check ?
      // checkmate ?
    },
    updateKingCheck: (state, action: PayloadAction<boolean>) => {
      const color = action.payload;
      const attackers = getKingAttackers(Object.values(state.pieces), color);
      state.checked.king = attackers.length > 0;
      state.checked.color = color;
      state.checked.attackers = attackers;
      console.log('checked ' + (color ? 'White' : 'Black'));
      console.log(attackers.map((a) => (color ? 'White ' : 'Black ' + a.name)));
    },
    getMoves: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      let moves: point[] = [];
      const { x, y, color, name } = state.pieces[id];
      if ((state.gameInfo.turn % 2 == 1) != color) return;
      for (let i = 0; i < 32; i++) {
        state.moves[i] = [];
      }
      if (state.checked.attackers.length > 1 && name != KING) return;

      switch (name) {
        case PAWN:
          moves = getPawnMoves(Object.values(state.pieces), color, x, y);
          break;
        case BISHOP:
          moves = getStarMoves(Object.values(state.pieces), color, x, y, [
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
          ]);
          break;
        case ROOK:
          moves = getStarMoves(Object.values(state.pieces), color, x, y, [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
          ]);
          break;
        case QUEEN:
          moves = getStarMoves(Object.values(state.pieces), color, x, y, [
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: -1, y: -1 },
          ]);
          break;
        case KNIGHT:
          moves = getKnightMoves(Object.values(state.pieces), color, x, y);
          break;
        case KING:
          moves = getKingMoves(Object.values(state.pieces), color, x, y);
          break;
      }

      // if >=2 attackers ?? only king can move.... for all others remove their valid moves...
      // if 1 attacker, does moving this kill it, or block the path
      // moving this will put check on king ? change position of piece, check attackers, change back to original

      state.moves[id] = moves;
    },
    resetGame: (state) => {
      state.gameInfo = initialState.gameInfo;
      state.pieces = initialState.pieces;
      state.cells = initialState.cells;
      state.moves = initialState.moves;
    },
  },
});

export const { updatePiece, getMoves, resetGame, updateKingCheck } = chessSlice.actions;
export default chessSlice.reducer;

function generateCells() {
  const cells: Record<number, cellType> = {};
  for (let i = 0; i < 64; i++) {
    cells[i] = { id: i, color: i % 2 ? 'bg-white' : 'bg-black' };
  }
  return cells;
}

function generatePieces() {
  const pieces: Record<number, pieceType> = {};

  const initialChessBoard: pieceType[] = [
    { id: 0, name: ROOK, color: false, x: 1, y: 1, url: BLACK_PIECES.rook },
    { id: 1, name: KNIGHT, color: false, x: 2, y: 1, url: BLACK_PIECES.knight },
    { id: 2, name: BISHOP, color: false, x: 3, y: 1, url: BLACK_PIECES.bishop },
    { id: 3, name: QUEEN, color: false, x: 4, y: 1, url: BLACK_PIECES.queen },
    { id: 4, name: KING, color: false, x: 5, y: 1, url: BLACK_PIECES.king, firstMove: true },
    { id: 5, name: BISHOP, color: false, x: 6, y: 1, url: BLACK_PIECES.bishop },
    { id: 6, name: KNIGHT, color: false, x: 7, y: 1, url: BLACK_PIECES.knight },
    { id: 7, name: ROOK, color: false, x: 8, y: 1, url: BLACK_PIECES.rook },

    { id: 8, name: PAWN, color: false, x: 1, y: 2, url: BLACK_PIECES.pawn },
    { id: 9, name: PAWN, color: false, x: 2, y: 2, url: BLACK_PIECES.pawn },
    { id: 10, name: PAWN, color: false, x: 3, y: 2, url: BLACK_PIECES.pawn },
    { id: 11, name: PAWN, color: false, x: 4, y: 2, url: BLACK_PIECES.pawn },
    { id: 12, name: PAWN, color: false, x: 5, y: 2, url: BLACK_PIECES.pawn },
    { id: 13, name: PAWN, color: false, x: 6, y: 2, url: BLACK_PIECES.pawn },
    { id: 14, name: PAWN, color: false, x: 7, y: 2, url: BLACK_PIECES.pawn },
    { id: 15, name: PAWN, color: false, x: 8, y: 2, url: BLACK_PIECES.pawn },

    { id: 16, name: PAWN, color: true, x: 1, y: 7, url: WHITE_PIECES.pawn },
    { id: 17, name: PAWN, color: true, x: 2, y: 7, url: WHITE_PIECES.pawn },
    { id: 18, name: PAWN, color: true, x: 3, y: 7, url: WHITE_PIECES.pawn },
    { id: 19, name: PAWN, color: true, x: 4, y: 7, url: WHITE_PIECES.pawn },
    { id: 20, name: PAWN, color: true, x: 5, y: 7, url: WHITE_PIECES.pawn },
    { id: 21, name: PAWN, color: true, x: 6, y: 7, url: WHITE_PIECES.pawn },
    { id: 22, name: PAWN, color: true, x: 7, y: 7, url: WHITE_PIECES.pawn },
    { id: 23, name: PAWN, color: true, x: 8, y: 7, url: WHITE_PIECES.pawn },

    { id: 24, name: ROOK, color: true, x: 1, y: 8, url: WHITE_PIECES.rook },
    { id: 25, name: KNIGHT, color: true, x: 2, y: 8, url: WHITE_PIECES.knight },
    { id: 26, name: BISHOP, color: true, x: 3, y: 8, url: WHITE_PIECES.bishop },
    { id: 27, name: QUEEN, color: true, x: 4, y: 8, url: WHITE_PIECES.queen },
    { id: 28, name: KING, color: true, x: 5, y: 8, url: WHITE_PIECES.king, firstMove: true },
    { id: 29, name: BISHOP, color: true, x: 6, y: 8, url: WHITE_PIECES.bishop },
    { id: 30, name: KNIGHT, color: true, x: 7, y: 8, url: WHITE_PIECES.knight },
    { id: 31, name: ROOK, color: true, x: 8, y: 8, url: WHITE_PIECES.rook },
  ];

  initialChessBoard.forEach((piece, index) => {
    pieces[index] = piece;
  });

  return pieces;
}

function generateMoves() {
  const moves: Record<number, Array<point>> = {};
  for (let i = 0; i < 32; i++) {
    moves[i] = [];
  }
  return moves;
}

function getStarPath(x: number, y: number, top: 0 | 1 | -1, right: 0 | 1 | -1): point[] {
  const points: point[] = [];
  let cx = x;
  let cy = y;
  while (true) {
    cx += right;
    cy += top;
    if (cx < 1 || cx > 8 || cy < 1 || cy > 8) break;
    points.push({ x: cx, y: cy });
  }
  return points;
}

function getKnightPath(x: number, y: number): point[] {
  const points: point[] = [
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 },
    { x: x + 1, y: y + 2 },
    { x: x - 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
    { x: x - 1, y: y - 2 },
  ];
  return points.filter(({ x, y }) => !(x > 8 || y > 8 || x < 1 || y < 1));
}

function getDiagonalAttackers(kingX: number, kingY: number, kingColor: boolean, pieces: pieceType[]): pieceType[] {
  const attackers: pieceType[] = [];
  [
    getStarPath(kingX, kingY, 1, 1),
    getStarPath(kingX, kingY, 1, -1),
    getStarPath(kingX, kingY, -1, 1),
    getStarPath(kingX, kingY, -1, -1),
  ].forEach((diagonals) => {
    for (const { x, y } of diagonals) {
      for (const attacker of pieces) {
        if (attacker.x == x && attacker.y == y) {
          if (attacker.color != kingColor && (attacker.name == QUEEN || attacker.name == BISHOP)) {
            attackers.push(attacker);
          }
          return;
        }
      }
    }
  });
  return attackers;
}

function getStraightAttackers(kingX: number, kingY: number, kingColor: boolean, pieces: pieceType[]): pieceType[] {
  const attackers: pieceType[] = [];
  [
    getStarPath(kingX, kingY, 0, 1),
    getStarPath(kingX, kingY, 0, -1),
    getStarPath(kingX, kingY, 1, 0),
    getStarPath(kingX, kingY, -1, 0),
  ].forEach((diagonals) => {
    for (const { x, y } of diagonals) {
      for (const attacker of pieces) {
        if (attacker.x == x && attacker.y == y) {
          if (attacker.color != kingColor && (attacker.name == QUEEN || attacker.name == ROOK)) {
            attackers.push(attacker);
          }
          return;
        }
      }
    }
  });
  return attackers;
}

function getKnightAttackers(kingX: number, kingY: number, kingColor: boolean, pieces: pieceType[]): pieceType[] {
  const attackers: pieceType[] = [];
  getKnightPath(kingX, kingY).forEach(({ x, y }) => {
    for (const attacker of pieces) {
      if (attacker.x == x && attacker.y == y) {
        if (attacker.color != kingColor && attacker.name == KNIGHT) {
          attackers.push(attacker);
        }
      }
    }
  });

  return attackers;
}

function getKingAttackers(pieces: pieceType[], kingColor: boolean): pieceType[] {
  const attackers: pieceType[] = [];
  let kingX = 0;
  let kingY = 0;
  Object.values(pieces).forEach(({ x, y, color, name }) => {
    if (kingColor == color && name == KING) {
      kingX = x;
      kingY = y;
    }
  });
  attackers.concat(getDiagonalAttackers(kingX, kingY, kingColor, pieces));
  attackers.concat(getStraightAttackers(kingX, kingY, kingColor, pieces));
  attackers.concat(getKnightAttackers(kingX, kingY, kingColor, pieces));
  return attackers;
}

function getPawnMoves(pieces: pieceType[], color: boolean, x: number, y: number): point[] {
  let points: point[] = [];

  for (let i = -1; i < 2; i++) {
    points.push({ x: x + i, y: y + (color ? -1 : 1) });
    if (i == 0 && (y == 2 || y == 7)) {
      points.push({ x: x, y: y + (color ? -2 : 2) });
    }
  }
  let firstObstacle = false;
  points = points.filter((point) => {
    const r = point.y,
      c = point.x;
    if (c > 8 || r > 8 || c < 1 || r < 1) return false;
    // check corners
    if (Math.abs(c - x) == 1) {
      let kill = false;
      pieces.forEach((piece) => {
        if (piece.x == c && piece.y == r && piece.color != color) {
          kill = true;
        }
      });
      return kill;
    }
    // check front
    if (Math.abs(r - y) == 1) {
      pieces.forEach((piece) => {
        if (piece.x == c && piece.y == r) {
          firstObstacle = true;
        }
      });
      return !firstObstacle;
    }
    if (Math.abs(r - y) == 2) {
      if (firstObstacle) return false;
      let secondObstacle = false;
      pieces.forEach((piece) => {
        if (piece.x == c && piece.y == r) {
          secondObstacle = true;
        }
      });
      return !secondObstacle;
    }
    return true;
  });

  return points;
}

function getKnightMoves(pieces: pieceType[], color: boolean, x: number, y: number): point[] {
  let points: point[] = getKnightPath(x, y);
  points = points.filter((point) => {
    const r = point.x,
      c = point.y;
    if (c > 8 || r > 8 || c < 1 || r < 1) return false;
    let obstacle = false;
    pieces.forEach((piece) => {
      if (piece.x == r && piece.y == c && piece.color == color) {
        obstacle = true;
      }
    });
    return !obstacle;
  });

  return points;
}

function getStarMoves(
  pieces: pieceType[],
  color: boolean,
  x: number,
  y: number,
  directions: { x: -1 | 0 | 1; y: -1 | 0 | 1 }[]
): point[] {
  const diagonals: Array<point[]> = [];
  directions.forEach((d) => {
    diagonals.push(getStarPath(x, y, d.x, d.y));
  });

  const points: point[] = [];

  diagonals.forEach((diagonal) => {
    for (const point of diagonal) {
      const r = point.x,
        c = point.y;
      if (c > 8 || r > 8 || c < 1 || r < 1) continue;
      let obstacle = false;
      for (const piece of pieces) {
        if (piece.x == r && piece.y == c) {
          obstacle = true;
          if (piece.color != color) {
            points.push({ x: r, y: c });
          }
          break;
        }
      }
      if (obstacle) break;
      points.push({ x: r, y: c });
    }
  });

  return points;
}

function getKingMoves(pieces: pieceType[], color: boolean, x: number, y: number): point[] {
  let points: point[] = [
    { x: x, y: y - 1 },
    { x: x, y: y + 1 },
    { x: x + 1, y: y },
    { x: x + 1, y: y - 1 },
    { x: x + 1, y: y + 1 },
    { x: x - 1, y: y },
    { x: x - 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
  ];

  points = points.filter((point) => {
    const r = point.x,
      c = point.y;
    if (c > 8 || r > 8 || c < 1 || r < 1) return false;
    let obstacle = false;
    pieces.forEach((piece) => {
      if (piece.x == r && piece.y == c && piece.color == color) {
        obstacle = true;
      }
    });
    return !obstacle;
  });

  return points;
}
