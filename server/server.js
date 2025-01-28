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
app.use('/api/blog', require('./routes/blogRoute'))
app.use('/api/blog-rating', require('./routes/blogRatingRoute'))
app.use('/api/comment', require('./routes/commentRoute'))
app.use('/api/like', require('./routes/likeRoute'))

const port = process.env.PORT

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}/`)
})
