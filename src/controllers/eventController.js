const prisma = require('../config/db')

const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: req.body,
    })

    res.status(201).json({
      status: 201,
      message: 'Event created successfully',
      event,
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

const getEvents = async (req, res) => {
  try {
    //
    // CURRENT LOGIN USER
    //
    const userId = req.user.id

    const events = await prisma.event.findMany({
      include: {
        registrations: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    })

    //
    // MODIFY EVENT RESPONSE
    //
    const modifiedEvents = events.map(
      event => {
        //
        // CHECK USER REGISTERED OR NOT
        //
        const isRegistered =
          event.registrations.some(
            registration =>
              registration.userId ===
              userId
          )

        //
        // TOTAL REGISTERED USERS
        //
        const totalRegisteredUsers =
          event.registrations.length

        //
        // REMAINING SEATS
        //
        const remainingSeats =
          event.capacity -
          totalRegisteredUsers

        return {
          ...event,

          isRegistered,

          totalRegisteredUsers,

          remainingSeats,
        }
      }
    )

    res.status(201).json({
      status: 201,
      message: 'Events retrieved successfully',
      events: modifiedEvents,
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params

    const event = await prisma.event.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    })

    res.status(201).json({
      status: 201,
      message: 'Event updated successfully',
      event,
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    // delete registrations first
    await prisma.registration.deleteMany({
      where: {
        eventId: Number(id),
      },
    })

    // delete event
    await prisma.event.delete({
      where: {
        id: Number(id),
      },
    })

    res.status(201).json({
      status: 201,
      message: 'Event deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
}