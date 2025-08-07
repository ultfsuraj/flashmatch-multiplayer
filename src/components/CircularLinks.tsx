'use client';

import { motion, useAnimation } from 'motion/react';
import { lazy, useEffect, useRef, useState } from 'react';

import LazyComponent from ' @/components/LazyComponent';

// const Dynamic = lazy(
//   () =>
//     new Promise<typeof import(' @/components/Lazy1')>((resolve) =>
//       setTimeout(() => resolve(import(' @/components/Lazy1')), 3000)
//     )
// );

const DYNAMIC_COMPONENTS = new Array(8);
for (let i = 0; i < 8; i++) {
  DYNAMIC_COMPONENTS[i] = lazy(
    () =>
      new Promise<typeof import(' @/components/Lazy1')>((resolve) =>
        setTimeout(() => resolve(import(' @/components/Lazy1')), 3000)
      )
  );
}

const COLORS: Record<number, string> = {
  0: '#ffe6d2',
  1: '#cc66cc',
  2: '#ffb400',
  3: '#c73b32',
  4: '#32b4ff',
  5: '#995f3d',
  6: '#0ac832',
  7: '#1e2832',
};

const getRadius = (w: number, h: number) => {
  if (h < 2 * w) return 0;
  return (h * h - 4 * w * w) / (8 * w) + w;
};

const CircularLinks = ({ isReady }: { isReady: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const activeIdRef = useRef<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [gameOpen, setGameOpen] = useState<boolean>(false);

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

  // useEffect(() => {
  //   if (!gameOpen && activeIdRef.current != -1) {
  //     handleClick(activeIdRef.current);
  //     activeIdRef.current = -1;
  //   }
  // }, [gameOpen]);

  const circX = (extra: number) => r * Math.cos((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetWidth || 0) / 2;
  const circY = (extra: number) => r * Math.sin((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetHeight || 0) / 2;

  const handleDragEnd = async (down: boolean) => {
    const len = POSITIONS.length;

    await Promise.all(
      controlsARR.current.map((control, index) =>
        control.start({
          ...POSITIONS[(index + (down ? 1 : -1) + len) % len],
          transition: { type: 'spring', duration: 0.4, bounce: 0.3 },
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
    setPOSITIONS(newPositions);
  };

  const handleClick = async (id: number) => {
    if (!open) setGameOpen(true);
    setOpen((prev) => !prev);
    console.log(open ? 'open' : 'closed');
    const control = controlsARR.current[id];
    control.start({
      height: !open ? '100vh' : div1Ref.current?.offsetHeight,
      width: !open ? '100vw' : div1Ref.current?.offsetWidth,
      x: !open ? 2 * r - w : POSITIONS[id].x,
      y: !open ? 10 : POSITIONS[id].y,
      scale: !open ? 1 : POSITIONS[id].scale,
      zIndex: !open ? POSITIONS.length + 50 : id + 2,
      transition: { type: 'spring', duration: 0.4, bounce: 0.3 },
    });
  };

  return (
    <div ref={containerRef} className="h-[85vh] w-[65vw]">
      {/* circle */}
      <motion.div
        className="relative rounded-full bg-teal-300"
        style={{
          height: 2 * r,
          width: 2 * r,
          x: -(2 * r - w),
          y: -10,
        }}
      >
        {/* controller  */}
        <motion.div
          className="absolute h-32 w-32 rounded-full border border-zinc-800 bg-transparent"
          ref={div1Ref}
          style={{
            x: circX(0),
            y: circY(0),
            scale: 1.2,
          }}
        ></motion.div>

        {/* items */}

        {POSITIONS.map((pos, index) => {
          const Dynamic = DYNAMIC_COMPONENTS[index];

          return (
            <motion.div
              key={pos.id}
              className="flex-center absolute h-32 w-32 rounded-full bg-zinc-700"
              style={{
                x: pos.x,
                y: pos.y,
                scale: pos.scale,
              }}
              animate={controlsARR.current[pos.id]}
              drag={open ? false : 'y'}
              dragConstraints={{ top: pos.y, bottom: pos.y }}
              dragElastic={0.03}
              onDragEnd={(e, info) => {
                handleDragEnd(info.velocity.y > 0);
              }}
              onClick={() => {
                activeIdRef.current = pos.id;
                if (!gameOpen) handleClick(pos.id);
              }}
            >
              <div className="flex-center h-full w-full rounded-full" style={{ backgroundColor: COLORS[pos.id] }}>
                <LazyComponent parentRef={containerRef}>
                  <Dynamic
                    index={index}
                    onClick={() => {
                      if (gameOpen) {
                        handleClick(pos.id);
                      }
                      setGameOpen(false);
                    }}
                  />
                </LazyComponent>
              </div>
            </motion.div>
          );
        })}

        <div
          className="absolute h-[100vh] w-[100vw] bg-amber-200"
          style={{ display: open ? 'block' : 'none', zIndex: POSITIONS.length + 10, left: 2 * r - w, top: 10 }}
        ></div>
      </motion.div>
    </div>
  );
};

export default CircularLinks;
