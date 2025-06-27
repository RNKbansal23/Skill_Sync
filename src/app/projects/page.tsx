"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/Sidebar";
import { ChevronRight } from 'lucide-react'


export default function Home() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (search.trim() === "") {
      fetch("/api/projects/search")
        .then((res) => res.json())
        .then((data) => setResults(data));
    }
  }, [search]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;

    const res = await fetch(
      `/api/projects/search?q=${encodeURIComponent(search)}`
    );
    const data = await res.json();
    setResults(data);
  }

  return (
    <div>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <button
        onClick={toggleSidebar}
        className={`fixed top-20 left-4 z-30 w-12 h-12 flex items-center justify-center bg-orange-500 text-white rounded-lg shadow-xl hover:bg-orange-600 transition-all duration-300 transform hover:scale-110
                  ${isSidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-label="Toggle navigation"
      >
        <ChevronRight size={28} />
      </button>
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold text-orange-500">Browse Projects</h1>
        <form className="mt-5 flex justify-center" onSubmit={handleSearch}>
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Any project you want to work on?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="p-2 border rounded-full w-full pl-12 py-3 text-xl"
            />
            <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-4 top-1/3 transform-translate-y-1/2 pointer-events-none" />
          </div>
        </form>
        <div className="mt-6">
          {results.length > 0 && (
            <ul className="flex gap-7 p-4 text-left">
              {results.map((project) => (
                <div className="bg-white w-2xl rounded-sm shadow">
                  <li key={project.id} className="mb-2 p-3">
                    <span className="font-semibold text-orange-500">
                      {project.title}
                    </span>
                    <p className="text-gray-600">{project.description}</p>
                    <p>Owner: {project.owner.name}</p>
                  </li>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
