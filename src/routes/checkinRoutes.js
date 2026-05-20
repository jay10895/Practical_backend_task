const express = require('express')

const {
  checkIn,
  searchAttendee,
  getCheckins,
} = require('../controllers/checkinController')

const authMiddleware = require('../middleware/authMiddleware')

const roleMiddleware = require('../middleware/roleMiddleware')

const router = express.Router()

//
// CHECK-IN USER
//
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  checkIn
)

//
// SEARCH ATTENDEE
//
router.get(
  '/search',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  searchAttendee
)

//
// GET ALL CHECK-IN LIST
//
router.get(
  '/',
  authMiddleware,
  getCheckins
)

module.exports = router