import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create tags
  const tagNames = [
    'biceps', 'triceps', 'arms', 'legs', 'shoulders', 'chest', 'back', 'core',
    'machine', 'free weight', 'upper body', 'lower body',
    'push', 'pull'
  ]

  const tags = {}
  for (const name of tagNames) {
    const tag = await prisma.exerciseTag.upsert({
      where: { name },
      update: {},
      create: { name },
    })
    tags[name] = tag
  }

  // Create exercises and attach tags
  const exercisesData = [
    { name: 'Bicep Curl', tags: ['biceps', 'arms', 'upper body', 'pull', 'machine'] },
    { name: 'Tricep Pushdown', tags: ['triceps', 'arms', 'upper body', 'push', 'machine'] },
    { name: 'Squat', tags: ['legs', 'lower body', 'push', 'free weight'] },
    { name: 'Deadlift', tags: ['back', 'legs', 'lower body', 'pull', 'free weight'] },
    { name: 'Shoulder Press', tags: ['shoulders', 'arms', 'upper body', 'push', 'machine'] }
  ]

  const exercises = {}
  for (const data of exercisesData) {
    const exercise = await prisma.exercise.upsert({
      where: { name: data.name },
      update: {},
      create: { name: data.name },
    })
    exercises[data.name] = exercise

    for (const tagName of data.tags) {
      await prisma.exerciseOnTag.upsert({
        where: {
          exerciseId_tagId: {
            exerciseId: exercise.id,
            tagId: tags[tagName].id,
          },
        },
        update: {},
        create: {
          exerciseId: exercise.id,
          tagId: tags[tagName].id,
        },
      })
    }
  }

  // Create test users
  const passwordHash = await bcrypt.hash('password123', 10)

  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: passwordHash,
      firstName: 'Test',
      lastName: 'User',
      dateOfBirth: new Date('1990-01-01'),
      isAdmin: false,
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      dateOfBirth: new Date('1985-01-01'),
      isAdmin: true,
    },
  })

  // Add preferences for test user
  await prisma.userPreferences.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      weightUnit: 'lbs',
      defaultSets: 3,
      promptFrequency: 1,
      preferredSplit: 'Upper/Lower',
    },
  })

  // Add exclusions for test user (exclude Tricep Pushdown)
  await prisma.userExcludedExercise.upsert({
    where: {
      userId_exerciseId: {
        userId: testUser.id,
        exerciseId: exercises['Tricep Pushdown'].id,
      },
    },
    update: {},
    create: {
      userId: testUser.id,
      exerciseId: exercises['Tricep Pushdown'].id,
    },
  })

  console.log('✅ Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
