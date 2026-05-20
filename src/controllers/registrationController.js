const prisma = require('../config/db')

const registerEvent = async (req, res) => {
  try {
    const userId = req.user.id
    const { eventId } = req.body

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    })

    if (!event) {
      return res.status(404).json({
        message: 'Event not found',
      })
    }

    const existingRegistration =
      await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })

    if (existingRegistration) {
      return res.status(400).json({
        message: 'Already registered for this event',
      })
    }

    const registrationCount = await prisma.registration.count({
      where: {
        eventId,
      },
    })

    if (registrationCount >= event.capacity) {
      return res.status(400).json({
        message: 'Event is full',
      })
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
      },
    })

    res.status(201).json({
      message: 'Registration successful',
      registration,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const cancelRegistration = async (req, res) => {
  try {
    const userId = req.user.id
    const { eventId } = req.body

    const existingRegistration =
      await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })

    if (!existingRegistration) {
      return res.status(404).json({
        message: 'Registration not found',
      })
    }

    await prisma.registration.delete({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    })

    res.status(200).json({
      message: 'Registration cancelled successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  registerEvent,
  cancelRegistration,
}