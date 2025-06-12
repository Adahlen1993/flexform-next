import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'
import { getTagsForWorkoutType } from '@/lib/workoutUtils'

const prisma = new PrismaClient()

export async function GET(req) {
  const token = req.cookies.get('token')?.value
  const user = verifyToken(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')
  if (!type) {
    return new Response(JSON.stringify({ error: 'Workout type is required' }), { status: 400 })
  }

  const tags = getTagsForWorkoutType(type)

  const excluded = await prisma.userExcludedExercise.findMany({
    where: { userId: user.userId },
  })
  const excludedIds = excluded.map((e) => e.exerciseId)

  const exercises = await prisma.exercise.findMany({
    where: {
      exerciseTags: {
        some: {
          tag: { name: { in: tags } },
        },
      },
      id: { notIn: excludedIds },
    },
    include: { exerciseTags: { include: { tag: true } } },
  })

  return new Response(JSON.stringify(exercises))
}
