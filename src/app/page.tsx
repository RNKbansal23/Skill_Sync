import Navbar from '../components/Navbar';

export default function Home(){
    return (
        <div>
            <Navbar/>
             <main className="bg-purple-500">
                <p className="text-3xl font-bold text-orange-500">Find your perfect project or hackathon partner. Connect with people whose skills complement yous and build something amazing together</p>
                <a href ="/login" className="">Get Started</a>
            </main>
        </div>
    )
}