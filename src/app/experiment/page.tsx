import { seoText1, seoText2 } from ' @/utils/constants';

import Container from ' @/app/experiment/Container';

const Page = () => {
  return (
    <div className="flex-center h-[100vh] w-full overflow-hidden">
      <div id="experiment-skeleton">
        <p className="text-[1px] text-transparent">{seoText1}</p>
        <p className="font-bangers px-2 text-center text-3xl font-semibold">Loading...</p>
        <p className="text-[1px] text-transparent">{seoText2}</p>
      </div>
      <Container />
    </div>
  );
};

export default Page;
