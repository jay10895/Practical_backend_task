const prisma = require('../config/db')

const checkIn = async (req, res) => {
  try {
    const { userId, eventId } = req.body

    const existingCheckin = await prisma.checkIn.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (existingCheckin) {
      return res.status(400).json({
        message: 'User already checked in',
      })
    }

    const registration = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    if (!registration) {
      return res.status(400).json({
        message: 'User is not registered for this event',
      })
    }

    const checkin = await prisma.checkIn.create({
      data: {
        userId,
        eventId,
      },
    })

    res.status(201).json({
      message: 'Check-in successful',
      checkin,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  checkIn,
}