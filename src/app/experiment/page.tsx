import TextReveal from ' @/components/TextReveal';
import { seoText1, seoText2 } from ' @/utils/constants';

const Page = () => {
  return (
    <div className="flex-center h-[100vh] w-full">
      <div id="experiment-skeleton">
        {/* for seo */}
        <p className="text-[1px] text-transparent">{seoText1}</p>
        <p className="font-bangers px-2 text-center text-3xl font-semibold">Loading...</p>
        {/* for seo */}
        <p className="text-[1px] text-transparent">{seoText2}</p>
      </div>
      <TextReveal text="Flash Match" />
    </div>
  );
};

export default Page;
