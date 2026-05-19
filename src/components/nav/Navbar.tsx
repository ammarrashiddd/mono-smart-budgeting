import { usePathname, useRouter } from "next/navigation";
import NavDashboard from "./NavDashboard";
import NavMain from "./NavMain";

type NavbarProps = {
  name?: string | null;
};

export default function Navbar({ name }: NavbarProps) {
  const Router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <main className="flex items-center justify-between w-full">
      <h1
        onClick={() => Router.push("/")}
        className="text-primary text-2xl md:text-4xl font-black tracking-tighter cursor-pointer select-none"
      >
        MONO.
      </h1>

      <div className="flex items-center gap-1.5 md:gap-4">
        {isDashboard ? (
          <>
            <NavDashboard name={name} />
          </>
        ) : (
          <>
            <NavMain />
          </>
        )}
      </div>
    </main>
  );
}
