import Image from "next/image";

import LandingImage from "../public/landing-image.png";

const LINK_STYLES = "opacity-30 transition-opacity hover:opacity-100";

const Home = () => {
  return (
    <>
      <main className="m-auto flex flex-col items-center justify-evenly overflow-hidden py-8 lg:py-16">
        <div className="my-10 flex flex-col items-center gap-3 px-16 text-center">
          <span className="text-6xl font-bold lg:text-7xl">Shrimp</span>
          <span className="text-lg opacity-50 lg:text-xl">
            Open-source, fully encrypted & self-hostable email service.
          </span>

          <span className="lg:text-md mt-6 rounded-full bg-green-300/60 px-6 py-2 text-sm">
            Coming soon to your nearest Docker&#8482;
          </span>
        </div>

        <div className="relative m-8 flex max-w-[2148px] justify-center lg:px-24">
          <div className="absolute -z-10 h-[100%] w-[100%] scale-[2] bg-gradient-radial from-white via-transparent via-60% to-transparent opacity-20"></div>
          <Image src={LandingImage} unoptimized alt="" className="w-[100vw] " />
        </div>

        <div className="flex gap-4">
          <a href="mailto:shrimp@fkrq.xyz" className={LINK_STYLES}>
            Contact
          </a>
          <span className="opacity-30">·</span>
          <a
            href="https://github.com/filipkania/shrimp"
            className={LINK_STYLES}
          >
            GitHub
          </a>
        </div>
      </main>
    </>
  );
};

export default Home;
