import { Games } from 'flashmatch-multiplayer-shared';

export const seoText1: string = `Experience the thrill of multiplayer gaming with your friends in real-time! Whether you’re strategizing in
          classic online chess matches or competing in fast-paced color wars, playing ludo, our platform offers seamless
          and engaging 2-player online games designed for endless fun. Connect instantly, challenge your friends, and
          enjoy smooth gameplay with low latency and intuitive interfaces. Perfect for both casual players and
          competitive gamers, our multiplayer games provide an immersive experience that brings people together, no
          matter where they are.`;
export const seoText2: string = `Looking for the best place to play 2-player online games with friends? Dive into our wide selection of
          strategic and action-packed games like chess, color wars, ludo, and more, crafted to enhance your gaming
          experience. Our user-friendly platform ensures quick matchmaking, secure gameplay, and rich social features so
          you can chat, challenge, and celebrate victories with your friends. Boost your skills, climb leaderboards, and
          enjoy multiplayer gaming like never before—right here, where friendship and fun take center stage.`;

export const ICONS: string[] = [
  'https://www.svgrepo.com/show/521343/crying-face.svg',
  'https://www.svgrepo.com/show/521344/confused-face.svg',
  'https://www.svgrepo.com/show/521348/drooling-face.svg',
  'https://www.svgrepo.com/show/521355/face-savoring-food.svg',
  'https://www.svgrepo.com/show/521368/face-with-tears-of-joy.svg',
  'https://www.svgrepo.com/show/521366/face-with-rolling-eyes.svg',
  'https://www.svgrepo.com/show/521378/grinning-face-with-big-eyes.svg',
  'https://www.svgrepo.com/show/521386/kissing-face.svg',
];

export const GAMES: Array<{ name: keyof typeof Games; bgImage: string }> = [
  { name: 'ludo', bgImage: 'linear-gradient(45deg, #874da2 0%, #c43a30 100%)' },
  { name: 'ludo', bgImage: 'linear-gradient(120deg, #000000 0%, #7ED6DF 100%)' },
  {
    name: 'ludo',
    bgImage: 'linear-gradient(-225deg, #231557 0%, #44107A 29%, #FF1361 67%, #FFF800 100%)',
  },
  { name: 'ludo', bgImage: 'linear-gradient(-225deg, #473B7B 0%, #3584A7 51%, #30D2BE 100%)' },
  { name: 'ludo', bgImage: 'linear-gradient(135deg, #000000 0%, #166D3B 100%)' },
  { name: 'chess', bgImage: 'linear-gradient(130deg, #232526 0%, #1e3c72 100%)' },
  { name: 'ludo', bgImage: 'linear-gradient(135deg, #000000 0%, #E84393 100%)' },
  { name: 'colorWars', bgImage: 'linear-gradient(to right, #243949 0%, #517fa4 100%)' },
];

export const BLACK_PIECES: Record<string, string> = {
  pawn: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
  rook: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
  bishop: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
  knight: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
  queen: 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
  king: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

export const WHITE_PIECES: Record<string, string> = {
  pawn: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
  rook: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
  bishop: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
  knight: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
  queen: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
  king: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
};
