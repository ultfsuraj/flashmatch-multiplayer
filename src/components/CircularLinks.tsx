'use client';

import { motion, useAnimation } from 'motion/react';
import { ComponentType, lazy, useEffect, useRef, useState } from 'react';
import { GAMES } from ' @/utils/constants';
import type { ColorWarsContainerProps } from ' @/containers/ColorWarsContainer';

import LazyComponent from ' @/components/LazyComponent';
import { ChessContainerProps } from ' @/containers/ChessContainer';
import { cn } from ' @/utils/cn';

const DYNAMIC_COMPONENTS = new Array(8);

for (let i = 0; i < 8; i++) {
  DYNAMIC_COMPONENTS[i] = lazy(
    () =>
      new Promise<typeof import(' @/containers/NewGameContainer')>((resolve) =>
        setTimeout(() => resolve(import(' @/containers/NewGameContainer')), 1000)
      )
  );
}

DYNAMIC_COMPONENTS[5] = lazy(
  () =>
    new Promise<typeof import(' @/containers/ChessContainer')>((resolve) =>
      setTimeout(() => resolve(import(' @/containers/ChessContainer')), 1000)
    )
);
DYNAMIC_COMPONENTS[7] = lazy(
  () =>
    new Promise<typeof import(' @/containers/ColorWarsContainer')>((resolve) =>
      setTimeout(() => resolve(import(' @/containers/ColorWarsContainer')), 1000)
    )
);

const getRadius = (w: number, h: number) => {
  if (h < 2 * w) return h / 2;
  return (h * h - 4 * w * w) / (8 * w) + w;
};

