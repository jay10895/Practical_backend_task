const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const jwt = require('jsonwebtoken')

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email,  role: user.role, }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  })
}

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const hashed = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        role,
      },
    })

    res.status(201).json({
      message: 'Signup successful',
      token: generateToken(user),
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    res.status(200).json({ message: 'Login successful', token: generateToken(user), user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { signup, login }