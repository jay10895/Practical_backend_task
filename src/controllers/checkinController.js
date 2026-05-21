const prisma = require('../config/db')

//
// CHECK-IN USER
//
const checkIn = async (req, res) => {
  try {
    const { userId, eventId } = req.body

    //
    // CHECK USER ALREADY CHECKED-IN
    //
    const existingCheckin =
      await prisma.checkIn.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })

    if (existingCheckin) {
      return res.status(400).json({
        message:
          'User already checked in',
        status: 400,
      })
    }

    //
    // CHECK USER REGISTERED OR NOT
    //
    const registration =
      await prisma.registration.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
      })

    if (!registration) {
      return res.status(400).json({
        message:
          'User is not registered for this event',
        status: 400,
      })
    }

    //
    // CREATE CHECK-IN
    //
    const checkin =
      await prisma.checkIn.create({
        data: {
          userId,
          eventId,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          event: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },
      })

    res.status(201).json({
      status: 201,
      message: 'Check-in successful',
      checkin,
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

//
// SEARCH ATTENDEE
//
const searchAttendee = async (
  req,
  res
) => {
  try {
    const { query } = req.query

    //
    // SEARCH REGISTERED USERS
    //
    const attendees =
      await prisma.registration.findMany({
        where: {
          user: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },

              {
                email: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          event: {
            select: {
              id: true,
              title: true,
              location: true,
              date: true,
            },
          },
        },
      })

    res.status(201).json({
      status: 201,
      attendees
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

//
// GET ALL CHECK-IN LIST
//
const getCheckins = async (
  req,
  res
) => {
  try {
    const checkins =
      await prisma.checkIn.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          event: {
            select: {
              id: true,
              title: true,
              location: true,
            },
          },
        },

        orderBy: {
          checkedInAt: 'desc',
        },
      })

    res.status(201).json({
      status: 201,
      checkins
    })
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    })
  }
}

module.exports = {
  checkIn,
  searchAttendee,
  getCheckins,
}