const CircularLinks = ({ isReady }: { isReady: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const nameRef = useRef<number>(3);
  const [open, setOpen] = useState<boolean>(false);
  const [gameOpen, setGameOpen] = useState<boolean>(false);
  const [gameId, setGameId] = useState<number>(-1);

  const controlsARR = useRef([
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
    useAnimation(),
  ]);

  const [r, setR] = useState<number>(0);
  const [w, setW] = useState<number>(0);
  const [h, setH] = useState<number>(0);
  const [chordAngle, setChordAngle] = useState<number>(0);
  const [POSITIONS, setPOSITIONS] = useState<{ id: number; x: number; y: number; scale: number }[]>([]);

  useEffect(() => {
    isReady();
    const width = containerRef.current?.offsetWidth || 0;
    const height = containerRef.current?.offsetHeight || 0;
    const radius = getRadius(width, height);
    setR(radius);
    setW(width);
    setH(height);
    setChordAngle(2 * Math.atan(height / 2 / (radius - width)) * (180 / Math.PI));
  }, []);

  useEffect(() => {
    setPOSITIONS([
      { id: 0, x: circX(-chordAngle / 2 - 1), y: circY(-chordAngle / 2 - 1), scale: 0.25 },
      { id: 1, x: circX(-(23 * (chordAngle / 2)) / 30), y: circY(-(23 * (chordAngle / 2)) / 30), scale: 0.45 },
      { id: 2, x: circX(-(13 * (chordAngle / 2)) / 30), y: circY(-(13 * (chordAngle / 2)) / 30), scale: 0.7 },
      { id: 3, x: circX(0), y: circY(0), scale: 1 },
      { id: 4, x: circX((13 * (chordAngle / 2)) / 30), y: circY((13 * (chordAngle / 2)) / 30), scale: 0.7 },
      { id: 5, x: circX((23 * (chordAngle / 2)) / 30), y: circY((23 * (chordAngle / 2)) / 30), scale: 0.45 },
      { id: 6, x: circX(chordAngle / 2 + 1), y: circY(chordAngle / 2 + 1), scale: 0.25 },
      { id: 7, x: circX(-chordAngle), y: circY(-chordAngle), scale: 0.1 },
    ]);
  }, [chordAngle]);

  const circX = (extra: number) => r * Math.cos((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetWidth || 0) / 2;
  const circY = (extra: number) => r * Math.sin((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetHeight || 0) / 2;

  const handleDragEnd = async (down: boolean) => {
    const len = POSITIONS.length;

    await Promise.all(
      controlsARR.current.map((control, index) =>
        control.start({
          ...POSITIONS[(index + (down ? 1 : -1) + len) % len],
          transition: { type: 'spring', duration: 0.3, bounce: 0.2 },
        })
      )
    );

    const newPositions = [...POSITIONS];
    if (down) {
      newPositions.push(newPositions[0]);
      newPositions.splice(0, 1);
      for (let i = 0; i < len; i++) {
        newPositions[i].id = i;
      }
    } else {
      newPositions.unshift(newPositions[len - 1]);
      newPositions.pop();
      for (let i = 0; i < len; i++) {
        newPositions[i].id = i;
      }
    }
    nameRef.current = (nameRef.current + POSITIONS.length + (down ? -1 : 1)) % POSITIONS.length;
    setPOSITIONS(newPositions);
  };

  const handleClick = (id: number) => {
    const control = controlsARR.current[id];
    control.start({
      height: !open ? '100dvh' : div1Ref.current?.offsetHeight,
      width: !open ? '100vw' : div1Ref.current?.offsetWidth,
      x: !open ? 2 * r - w : POSITIONS[id].x,
      y: !open ? 10 : POSITIONS[id].y,
      scale: !open ? 1 : POSITIONS[id].scale,
      zIndex: !open ? POSITIONS.length + 50 : 0,
      borderRadius: !open ? '0%' : '50%',
      transition: { type: 'spring', duration: 0.3, bounce: 0 },
    });
    if (!open) setGameOpen(true);
    setOpen((prev) => !prev);
    setGameId(id);
  };

  return (
    <div
      ref={containerRef}
      className={cn('h-[81dvh]', 2 * window.innerWidth > window.innerHeight ? 'w-[38dvh]' : 'w-[65%]')}
    >
      {/* circle */}
      <motion.div
        className="rounded-full"
        style={{
          height: 2 * r,
          width: 2 * r,
          x: -(2 * r - w),
          y: -10,
          backgroundImage: 'radial-gradient(circle at center, #000000 0%,#0a1026 60%, #fff 100%)',
        }}
      >
        {/* controller  */}
        <motion.div
          className="absolute h-32 w-32 rounded-full border border-neutral-500 bg-transparent"
          ref={div1Ref}
          style={{
            x: circX(0),
            y: circY(0),
            scale: 1.3,
            backgroundImage: 'radial-gradient(circle at center, #000000 0%,#0a1026 60%, #fff 100%)',
          }}
        ></motion.div>
        {/* game name */}
        <motion.div
          className="font-bangers flex-center absolute h-32 bg-transparent px-4 text-lg font-semibold text-white"
          style={{
            x: circX(0) - w + (div1Ref.current?.offsetWidth || 130) / 2,
            y: circY(0),
          }}
        >
          {GAMES[nameRef.current].name}
        </motion.div>

        {/* arrows */}
        <motion.div
          className="font-bangers flex-center absolute h-32 cursor-pointer bg-transparent px-4 text-3xl font-semibold text-white select-none"
          style={{
            x: circX(0) + 0.8 * (div1Ref.current?.offsetWidth || 130),
            y: circY(0) - 0.9 * (div1Ref.current?.offsetWidth || 130),
            rotateZ: -90,
          }}
          onClick={() => handleDragEnd(false)}
        >
          {'>>>>'}
        </motion.div>
        <motion.div
          className="font-bangers flex-center absolute h-32 cursor-pointer bg-transparent px-4 text-3xl font-semibold text-white select-none"
          style={{
            x: circX(0) + 0.8 * (div1Ref.current?.offsetWidth || 130),
            y: circY(0) + (div1Ref.current?.offsetWidth || 130),
            rotateZ: 90,
          }}
          onClick={() => handleDragEnd(true)}
        >
          {'>>>>'}
        </motion.div>

        {/* items */}

        {POSITIONS.map((pos, index) => {
          let Dynamic;
          if (index == 7) Dynamic = DYNAMIC_COMPONENTS[index] as ComponentType<ColorWarsContainerProps>;
          else Dynamic = DYNAMIC_COMPONENTS[index] as ComponentType<ChessContainerProps>;

          return (
            <motion.div
              key={pos.id}
              className="flex-center absolute h-32 w-32"
              style={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
                backgroundImage: GAMES[pos.id].bgImage,
                borderRadius: '50%',
              }}
              animate={controlsARR.current[pos.id]}
              drag={open ? false : 'y'}
              dragConstraints={{ top: pos.y, bottom: pos.y }}
              dragElastic={0.03}
              onDragEnd={(e, info) => {
                handleDragEnd(info.velocity.y > 0);
              }}
              onClick={() => {
                if (!gameOpen) handleClick(pos.id);
              }}
            >
              <LazyComponent parentRef={containerRef}>
                <Dynamic
                  initial={false}
                  animate={{
                    width: gameOpen && pos.id == gameId ? window.innerWidth : div1Ref.current?.offsetWidth || 120,
                    height: gameOpen && pos.id == gameId ? window.innerHeight : div1Ref.current?.offsetWidth || 120,
                    borderRadius: gameOpen && pos.id == gameId ? '0%' : '50%',
                    userSelect: gameOpen && pos.id == gameId ? 'none' : 'auto',
                    touchAction: gameOpen && pos.id == gameId ? 'none' : 'auto',
                    y: gameOpen && pos.id == gameId ? -(containerRef?.current?.getBoundingClientRect().top || 0) : 0,
                  }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.2, delay: 0.05 }}
                  layout
                  index={index}
                  onClick={() => {
                    if (gameOpen) {
                      handleClick(pos.id);
                    }

                    setGameOpen(false);
                    setGameId(-1);
                  }}
                  iconHeight={div1Ref.current?.offsetHeight || 120}
                  gameOpen={gameOpen && pos.id == gameId}
                />
              </LazyComponent>
            </motion.div>
          );
        })}

        <div
          className="absolute h-[100vh] w-[100vw]"
          style={{ display: open ? 'block' : 'none', zIndex: POSITIONS.length + 10, left: 2 * r - w, top: 10 }}
        ></div>
      </motion.div>
    </div>
  );
};

export default CircularLinks;
