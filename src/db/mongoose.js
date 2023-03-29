const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect("mongodb://127.0.0.1/task-manager-api")

const User = new mongoose.model("User", 
    {
        name: {
            type: String
        }, 
        password:{
            type: String,   
            trim: true,
            minlength:7,
            validate(value){
                if(value.toLowerCase().includes("password")){
                    throw new Error("Password cannont contain the word 'password'")
                }
            }
        },
        age: {
            type:Number
        }})

const Task = new mongoose.model("Task", {description:{type: String}, completed:{type: Boolean}} )

const me = new User({name:"alan", age:60,password:"sdfgsfdgsdfg54rgt"});
// const task1= new Task({description:"clean car", completed:true})
// const task2= new Task({description:"make dinner", completed:"false"})

me.save().then(()=>{
    console.log(me)
}).catch((e)=>{
    console.log(e)
})

// task1.save().then(()=>{
//     console.log(task1)
// }).catch((e)=>{
//     console.log(e)
// })

// task2.save().then(()=>{
//     console.log(task1)
// }).catch((e)=>{
//     console.log(e)
// })