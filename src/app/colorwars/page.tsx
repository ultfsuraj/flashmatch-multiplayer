import React from 'react';

const Page = async () => {
  await new Promise((resolve) => setTimeout(() => resolve(''), 500));
  return <div className="flex-center font-bangers h-full w-full bg-amber-800 text-2xl text-white">color wars</div>;
};

export default Page;
