'use client'
import { useRouter } from 'next/navigation'

export default function WorkoutPage() {
  const router = useRouter()

  const handleSelect = (type) => {
    router.push(`/workout/generate?type=${type}`)
  }

  return (
    <div>
      <h1>Select Workout Type</h1>
      <button onClick={() => handleSelect('push')}>Push</button>
      <button onClick={() => handleSelect('pull')}>Pull</button>
      <button onClick={() => handleSelect('upper')}>Upper Body</button>
      <button onClick={() => handleSelect('lower')}>Lower Body</button>
    </div>
  )
}
