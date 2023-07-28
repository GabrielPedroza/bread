// import Image from "next/image"
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="mr-2 h-8 w-8">
        <p>Logo</p>
      </div>
      <div className="flex">
        <div className="mr-4 rounded bg-black px-8 py-2 text-white">
          <Link href={"/login"}>Sign Up</Link>
        </div>
        <div className="mr-4 rounded bg-black px-8 py-2 text-white">
          <Link href={"/login"}>Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
