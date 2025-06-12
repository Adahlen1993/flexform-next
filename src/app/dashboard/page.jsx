'use client'

import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

export default function DashboardPage() {
  const router = useRouter()

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Welcome to your dashboard!</h1>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => router.push('/preferences')}>
          Go to Preferences
        </button>
        <button onClick={() => router.push('/workout')}>
  Start Workout
</button>


        <LogoutButton />
      </div>
    </div>
  )
}
