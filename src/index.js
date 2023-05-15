const app = require('./app')

// the port given by the server, if none give default to 3000 
const port = process.env.PORT

app.listen(port, ()=>{
    console.log("Task-manager server listening on port:", port)
})


