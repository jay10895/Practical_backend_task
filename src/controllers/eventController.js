const prisma = require('../config/db')

const createEvent = async (req, res) => {
  try {
    const event = await prisma.event.create({
      data: req.body,
    })

    res.status(201).json({
      message: 'Event created successfully',
      event,
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const getEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.status(200).json(events)
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      message: 'Event updated successfully',
      event,
    })
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json({
      message: 'Event deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
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