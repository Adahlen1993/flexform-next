'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function LogoutButton() {
  const router = useRouter()
  const clearUser = useAuthStore((state) => state.clearUser)

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    clearUser()
    router.push('/login')
  }

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
