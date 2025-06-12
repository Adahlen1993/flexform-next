// src/lib/workoutUtils.js

// Define a list of muscle groups per workout type
export const WORKOUT_TAG_MAP = {
  push: ['push', 'chest', 'triceps', 'shoulders'],
  pull: ['pull', 'back', 'biceps'],
  upper: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  lower: ['legs', 'quads', 'hamstrings', 'glutes', 'calves'],
}

/**
 * Get the list of relevant tag names based on the selected workout type.
 * @param {string} type - 'push' | 'pull' | 'upper' | 'lower'
 * @returns {string[]} Array of tag names
 */
export function getTagsForWorkoutType(type) {
  return WORKOUT_TAG_MAP[type] || []
}
