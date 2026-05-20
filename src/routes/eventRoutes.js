const express = require('express')

const {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController')

const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')

const router = express.Router()

router.get('/', getEvents)

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  createEvent
)

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  updateEvent
)

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  deleteEvent
)

module.exports = router