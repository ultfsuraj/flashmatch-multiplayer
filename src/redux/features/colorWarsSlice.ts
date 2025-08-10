import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type gameState = {
  rows: number;
  region1: Array<{ row: number; col: number }>;
  region2: Array<{ row: number; col: number }>;
};

const initialState: gameState = {
  rows: 8,
  region1: [],
  region2: [],
};

export const gameSlice = createSlice({
  name: 'colorWars',
  initialState,
  reducers: {},
});

export const {} = gameSlice.actions;
export default gameSlice.reducer;
