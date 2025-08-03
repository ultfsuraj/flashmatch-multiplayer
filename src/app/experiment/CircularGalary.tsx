'use client';

import { motion, useMotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const getRadius = (w: number, h: number) => {
  if (h < 2 * w) return 0;
  return (h * h - 4 * w * w) / (8 * w) + w;
};

const CircularGalary = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const [r, setR] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  const circX = (extra: number) => r * Math.cos((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetWidth || 0) / 2;

  const circY = (extra: number) => r * Math.sin((extra * Math.PI) / 180) + r - (div1Ref.current?.offsetHeight || 0) / 2;

  useEffect(() => {
    const width = containerRef.current?.offsetWidth || 0;
    const height = containerRef.current?.offsetHeight || 0;
    setR(getRadius(width, height));
    setW(width);
    setH(height);
  }, []);

  return (
    <div ref={containerRef} className="mt-[5vh] h-[90vh] w-[70vw] bg-zinc-300">
      <motion.div
        className="relative rounded-full bg-amber-200"
        style={{
          height: 2 * r,
          width: 2 * r,
          x: -(2 * r - w),
          y: -10,
        }}
      >
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-zinc-700"
          style={{
            x: circX(-55),
            y: circY(-55),
            scale: 0.6,
          }}
        ></motion.div>
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-zinc-700"
          style={{
            x: circX(-30),
            y: circY(-30),
            scale: 0.8,
          }}
        ></motion.div>
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-zinc-700"
          ref={div1Ref}
          style={{
            x: circX(0),
            y: circY(0),
          }}
        ></motion.div>
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-zinc-700"
          style={{
            x: circX(30),
            y: circY(30),
            scale: 0.8,
          }}
        ></motion.div>
        <motion.div
          className="absolute h-32 w-32 rounded-full bg-zinc-700"
          style={{
            x: circX(55),
            y: circY(55),
            scale: 0.6,
          }}
        ></motion.div>
      </motion.div>
    </div>
  );
};

export default CircularGalary;
