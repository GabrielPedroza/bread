import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="relative -top-4 flex items-center justify-between p-4">
      <div className="relative mr-2 h-24 w-36 -rotate-[20deg]">
        <Image src={"/bread-logo.png"} alt="" fill />
      </div>
      <div className="flex">
        <Link href={"/login"}>
          <div className="mr-4 cursor-pointer rounded bg-amber-950 px-10 py-[0.75rem] text-white transition-all hover:scale-105 hover:bg-amber-900">
            Sign Up
          </div>
        </Link>
        <Link href={"/login"}>
          <div className="mr-4 cursor-pointer rounded bg-amber-950 px-10 py-[0.75rem] text-white transition-all hover:scale-105 hover:bg-amber-900">
            Login
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
