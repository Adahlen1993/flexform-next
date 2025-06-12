import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export async function POST(req) {
  const { email, username, password, firstName, lastName, dateOfBirth } = await req.json()

  try {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    })
    if (existing) {
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
      },
    })

    return new Response(JSON.stringify({ success: true }), { status: 201 })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: 'Failed to register' }), { status: 500 })
  }
}
