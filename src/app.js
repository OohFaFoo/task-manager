const express = require('express')

// requiring this will start the connection
require('./db/mongoose')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()

// expect the body of the requests to be in json format
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app

