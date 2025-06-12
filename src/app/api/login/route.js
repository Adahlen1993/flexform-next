import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(req) {
  const { login, password } = await req.json()

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: login }, { username: login }]
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }

    const token = signToken({ userId: user.id })

    // Remove sensitive fields
    const { password: _, ...safeUser } = user

    return new Response(
      JSON.stringify({
        success: true,
        token,
        user: safeUser,
      }),
      {
        status: 200,
        headers: {
          'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=604800${
            process.env.NODE_ENV === 'production' ? '; Secure' : ''
          }`,
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Login failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
