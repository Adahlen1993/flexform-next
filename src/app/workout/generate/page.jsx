// /api/exercises/generate.js
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req) {
  const token = req.cookies.get('token')?.value
  const user = verifyToken(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') // 'push', 'pull', etc.

  const excluded = await prisma.userExcludedExercise.findMany({
    where: { userId: user.userId },
    select: { exerciseId: true },
  })
  const excludedIds = excluded.map((e) => e.exerciseId)

  const exercises = await prisma.exercise.findMany({
    where: {
      AND: [
        { exerciseTags: { some: { tag: { name: type } } } }, // filter by tag
        { id: { notIn: excludedIds } }, // exclude
      ],
    },
  })

  return new Response(JSON.stringify({ exercises }))
}
