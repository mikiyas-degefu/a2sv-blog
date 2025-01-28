const express = require('express')
const connectDb = require('./config/dbConnection')
const errorHandler = require('./middleware/errorHandler')
require('dotenv').config()

connectDb()
const app = express()


app.use(express.json())  //req.body
app.use(errorHandler)

//routes
app.use('/api/user', require('./routes/userRoute'))

const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}/`)
})
