'use client'

import { useEffect, useState } from 'react'

export default function PreferencesPage() {
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
// This page allows users to manage their exercise preferences, including excluding exercises from their routine.
// It fetches the list of exercises and their exclusion status, allowing users to toggle inclusion/exclusion.
// The `toggleExclude` function updates the user's preferences by sending a POST request to the `/api/preferences/exclude` endpoint.
// The page uses React hooks to manage state and side effects, ensuring a responsive user interface.
// The `useEffect` hook fetches the initial list of exercises and their exclusion status when the component mounts.
// The `toggleExclude` function updates the exclusion status of an exercise and updates the local state accordingly.
// The page is designed to be user-friendly, with a simple table layout for managing preferences.
// The `excludedIds` state is a Set for efficient lookups and updates when toggling exercise exclusions.    