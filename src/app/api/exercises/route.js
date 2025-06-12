import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req) {
  const token = req.cookies.get('token')?.value
  const user = verifyToken(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  try {
    const exercises = await prisma.exercise.findMany()

    const excluded = await prisma.userExcludedExercise.findMany({
      where: { userId: user.userId },
      select: { exerciseId: true },
    })

    const excludedIds = excluded.map((e) => e.exerciseId)

    return new Response(
      JSON.stringify({ exercises, excludedIds }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error in /api/exercises:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
}
