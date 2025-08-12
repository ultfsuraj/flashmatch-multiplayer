import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type cellType = { id: number; flip: number; count: number; frontColor: string; backColor: string };

type gameState = {
  gameInfo: {
    rows: number;
    turn: number;
    neutralColor: string;
    color1: string;
    color2: string;
  };
  regions: {
    one: number;
    two: number;
  };
  cells: Record<number, cellType>;
};

const initializeCells = (n: number, neutral: string) => {
  const arr: Record<number, cellType> = {};
  for (let i = 0; i < n * n; i++) {
    arr[i] = { id: i, flip: 0, count: 0, frontColor: neutral, backColor: neutral };
  }
  return arr;
};

const initialState: gameState = {
  gameInfo: {
    rows: 7,
    turn: 1,
    neutralColor: 'bg-neutral-200',
    color1: 'bg-cyan-300',
    color2: 'bg-red-400',
  },
  regions: {
    one: 0,
    two: 0,
  },
  cells: initializeCells(7, 'bg-neutral-200'),
};

export const gameSlice = createSlice({
  name: 'colorWars',
  initialState,
  reducers: {
    increaseTurn: (state, action: PayloadAction<number>) => {
      const prev = { ...state.cells[action.payload] };
      const { turn, color1, color2, neutralColor } = state.gameInfo;
      switch (turn) {
        case 1:
          prev.frontColor = color1;
          state.regions.one += 1;
          break;
        case 2:
          if (prev.frontColor == color1) return;
          prev.frontColor = color2;
          state.regions.two += 1;
          break;
        default:
          if (prev.frontColor == neutralColor) return;
          if (turn % 2 == 1 && prev.frontColor != color1) return;
          if (turn % 2 == 0 && prev.frontColor != color2) return;
      }
      prev.count += 1;
      state.cells[prev.id] = prev;
      state.gameInfo.turn += 1;
    },
    spread: (state, action: PayloadAction<number>) => {
      // check if all coloured cells are same color... return
      if (state.regions.one <= 0 || state.regions.two <= 0) return;

      const [n, id] = [state.gameInfo.rows, action.payload];
      const [r, c] = [Math.floor(id / n), id % n];
      const srcColor = state.cells[id].frontColor;
      const { color1, color2, neutralColor } = state.gameInfo;
      const nextCells: number[] = [];
      if (c != 0) nextCells.push(id - 1);
      if (c != n - 1) nextCells.push(id + 1);
      if (r != 0) nextCells.push(n * (r - 1) + c);
      if (r != n - 1) nextCells.push(n * (r + 1) + c);

      nextCells.forEach((adjId) => {
        const next = { ...state.cells[adjId] };
        next.count += 1;
        if (next.frontColor != srcColor) {
          next.flip += 180;
          switch (next.frontColor) {
            case color1:
              state.regions.one -= 1;
              state.regions.two += 1;
              break;
            case color2:
              state.regions.two -= 1;
              state.regions.one += 1;
              break;
            case neutralColor:
              if (srcColor == color1) state.regions.one += 1;
              else state.regions.two += 1;
          }
        }
        next.frontColor = srcColor;
        state.cells[adjId] = next;
      });

      if (srcColor == color1) {
        state.regions.one -= 1;
      } else {
        state.regions.two -= 1;
      }

      state.cells[id] = {
        id,
        count: 0,
        flip: state.cells[id].flip + 180,
        frontColor: neutralColor,
        backColor: neutralColor,
      };

      console.log(state.regions.one, state.regions.two);

      if (state.regions.one <= 0) {
        console.log('red won');
      }
      if (state.regions.two <= 0) {
        console.log('blue won');
      }
    },
    updateOne: (state, action: PayloadAction<Pick<cellType, 'id'> & Partial<Omit<cellType, 'id'>>>) => {
      state.cells[action.payload.id] = { ...state.cells[action.payload.id], ...action.payload };
    },
    resetGame: (state) => {
      state.cells = initialState.cells;
      state.gameInfo = initialState.gameInfo;
    },
  },
});

export const { increaseTurn, spread, updateOne, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
