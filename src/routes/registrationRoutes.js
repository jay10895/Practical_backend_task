const express = require('express')

const {
  registerEvent,
  cancelRegistration,
} = require('../controllers/registrationController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, registerEvent)

router.delete('/', authMiddleware, cancelRegistration)

module.exports = router