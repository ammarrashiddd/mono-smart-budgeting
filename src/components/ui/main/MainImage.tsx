import { useRouter } from "next/navigation";

export default function MainImage() {
  const Router = useRouter();

  return (
    <main>
      <div className="relative h-80 md:h-125 w-full rounded-xl overflow-hidden shadow-2xl">
        <img
          src="/assets/images/4.jpg"
          alt="Workspace"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40" />

        {/* Content Container */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-tight">
            Mulai langkah <br className="md:hidden" /> pertamamu.
          </h2>

          <button
            className="px-8 md:px-10 py-3 md:py-4 bg-white text-secondary font-black rounded-full hover:bg-tertiary hover:text-white transition-all duration-300 shadow-lg text-sm md:text-base scale-100 hover:scale-105 active:scale-95"
            onClick={() => {
              Router.push("/auth?mode=signup");
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </main>
  );
}
