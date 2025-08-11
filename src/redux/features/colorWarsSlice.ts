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
      state.turn += 1;
      state.cells[action.payload].count += 1;
      console.log('turn ' + state.turn);
    },
    spread: (state, action: PayloadAction<number>) => {},
  },
});

export const { increaseTurn } = gameSlice.actions;
export default gameSlice.reducer;
