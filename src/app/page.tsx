import { seoText1, seoText2 } from ' @/utils/constants';

import HomeContainer from ' @/containers/HomeContainer';

const Page = () => {
  return (
    <div
      className="flex h-[100dvh] w-full flex-col justify-between overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(to top, #f8fafc 0%, #fecaca 15%, #fca5a5 24%, #e7627d 46%, #b8235a 59%, #801357 71%, #3d1635 84%, #1c1a27 100%)',
      }}
    >
      <header className="flex-center font-bangers p-2 text-2xl text-white">Flash Match</header>
      <div id="experiment-skeleton" className="flex-center h-full w-full">
        <p className="text-[1px] text-transparent">{seoText1}</p>
        <p className="font-bangers px-2 text-center text-3xl font-semibold text-white">Loading...</p>
        <p className="text-[1px] text-transparent">{seoText2}</p>
      </div>
      <HomeContainer />
      <div></div>
      <div></div>
    </div>
  );
};

export default Page;
