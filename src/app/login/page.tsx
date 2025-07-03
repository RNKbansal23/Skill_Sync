'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, KeyRound, User, LoaderCircle, Link } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [profileForm, setProfileForm] = useState({
    bio: '',
    linkedin: '',
    leetcode: '',
    // Add other Profile fields as needed
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showProfileForm, setShowProfileForm] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleProfileChange(e) {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
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
        setShowProfileForm(true)
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

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    // Send profileForm data to API
    const res = await fetch('/api/profile/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileForm),
    })
    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      router.push('/dashboard')
      window.location.replace('/dashboard')
    } else {
      setError(data.message || 'Profile creation failed')
    }
  }

  function switchMode() {
    setMode(prevMode => (prevMode === 'login' ? 'register' : 'login'))
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
    setError(null)
    setShowProfileForm(false)
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-orange-500">
      <div className="absolute top-0 left-0 h-full w-full lg:w-[80%] lg:[clip-path:polygon(0_0,100%_0,85%_100%,0%_100%)]">
        <img
          src="https://img.freepik.com/free-photo/young-students-learning-together-group-study_23-2149211067.jpg"
          alt="Students studying"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-orange-800/20 backdrop-blur-sx" />
      </div>
      <div className="relative z-10 flex min-h-screen items-center justify-center lg:justify-end">
        <div className="w-full max-w-md p-6 lg:mr-[10%]">
          <div className="relative overflow-hidden">
            <div className={`transition-all duration-500 ease-in-out ${showProfileForm ? 'h-[420px]' : mode === 'register' ? 'h-[560px]' : 'h-[420px]'}`}>
              {/* Profile Completion Form */}
              {showProfileForm ? (
                <div className="absolute w-full p-2 transition-all duration-700 ease-in-out opacity-100 translate-x-0">
                  <div className="space-y-6 rounded-3xl bg-white p-8 shadow-2xl border border-white/100">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-orange-500">Complete Your Profile</h1>
                      <p className="mt-2 text-orange-500">Tell us more about you!</p>
                    </div>
                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                      <div className="relative">
                        <textarea name="bio" placeholder="Bio" value={profileForm.bio} onChange={handleProfileChange} className="w-full rounded-lg border border-orange-500 bg-white/20 py-3 pl-4 placeholder-orange-200 transition focus:outline-none focus:ring-2 focus:ring-white" />
                      </div>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="text" name="linkedin" placeholder="LinkedIn URL" value={profileForm.linkedin} onChange={handleProfileChange} className="w-full rounded-lg border border-orange-500 bg-white/20 py-3 pl-10 placeholder-orange-200 transition focus:outline-none focus:ring-2 focus:ring-white" />
                      </div>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="text" name="leetcode" placeholder="LeetCode Username" value={profileForm.leetcode} onChange={handleProfileChange} className="w-full rounded-lg border border-orange-500 bg-white/20 py-3 pl-10 placeholder-orange-200 transition focus:outline-none focus:ring-2 focus:ring-white" />
                      </div>
                      {/* Add more Profile fields as needed */}
                      {error && <div className="rounded-lg bg-orange-500 p-3 text-center text-sm text-white">{error}</div>}
                      <button type="submit" disabled={loading} className="w-full flex justify-center items-center transform rounded-lg bg-orange-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-500 active:scale-100 disabled:cursor-not-allowed disabled:bg-orange-100/50">
                        {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : 'Save & Continue'}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
              <>
                {/* Login Form */}
                <div className={`absolute w-full p-2 transition-all duration-700 ease-in-out ${mode === 'login' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`}>
                  <div className="space-y-6 rounded-3xl bg-white p-8 shadow-2xl border border-white/100">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-orange-500">Synergy</h1>
                      <p className="mt-2 text-orange-500">Welcome back! Please login.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-orange-500 bg-white/20 py-3 pl-10 placeholder-orange-200 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-orange-500 bg-white/20 py-3 pl-10 placeholder-orange-200 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      {error && mode === 'login' && <div className="rounded-lg bg-orange-500 p-3 text-center text-sm text-white">{error}</div>}
                      <button type="submit" disabled={loading} className="w-full flex justify-center items-center transform rounded-lg bg-orange-500 py-3 font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-orange-500 active:scale-100 disabled:cursor-not-allowed disabled:bg-orange-100/50">
                        {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : 'Login'}
                      </button>
                    </form>
                    <div className="text-center text-sm text-orange-500">
                      <span>Don't have an account?{' '}
                        <button className="font-semibold text-orange-500 hover:underline" onClick={switchMode}>Register here</button>
                      </span>
                    </div>
                  </div>
                </div>
                {/* Register Form */}
                <div className={`absolute w-full p-2 transition-all duration-700 ease-in-out ${mode === 'register' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`}>
                  <div className="space-y-4 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 p-8 shadow-2xl border border-white/20">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white">Synergy</h1>
                      <p className="mt-2 text-orange-100">Create an account to start.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full rounded-lg border border-transparent bg-white/20 py-3 pl-10 text-white placeholder-orange-100 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full rounded-lg border border-transparent bg-white/20 py-3 pl-10 text-white placeholder-orange-100 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full rounded-lg border border-transparent bg-white/20 py-3 pl-10 text-white placeholder-orange-100 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-200" />
                        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} className="w-full rounded-lg border border-transparent bg-white/20 py-3 pl-10 text-white placeholder-orange-100 transition focus:outline-none focus:ring-2 focus:ring-white" required />
                      </div>
                      {error && mode === 'register' && <div className="rounded-lg bg-orange-500/50 p-3 text-center text-sm text-white">{error}</div>}
                      <button type="submit" disabled={loading} className="w-full flex justify-center items-center transform rounded-lg bg-white py-3 font-bold text-orange-600 transition-all duration-300 hover:scale-105 hover:bg-orange-100 active:scale-100 disabled:cursor-not-allowed disabled:bg-orange-100/50">
                        {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : 'Create Account'}
                      </button>
                    </form>
                    <div className="text-center text-sm text-orange-100">
                      <span>Already have an account?{' '}
                        <button className="font-semibold text-white hover:underline" onClick={switchMode}>Login here</button>
                      </span>
                    </div>
                  </div>
                </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
