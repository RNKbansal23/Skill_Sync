'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    if (mode === 'register') {
      if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
        alert('Please fill all fields')
        setLoading(false)
        return
      }
      if (form.password !== form.confirmPassword) {
        alert('Passwords do not match')
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
      } else {
        alert(data.message || 'Registration failed')
      }
    } else {
      if (!form.email.trim() || !form.password.trim()) {
        alert('Please enter email and password')
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
      } else {
        alert(data.message || 'Login failed')
      }
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login')
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-500">
          {mode === 'login' ? 'Login to Synergy' : 'Register for Synergy'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          {mode === 'register' && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          )}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600 transition"
            disabled={loading}
          >
            {loading
              ? mode === 'login'
                ? 'Logging in...'
                : 'Registering...'
              : mode === 'login'
                ? 'Login'
                : 'Register'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {mode === 'login' ? (
            <span>
              Don&apos;t have an account?{' '}
              <button
                className="text-orange-500 hover:underline"
                onClick={switchMode}
              >
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                className="text-orange-500 hover:underline"
                onClick={switchMode}
              >
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
