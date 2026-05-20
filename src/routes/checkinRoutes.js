const express = require('express')

const { checkIn } = require('../controllers/checkinController')

const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, checkIn)

module.exports = router