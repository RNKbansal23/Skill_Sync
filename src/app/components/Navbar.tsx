    import Link from 'next/link';

    export default function Navbar(){
        return(
            <nav className="bg-white flex justify-between text-align">
                <Link href="/" className="text-orange-500 font-bold text-2xl p-4">SkillSync</Link>
                <div className="bg-orange-500 border-l-4 border-black-500 text-white font-bold px-5 flex gap-2 items-center">
                    <Link href="/login" className="">Login</Link>
                    <div className="bg-gray-400 w-px h-6 mx-3 bg-white"></div>
                    <Link href="/register" className="">Register</Link>
                </div>
            </nav>
        );
    }