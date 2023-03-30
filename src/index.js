const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const task = require('./models/task')

const app = express()
const port = process.env.PORT | 3000

app.use(express.json())

app.listen(port, ()=>{
    console.log("Task-manager server listening on port:", port)
})

app.post("/users", (req, res)=>{
    const newUser = new User(req.body)
    newUser.save().then(()=>{
        res.send(newUser)
    }).catch(e=>{
        res.status(400).send(e)
    })
})