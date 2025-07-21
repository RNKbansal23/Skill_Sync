import Link from 'next/link'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user: { name?: string } | null = null;

  const JWT_SECRET = process.env.JWT_SECRET;
  if (token && JWT_SECRET) {
    try {
      const payload = jwt.verify(token, JWT_SECRET) as { name?: string };
      user = payload;
    } catch {
      user = null;
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-white shadow">
      <Link href="/" className="p-4 text-2xl font-bold text-orange-500">Synergy</Link>
      
      {user?.name ? (
        <div className="flex items-center gap-4 pr-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-orange-500">Dashboard</Link>
          <Link href="/projects" className="text-gray-700 hover:text-orange-500">Projects</Link>
          <Link href="/hackathons" className="text-gray-700 hover:text-orange-500">Hackathons</Link>
          <span className="text-orange-500 font-semibold">Hi, {user.name}</span>
        </div>
      ) : (
        <div className="flex self-stretch bg-orange-500 font-bold text-white">
          <Link 
            href="/login" 
            className="flex items-center px-5 transition-colors hover:bg-orange-600"
          >
            Login
          </Link>
          
          <div className="w-px bg-white/50"></div>

          <Link 
            href="/register" 
            className="flex items-center px-5 transition-colors hover:bg-orange-600"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  )
}