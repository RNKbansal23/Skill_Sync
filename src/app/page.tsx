import Navbar from './components/Navbar';

export default function Home(){
    return (
        <div>
            <Navbar/>
             <main className="">
                <p className="text-5xl font-bold">Find your perfect project or hackathon partner. Connect with people whose skills complement yous and build something amazing together</p>
                <a href ="/login" className="">Get Started</a>
            </main>
        </div>
    )
}