import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';


export default function Login(){
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if (!username.trim() || !password.trim()) return

        const res = await fetch(`api/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password}),
        });

        const data = await res.json()

        if (res.ok){
            navigate('/dashboard')
        }
    } 

    return (
        <div>
            <Navbar/>
            <main className="border">
                <div className="flex justify-center">
                    <form onSubmit={handleSubmit}>
                        <h2>Username:</h2>
                        <input type="text" className="border-2 rounded-lg border-orange-500" onChange={(e) => setUsername(e.target.value)}/>
                        <h2>Password:</h2>
                        <input type="password" className="border-2 rounded-lg border-orange-500" onChange={(e) => setPassword(e.target.value)}/>
                    </form>
                </div>
            </main>
        </div>
    )
}