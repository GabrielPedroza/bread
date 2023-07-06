// import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="w-8 h-8 mr-2">
        <p>Logo</p>
      </div>
      <div className="flex">
        <div className="px-8 py-2 mr-4 text-white bg-black rounded">
         <Link href={'/login'}>Sign Up</Link>
        </div>
        <div className="px-8 py-2 text-white bg-black rounded mr-4">
          <Link href={'/login'}>Login</Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar