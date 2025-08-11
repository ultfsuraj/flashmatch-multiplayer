import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type cellType = { id: number; flip: boolean; count: number; frontColor: string; backColor: string };

type gameState = {
  rows: number;
  turn: number;
  neutralColor: string;
  color1: string;
  color2: string;
  cells: Array<cellType>;
};

const initializeCells = (n: number, neutral: string): cellType[] => {
  const arr: cellType[] = new Array(n * n);
  for (let i = 0; i < n * n; i++) {
    arr[i] = { id: i, flip: false, count: 0, frontColor: neutral, backColor: neutral };
  }
  return arr;
};

const initialState: gameState = {
  rows: 7,
  turn: 1,
  neutralColor: 'bg-neutral-200',
  color1: 'bg-cyan-300',
  color2: 'bg-red-400',
  cells: initializeCells(7, 'bg-neutral-200'),
};

export const gameSlice = createSlice({
  name: 'colorWars',
  initialState,
  reducers: {
    increaseTurn: (state, action: PayloadAction<number>) => {
      console.log('turn ' + state.turn);
      state.turn += 1;
      state.cells[action.payload].count += 1;
    },
    spread: (state, action: PayloadAction<number>) => {
      const [n, id] = [state.rows, action.payload];
      const [r, c] = [Math.floor(id / n), id % n];
      const nextCells: number[] = [];
      if (c != 0) nextCells.push(id - 1);
      if (c != n - 1) nextCells.push(id + 1);
      if (r != 0) nextCells.push(n * (r - 1) + c);
      if (r != n - 1) nextCells.push(n * (r + 1) + c);

      nextCells.forEach((adjId) => {
        const prev = state.cells[adjId];
        state.cells[adjId] = { ...prev, count: prev.count + 1, flip: true };
      });

      state.cells[id] = { id, count: 0, flip: true, backColor: state.neutralColor, frontColor: state.neutralColor };
    },
  },
});

export const { increaseTurn, spread } = gameSlice.actions;
export default gameSlice.reducer;
