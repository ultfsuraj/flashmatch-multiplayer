'use client';

import { motion, useAnimation } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const getRadius = (w: number, h: number) => {
  if (h < 2 * w) return 0;
  return (h * h - 4 * w * w) / (8 * w) + w;
};

const CircularGalary = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const controller = useAnimation();

  const [r, setR] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [chordAngle, setChordAngle] = useState(0);
  const [POSITIONS, setPOSITIONS] = useState<{ x: number; y: number; scale: number }[]>([]);

  useEffect(() => {
    const width = containerRef.current?.offsetWidth || 0;
    const height = containerRef.current?.offsetHeight || 0;
    setR(getRadius(width, height));
    setW(width);
    setH(height);
    setChordAngle(2 * Math.atan(height / 2 / (getRadius(width, height) - width)) * (180 / Math.PI));
  }, []);

  useEffect(() => {
    setPOSITIONS([
      {
        x: circX(-chordAngle / 2 - 1),
        y: circY(-chordAngle / 2 - 1),
        scale: 0.3,
      },
      {
        x: circX(-(23 * (chordAngle / 2)) / 30),
        y: circY(-(23 * (chordAngle / 2)) / 30),
        scale: 0.5,
      },
      {
        x: circX(-(13 * (chordAngle / 2)) / 30),
        y: circY(-(13 * (chordAngle / 2)) / 30),
        scale: 0.7,
      },
      {
        x: circX(0),
        y: circY(0),
        scale: 1,
      },
      {
        x: circX((13 * (chordAngle / 2)) / 30),
        y: circY((13 * (chordAngle / 2)) / 30),
        scale: 0.7,
      },
      {
        x: circX((23 * (chordAngle / 2)) / 30),
        y: circY((23 * (chordAngle / 2)) / 30),
        scale: 0.5,
      },
      {
        x: circX(chordAngle / 2 + 1),
        y: circY(chordAngle / 2 + 1),
        scale: 0.3,
      },
    ]);
  }, [chordAngle]);

  const circX = (extra: number) => r * Math.cos((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetWidth || 0) / 2;
  const circY = (extra: number) => r * Math.sin((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetHeight || 0) / 2;
  const handleDragEnd = () => {};

  return (
    <div ref={containerRef} className="mt-[5vh] h-[90vh] w-[70vw] bg-zinc-300">
      <motion.div
        className="relative rounded-full bg-teal-200"
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

        {POSITIONS.map((pos, index) => (
          <motion.div
            key={index}
            className="absolute h-32 w-32 rounded-full bg-zinc-700"
            style={{
              x: pos.x,
              y: pos.y,
              scale: pos.scale,
            }}
            animate={index === 3 ? controller : {}}
            drag="y"
            dragConstraints={{ top: pos.y, bottom: pos.y }}
            dragElastic={0.03}
            whileTap={{ scale: 0.95 }}
            onDragEnd={(event, info) => {
              console.log(info.velocity.y > 0 ? 'down' : 'up');
            }}
          ></motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CircularGalary;
