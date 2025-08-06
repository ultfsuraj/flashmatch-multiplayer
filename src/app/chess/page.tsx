import React from 'react';

const Page = async () => {
  await new Promise((resolve) => setTimeout(() => resolve(''), 1000));
  return <div className="flex-center font-bangers h-full w-full bg-emerald-800 text-2xl text-white">Chess</div>;
};

export default Page;
