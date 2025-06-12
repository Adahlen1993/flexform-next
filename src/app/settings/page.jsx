'use client'

import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [exercises, setExercises] = useState([])
  const [excludedIds, setExcludedIds] = useState(new Set())

  useEffect(() => {
    const fetchExercises = async () => {
      const res = await fetch('/api/exercises')
      const data = await res.json()
      setExercises(data.exercises)
      setExcludedIds(new Set(data.excludedIds))
    }
    fetchExercises()
  }, [])

  const toggleExclude = async (exerciseId) => {
    const isExcluded = excludedIds.has(exerciseId)
    const res = await fetch('/api/preferences/exclude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exerciseId, exclude: !isExcluded }),
    })

    if (res.ok) {
      const newSet = new Set(excludedIds)
      if (isExcluded) newSet.delete(exerciseId)
      else newSet.add(exerciseId)
      setExcludedIds(newSet)
    }
  }

  return (
    <div>
      <h1>User Preferences</h1>
      <table>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Exclude</th>
          </tr>
        </thead>
        <tbody>
          {exercises.map((exercise) => (
            <tr key={exercise.id}>
              <td>{exercise.name}</td>
              <td>
                <button onClick={() => toggleExclude(exercise.id)}>
                  {excludedIds.has(exercise.id) ? 'Include' : 'Exclude'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
