'use client';

import TextReveal from ' @/app/experiment/TextReveal';

const Page = () => {
  return (
    <div className="flex-center h-[100vh] w-full">
      <div id="experiment-skeleton">
        {/* for seo */}
        <p className="text-[1px] text-transparent">
          Experience the thrill of multiplayer gaming with your friends in real-time! Whether you’re strategizing in
          classic online chess matches or competing in fast-paced color wars, playing ludo, our platform offers seamless
          and engaging 2-player online games designed for endless fun. Connect instantly, challenge your friends, and
          enjoy smooth gameplay with low latency and intuitive interfaces. Perfect for both casual players and
          competitive gamers, our multiplayer games provide an immersive experience that brings people together, no
          matter where they are.
        </p>
        <p className="font-bangers px-2 text-center text-3xl font-semibold">Loading...</p>
        {/* for seo */}
        <p className="text-[1px] text-transparent">
          Looking for the best place to play 2-player online games with friends? Dive into our wide selection of
          strategic and action-packed games like chess, color wars, ludo, and more, crafted to enhance your gaming
          experience. Our user-friendly platform ensures quick matchmaking, secure gameplay, and rich social features so
          you can chat, challenge, and celebrate victories with your friends. Boost your skills, climb leaderboards, and
          enjoy multiplayer gaming like never before—right here, where friendship and fun take center stage.
        </p>
      </div>
      <TextReveal text="Flash Match" />
    </div>
  );
};

export default Page;
