import Navbar from '../../components/Navbar';

export default function Login(){
    return (
        <div>
            <Navbar/>
            <main className="border">
                <div className="flex justify-center">
                    <form>
                        <h2>Username:</h2>
                        <input type="text" className="border-2 rounded-lg border-orange-500"/>
                    </form>
                </div>
            </main>
        </div>
    )
}