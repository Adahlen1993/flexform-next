'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (res.ok) {
      router.push('/login')
    } else {
      alert(data.error || 'Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input type="email" placeholder="Email" required
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="text" placeholder="Username" required
        onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input type="password" placeholder="Password" required
        onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <input type="text" placeholder="First Name" required
        onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      <input type="text" placeholder="Last Name" required
        onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      <input type="date" placeholder="Date of Birth" required
        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
      <button type="submit">Register</button>
    </form>
  )
}
