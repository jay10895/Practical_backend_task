const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const registrationRoutes = require('./routes/registrationRoutes')
const checkinRoutes = require('./routes/checkinRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    message: 'Backend running successfully',
  })
})

app.use('/auth', authRoutes)
app.use('/events', eventRoutes)
app.use('/register', registrationRoutes)
app.use('/checkin', checkinRoutes)

module.exports = app