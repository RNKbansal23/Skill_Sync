'use client'

import { useState } from 'react';
import { redirect } from 'next/navigation';

export default function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault()
        if (!email.trim() || !password.trim()) return

        const res = await fetch('api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password}),
        });

        const data = await res.json()

        if (res.ok){
            redirect('/dashboard');
        } else {
            alert(data.message || 'Login failed');
        }
    } 

    return (
        <div>
            <main className="border flex justify-center">
                    <form className="flex flex-col justify-center w-100 border p-10" onSubmit={handleSubmit}>
                        <h2>Email:</h2>
                        <input type="text" className="border-2 rounded border-orange-500" onChange={(e) => setEmail(e.target.value)}/>
                        <h2>Password:</h2>
                        <input type="password" className="border-2 rounded border-orange-500" onChange={(e) => setPassword(e.target.value)}/>
                        <button type="submit" className="mt-4 rounded-full py-2 w-30 text-white bg-orange-500">Login</button>
                    </form>
            </main>
        </div>
    )
}