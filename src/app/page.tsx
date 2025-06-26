'use client'

import { useState, useEffect } from 'react';
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";

export default function Home(){
    const [search, setSearch] = useState ('');
    const [results, setResults] = useState<any[]>([])

    useEffect(() => {
      if (search.trim()===""){
        fetch('/api/projects/search')
        .then(res => res.json())
        .then(data => setResults(data));
      }
    }, [search])

    async function handleSearch(e: React.FormEvent) {
      e.preventDefault()
      if (!search.trim()) return

      const res = await fetch(`/api/projects/search?q=${encodeURIComponent(search)}`)
      const data = await res.json()
      setResults(data)
    }

    return (
        <div>
             <main className="bg-orange-500 p-10 text-center">
              <div className="flex flex-col mt-10 gap-4 font-bold text-white">
                <p className="text-3xl">Connect with people whose skills complement your and build something amazing together</p>
                <p className="text-2xl">Find your perfect project or hackathon partner. </p>
              </div>
              <button className="m-3 mt-10 text-orange-500 bg-white px-5 py-3 rounded-full hover:transform-"><a href ="/login" className="">Get Started</a></button>
            </main>
            <div className="text-center mt-10">
              <h1 className="text-2xl font-bold text-orange-500">Browse Projects</h1>
              <form className="mt-5 flex justify-center" onSubmit={handleSearch}>
                <div className="relative w-full max-w-xl">
                <input type="text" placeholder="Any project you want to work on?" value={search} onChange={(e)=>setSearch(e.target.value)} className="p-2 border rounded-full w-full pl-12 py-3 text-xl"/>
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/3 transform-translate-y-1/2 pointer-events-none"/>
                </div>
              </form>
              <div className="mt-6">
                {results.length > 0 && (
                  <ul className="max-w-xl mx-auto bg-white rounded shadow p-4 text-left">
                    {results.map(project => (
                      <li key={project.id} className="mb-2">
                        <span className="font-semibold text-orange-500">{project.title}</span>
                        <p className="text-gray-600">{project.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
        </div>
    )
}