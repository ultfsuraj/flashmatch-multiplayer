import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Events, Games } from 'flashmatch-multiplayer-shared';

export type cellType = { id: number; flip: number; count: number; frontColor: string; backColor: string };

type gameState = {
  gameInfo: {
    rows: number;
    turn: number;
    color: boolean;
    lastUpdated: number;
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
    rows: 6,
    turn: 1,
    color: true,
    lastUpdated: 0,
    neutralColor: 'bg-neutral-200',
    color1: 'bg-cyan-300',
    color2: 'bg-red-400',
  },
  regions: {
    one: 0,
    two: 0,
  },
  cells: initializeCells(6, 'bg-neutral-200'),
};

export const gameSlice = createSlice({
  name: 'colorWars',
  initialState,
  reducers: {
    updateColor: (state, action: PayloadAction<boolean>) => {
      state.gameInfo.color = action.payload;
    },
    increaseTurn: (state, action: PayloadAction<{ id: number; roomName: string }>) => {
      const { id, roomName } = action.payload;
      if (Object.values(state.cells).find((cell) => cell.id == id) == undefined) return;
      const prev = { ...state.cells[id] };
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
      state.gameInfo.lastUpdated = Date.now();

      const gameName: keyof typeof Games = 'colorWars';
      const gameState: Events['syncGameState']['payload'] & {
        state: {
          turn: number;
          roomName: string;
          cells: Record<number, cellType>;
          regions: { one: number; two: number };
        };
      } = {
        lastUpdated: state.gameInfo.lastUpdated,
        state: {
          turn: state.gameInfo.turn,
          roomName,
          cells: state.cells,
          regions: state.regions,
        },
      };
      localStorage.setItem(gameName, JSON.stringify(gameState));
    },
    spread: (state, action: PayloadAction<{ id: number; roomName: string }>) => {
      // logic to be updated, if count becomes more than 4 ?
      if (state.regions.one <= 0 || state.regions.two <= 0) return;

      const [n, { id, roomName }] = [state.gameInfo.rows, action.payload];
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
        count: state.cells[id].count - 4,
        flip: state.cells[id].flip + 180,
        frontColor: neutralColor,
        backColor: neutralColor,
      };

      state.gameInfo.lastUpdated = Date.now();

      const gameName: keyof typeof Games = 'colorWars';
      const gameState: Events['syncGameState']['payload'] & {
        state: {
          turn: number;
          roomName: string;
          cells: Record<number, cellType>;
          regions: { one: number; two: number };
        };
      } = {
        lastUpdated: state.gameInfo.lastUpdated,
        state: {
          turn: state.gameInfo.turn,
          roomName,
          cells: state.cells,
          regions: state.regions,
        },
      };
      localStorage.setItem(gameName, JSON.stringify(gameState));
    },
    syncGame: (
      state,
      action: PayloadAction<
        Events['syncGameState']['payload'] & {
          state: { turn: number; cells: Record<number, cellType>; regions: { one: number; two: number } };
        }
      >
    ) => {
      // console.log('current state time ', state.gameInfo.lastUpdated);
      if (action.payload.lastUpdated <= state.gameInfo.lastUpdated) return;
      if (!action.payload.state.cells) return;
      // console.log('to sync time ', action.payload.lastUpdated);
      const lastUpdated = action.payload.lastUpdated;
      const { turn, cells, regions } = action.payload.state;
      state.gameInfo.lastUpdated = lastUpdated;
      state.gameInfo.turn = turn;
      state.cells = cells;
      state.regions = regions;
    },
    resetGame: (state) => {
      state.gameInfo.turn = 1;
      state.gameInfo.lastUpdated = 0;
      state.gameInfo.color = true;
      state.cells = initializeCells(state.gameInfo.rows, 'bg-neutral-200');
      state.regions.one = 0;
      state.regions.two = 0;
    },
  },
});

export const { updateColor, increaseTurn, spread, syncGame, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
