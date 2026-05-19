import { useRouter } from "next/navigation";

export default function NavMain() {
  const Router = useRouter();

  return (
    <main className="flex flex-row gap-3">
      <button
        className="text-primary font-black px-3 md:px-4 py-2 hover:bg-primary/10 rounded-full transition-all text-xs md:text-base whitespace-nowrap"
        onClick={() => {
          Router.push("/auth?mode=signin");
        }}
      >
        Sign In
      </button>
      <button
        className="bg-primary text-secondary font-black px-4 md:px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-all text-xs md:text-base shadow-lg shadow-primary/10 whitespace-nowrap"
        onClick={() => {
          Router.push("/auth?mode=signup");
        }}
      >
        Get started
      </button>
    </main>
  );
}
