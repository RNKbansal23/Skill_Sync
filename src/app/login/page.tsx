'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, KeyRound, User, LoaderCircle } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (mode === 'register') {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
        setError('Please fill all fields')
        setLoading(false)
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        router.push('/dashboard')
        window.location.replace('/dashboard')
      } else {
        setError(data.message || 'Registration failed')
      }
    } else {
      if (!form.email.trim() || !form.password.trim()) {
        setError('Please enter email and password')
        setLoading(false)
        return
      }
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        router.push('/dashboard')
        window.location.replace('/dashboard')
      } else {
        setError(data.message || 'Login failed')
      }
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setError(null)
  }

  // --- Start of New Inverted Design (JSX) ---
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Image and Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1597773150796-e5c14ebecbf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Abstract background"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Centered Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div
          className="w-full max-w-md p-8 space-y-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl
                     border border-white/20 backdrop-blur-md"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Synergy</h1>
            <p className="mt-2 text-orange-100">
              {mode === 'login' ? 'Welcome back! Please login to your account.' : 'Create an account to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full text-white bg-white/20 border border-transparent rounded-lg px-3 py-3 pl-10 placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white transition"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full text-white bg-white/20 border border-transparent rounded-lg px-3 py-3 pl-10 placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>

            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full text-white bg-white/20 border border-transparent rounded-lg px-3 py-3 pl-10 placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>
            
            {mode === 'register' && (
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-200" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full text-white bg-white/20 border border-transparent rounded-lg px-3 py-3 pl-10 placeholder-orange-100 focus:outline-none focus:ring-2 focus:ring-white transition"
                  required
                />
              </div>
            )}
            
            {error && (
              <div className="text-center text-sm text-white bg-red-500/50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center items-center bg-white text-orange-600 font-bold py-3 rounded-lg transition-all duration-300 hover:bg-orange-100 disabled:bg-orange-100/50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-100"
              disabled={loading}
            >
              {loading && <LoaderCircle className="animate-spin mr-2 h-5 w-5" />}
              {loading
                ? mode === 'login'
                  ? 'Logging in...'
                  : 'Registering...'
                : mode === 'login'
                  ? 'Login'
                  : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-sm text-orange-100">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  className="font-semibold text-white hover:underline"
                  onClick={switchMode}
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  className="font-semibold text-white hover:underline"
                  onClick={switchMode}
                >
                  Login here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}