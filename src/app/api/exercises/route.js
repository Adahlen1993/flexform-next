import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET(req) {
  const token = req.cookies.get('token')?.value
  const user = verifyToken(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const exercises = await prisma.exercise.findMany()
  const excluded = await prisma.userExcludedTag.findMany({
    where: { userId: user.userId },
    include: { tag: true },
  })

  const excludedIds = new Set(excluded.map((e) => e.tagId)) // or exerciseId if direct

  return new Response(JSON.stringify({
    exercises,
    excludedIds: [...excludedIds],
  }))
}
