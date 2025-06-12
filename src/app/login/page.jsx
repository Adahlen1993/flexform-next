'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ login: '', password: '' })
  const setUser = useAuthStore((state) => state.setUser)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const data = await res.json()
      setUser(data.user)

      // 🔁 Add this small delay before redirecting
      setTimeout(() => {
        router.push('/dashboard')
      }, 100) // 100ms delay to allow the Set-Cookie header to take effect
    } else {
      const data = await res.json()
      alert(data.error || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        placeholder="Email or Username"
        required
        onChange={(e) => setForm({ ...form, login: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  )
}
