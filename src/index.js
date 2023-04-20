const express = require('express')

// requiring this will start the connection
require('./db/mongoose')

const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')


const app = express()

// the port given by the server, if none give default to 3000 
const port = process.env.PORT | 3000

// expect the body of the requests to be in json format
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Task-manager server listening on port:", port)
})

const {Task} = require('./models/task')
const {User} = require('./models/user')

const main = async () =>{
    const task = await Task.findOne()
    // await task.populate("owner")
    // console.log(task)


    const user = await User.findById(task.owner)
    await user.populate("tasks")
    console.log("\n\n\n******\nHere are the tasks\n******\n")
    console.log(user.tasks) 
}

// main()
