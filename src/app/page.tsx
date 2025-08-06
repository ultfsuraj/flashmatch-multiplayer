// import { seoText1, seoText2 } from ' @/utils/constants';

// import HomeContainer from ' @/containers/HomeContainer';

// const Page = () => {
//   return (
//     <div className="h-full w-full overflow-hidden">
//       <div id="experiment-skeleton" className="flex-center h-full w-full">
//         <p className="text-[1px] text-transparent">{seoText1}</p>
//         <p className="font-bangers px-2 text-center text-3xl font-semibold">Loading...</p>
//         <p className="text-[1px] text-transparent">{seoText2}</p>
//       </div>
//       <HomeContainer />
//     </div>
//   );
// };

// export default Page;

import React from 'react';

const Page = async () => {
  await new Promise((resolve) => setTimeout(() => resolve(''), 300));
  return <div className="flex-center font-bangers h-full w-full bg-stone-600 text-2xl text-white">Home</div>;
};

export default Page;
