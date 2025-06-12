import { PrismaClient } from '@prisma/client'
import { verifyToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req) {
  const token = req.cookies.get('token')?.value
  const user = verifyToken(token)
  if (!user) return new Response('Unauthorized', { status: 401 })

  const { exerciseId, exclude } = await req.json()

  try {
    if (exclude) {
      await prisma.userExcludedTag.create({
        data: {
          userId: user.userId,
          tagId: exerciseId, // adjust if storing tag vs. exercise ID
        }
      })
    } else {
      await prisma.userExcludedTag.deleteMany({
        where: {
          userId: user.userId,
          tagId: exerciseId,
        }
      })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to update' }), { status: 500 })
  }
}
